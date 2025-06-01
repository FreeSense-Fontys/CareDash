import { useState } from 'react'
import { Check, Trash2, Plus } from 'lucide-react'
import exh from '../../Auth'
import { PatientResponse } from '../../types/PatientResponse'

interface VitalOption {
    name: string
    selected: boolean
}

interface TimingConfig {
    id: string
    interval: string
    frequency: number
    unit: string
}

interface AlertConfig {
    id: string
    vital: string
    operator: string
    value: string
}

interface EditConfigurationProps {
    activeCarepath: string
    // currentConfig: string
    alerts: any[]
    onCancel: () => void
    patient: PatientResponse
}

interface Alert {
    id: string
    data: {
        vital: string
        alertType: 'Above' | 'Below'
        threshold: number
        wearableId: string
        patientId?: string
        carepathId: string
    }
}

const EditConfigurationPage = ({
    activeCarepath,
    alerts,
    onCancel,
    patient,
}: EditConfigurationProps) => {
    async function createAlerts(alerts: Alert[]) {
        alerts.forEach(async (alert) => {
            await exh.data.documents.create('alert', alert.data)
        })
    }

    async function deleteAlerts(alerts: Alert[]) {
        alerts.forEach(async (alert) => {
            await exh.data.documents.remove('alert', alert.id)
        })
    }

    // Store initial state for cancel functionality
    const initialVitals = [
        { name: 'Heart Rate', selected: false },
        { name: 'Oxygen Saturation', selected: true },
        { name: 'Blood Pressure', selected: false },
        { name: 'Respiration Rate', selected: true },
        { name: 'Activity', selected: true },
        { name: 'Temperature', selected: false },
    ]

    // Available vitals with selection state
    const [vitals, setVitals] = useState<VitalOption[]>(initialVitals)
    const [tempAlerts, setTempAlerts] = useState<Alert[]>(alerts)

    // Timing configurations
    const [timingConfig, setTimingConfig] = useState<TimingConfig>({
        id: '1',
        interval: 'Interval',
        frequency: 3,
        unit: 'Minutes',
    })

    const toggleVital = (index: number) => {
        const newVitals = [...vitals]
        newVitals[index].selected = !newVitals[index].selected
        setVitals(newVitals)
    }

    const updateTimingConfig = (
        field: keyof TimingConfig,
        value: string | number
    ) => {
        setTimingConfig({ ...timingConfig, [field]: value })
    }

    const addAlert = () => {
        const newAlert: Alert = {
            // id: Date.now().toString(),
            data: {
                vital: 'BP',
                alertType: 'Above',
                threshold: 0,
                wearableId: patient.data.coupledWearables[0].wearableId,
                patientId: patient.id,
                carepathId: activeCarepath,
            },
        }
        setTempAlerts([...tempAlerts, newAlert])
    }

    const updateAlertConfig = (
        id: string,
        field: keyof AlertConfig,
        value: string
    ) => {
        setTempAlerts(
            tempAlerts.map((config) =>
                config.id === id ? { ...config, [field]: value } : config
            )
        )
    }

    const deleteAlertConfig = (id: string) => {
        setTempAlerts(tempAlerts.filter((config) => config.id !== id))
    }

    const handleSave = async () => {
        const newAlerts = tempAlerts.filter((alert) => !alert.id)
        const updateAlerts = tempAlerts.filter(
            (alert) =>
                alert !== alerts.find((a) => a.id === alert.id) &&
                newAlerts.find((a) => a.id === alert.id) === undefined
        )
        const removeAlerts = alerts.filter(
            (alert) => alert.id && !tempAlerts.find((a) => a.id === alert.id)
        )
        await deleteAlerts(removeAlerts)
        // console.log('Delete Alerts: ', deleteAlerts)
        updateAlerts.forEach(async (alert) => {
            await exh.data.documents.update('alert', alert.id, {
                vital: alert.data.vital,
                alertType: alert.data.alertType,
                threshold: alert.data.threshold,
            })
        })
        // createAlerts(newAlerts)
        // await refetchAlerts()
        onCancel()
    }

    const handleCancel = () => {
        // Reset to initial state and go back
        setVitals(initialVitals)
        setTimingConfig(timingConfig)
        console.log('Configuration cancelled - reset to initial state')
        // should refetch the alert data to make sure it reflects the latest state
        onCancel()
    }

    // Helper function to split array into columns
    const splitIntoTwoColumns = (items: any[]) => {
        const left: any[] = []
        const right: any[] = []
        items.forEach((item, idx) => {
            if (idx % 2 === 0) {
                left.push(item)
            } else {
                right.push(item)
            }
        })
        return [left, right]
    }
    const [alertLeft, alertRight] = splitIntoTwoColumns(tempAlerts)

    return (
        <div>
            <div className="h-[59vh] overflow-y-auto">
                <div className="space-y-8 mr-2">
                    {/* Vitals Section */}
                    <div className="grid grid-cols-4 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Vitals
                        </h2>
                        <div className="grid grid-cols-2 col-span-3 gap-4">
                            {vitals.map((vital, index) => (
                                <div
                                    key={vital.name}
                                    className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                                    onClick={() => toggleVital(index)}
                                >
                                    <div
                                        className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                                            vital.selected
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'border-gray-300'
                                        }`}
                                    >
                                        {vital.selected && <Check size={12} />}
                                    </div>
                                    <span className="text-gray-700">
                                        {vital.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timing Section */}
                    <div className="grid grid-cols-4 gap-4 border-t pt-4 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Timing
                        </h2>
                        <div className="col-span-3 flex gap-6">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                    <select
                                        value={timingConfig.interval}
                                        onChange={(e) =>
                                            updateTimingConfig(
                                                'interval',
                                                e.target.value
                                            )
                                        }
                                        className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Interval">
                                            Interval
                                        </option>
                                        <option value="Daily">Daily</option>
                                        <option value="Hourly">Hourly</option>
                                    </select>
                                    <span className="text-gray-600">Every</span>
                                    <input
                                        type="number"
                                        value={timingConfig.frequency}
                                        onChange={(e) =>
                                            updateTimingConfig(
                                                'frequency',
                                                parseInt(e.target.value) || 1
                                            )
                                        }
                                        className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="1"
                                    />
                                    <select
                                        value={timingConfig.unit}
                                        onChange={(e) =>
                                            updateTimingConfig(
                                                'unit',
                                                e.target.value
                                            )
                                        }
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Minutes">Minutes</option>
                                        <option value="Hours">Hours</option>
                                        <option value="Days">Days</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Alerts Section */}
                    <div className="grid grid-cols-4 gap-4 border-t pt-4 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Alerts
                        </h2>
                        <div className="col-span-3 flex gap-6">
                            {[alertLeft, alertRight].map(
                                (column, columnIndex) => (
                                    <div
                                        key={columnIndex}
                                        className="flex-1 space-y-2"
                                    >
                                        {column.map((config) => (
                                            <div
                                                key={config.id}
                                                className="flex items-center gap-3"
                                            >
                                                <select
                                                    value={config.data.vital}
                                                    onChange={(e) =>
                                                        setTempAlerts(
                                                            tempAlerts.map(
                                                                (alert) => {
                                                                    if (
                                                                        alert.id ===
                                                                        config.id
                                                                    ) {
                                                                        return {
                                                                            ...alert,
                                                                            data: {
                                                                                ...alert.data,
                                                                                vital: e
                                                                                    .target
                                                                                    .value,
                                                                            },
                                                                        }
                                                                    }
                                                                    return alert
                                                                }
                                                            )
                                                        )
                                                    }
                                                    className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="HR">
                                                        HR
                                                    </option>
                                                    <option value="SBP">
                                                        SBP
                                                    </option>
                                                    <option value="DBP">
                                                        DBP
                                                    </option>
                                                    <option value="SpO2">
                                                        SpO2
                                                    </option>
                                                    <option value="RR">
                                                        RR
                                                    </option>
                                                    <option value="ACT">
                                                        ACT
                                                    </option>
                                                    <option value="T">T</option>
                                                </select>

                                                <select
                                                    value={
                                                        config.data.alertType ==
                                                        'Above'
                                                            ? '>'
                                                            : '<'
                                                    }
                                                    onChange={(e) =>
                                                        setTempAlerts(
                                                            tempAlerts.map(
                                                                (alert) => {
                                                                    if (
                                                                        alert.id ===
                                                                        config.id
                                                                    ) {
                                                                        return {
                                                                            ...alert,
                                                                            data: {
                                                                                ...alert.data,
                                                                                alertType:
                                                                                    e
                                                                                        .target
                                                                                        .value ===
                                                                                    '>'
                                                                                        ? 'Above'
                                                                                        : 'Below',
                                                                            },
                                                                        }
                                                                    }
                                                                    return alert
                                                                }
                                                            )
                                                        )
                                                    }
                                                    className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="<">
                                                        &lt;
                                                    </option>
                                                    <option value=">">
                                                        &gt;
                                                    </option>
                                                </select>

                                                <input
                                                    type="text"
                                                    value={
                                                        config.data.threshold
                                                    }
                                                    onChange={(e) =>
                                                        setTempAlerts(
                                                            tempAlerts.map(
                                                                (alert) => {
                                                                    if (
                                                                        alert.id ===
                                                                        config.id
                                                                    ) {
                                                                        return {
                                                                            ...alert,
                                                                            data: {
                                                                                ...alert.data,
                                                                                threshold:
                                                                                    parseFloat(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    ) ||
                                                                                    0,
                                                                            },
                                                                        }
                                                                    }
                                                                    return alert
                                                                }
                                                            )
                                                        )
                                                    }
                                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="Value"
                                                />

                                                <button
                                                    onClick={() =>
                                                        deleteAlertConfig(
                                                            config.id
                                                        )
                                                    }
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}

                                        {columnIndex === 1 && (
                                            <button
                                                onClick={addAlert}
                                                className="mt-4 text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1 pb-1 pl-80"
                                            >
                                                <Plus size={16} />
                                                Add Alert
                                            </button>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div>
                <div className="flex justify-between pt-3 border-t">
                    <button
                        onClick={handleCancel}
                        className="bg-gray-500 text-white text-lg px-7 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="bg-secondary text-white text-lg px-7 py-2 rounded mr-5 hover:bg-accent"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditConfigurationPage
