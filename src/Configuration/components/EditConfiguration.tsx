import { useEffect, useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import exh from '../../Auth'
import { PatientResponse } from '../../types/PatientResponse'
import { Alert } from '../../types/Alert'
import EditVitalsSection from './EditVitalsSection'
import EditTimingSection from './EditTimingSection'
import { usePatient } from '../../contexts/PatientProvider'

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

interface EditConfigurationProps {
    activeCarepath: string
    alerts: Alert[]
    onCancel: () => void
    patient: PatientResponse
    wearableSchedule: any
}

async function createAlerts(alerts: Alert[]) {
    await Promise.all(
        alerts.map(async (alert) => {
            await exh.data.documents.create('alert', alert.data)
        })
    )
}
const vitalAbreviations = ['HR', 'SBP', 'DBP', 'SpO2', 'RR', 'ACT', 'T']
const vitalName = [
    { name: 'Heart Rate', abreviation: 'HR' },
    { name: 'Blood Pressure', abreviation: ['DBP', 'SBP'] },
    { name: 'Oxygen Saturation', abreviation: 'SpO2' },
    { name: 'Respiration Rate', abreviation: 'RR' },
    { name: 'Activity', abreviation: 'ACT' },
    { name: 'Temperature', abreviation: 'T' },
]

const createWearableScheduleDocument = async () => {
    const createdScheduleDocument = await exh.data.documents.create(
        'wearable-schedule',
        {
            patientId: '67ea71688bd54e5ccb0d4066',
            schedule: [
                {
                    what: ['HR', 'SBP', 'DBP', 'SpO2'], // change to value from form
                    tag: 'Wearable Schedule',
                    carepaths: ['COPD', 'Diabetes'], // change to value from form
                    mode: 'interval',
                    tInterval: 5, // change to value from form
                },
            ],
            wearableId: '679c853b53535d5d4c36cae6',
        }
    )
    console.log(createdScheduleDocument)
}

const findVitals = (vitals: any) => {
    const selectedVitalsAbreviations: string[] = []
    vitals.forEach((vital) => {
        if (vital.selected) {
            const foundVital = vitalName.find((v) => v.name === vital.name)
            if (foundVital) {
                if (Array.isArray(foundVital.abreviation)) {
                    selectedVitalsAbreviations.push(...foundVital.abreviation)
                } else {
                    selectedVitalsAbreviations.push(foundVital.abreviation)
                }
            }
        }
    })
    return selectedVitalsAbreviations
}

const updateWearableScheduleDocument = async () => {
    const onlySelectedVitals = findVitals()

    const updateScheduleDocument = await exh.data.documents.update(
        'wearable-schedule',
        '6836fec88bd54e9c2d0e3d6e',
        {
            schedule: [
                {
                    what: onlySelectedVitals, // change to value from form
                    carepaths: [activeCarepath], // change to value from form
                    mode: 'interval',
                    tInterval: timingConfig.frequency, // change to value from form
                },
            ],
            wearableId: '679c853b53535d5d4c36cae6',
        }
    )
    console.log(updateScheduleDocument)
}

// createWearableScheduleDocument()

async function deleteAlerts(alerts: Alert[]) {
    await Promise.all(
        alerts.map(async (alert) => {
            await exh.data.documents.remove('alert', alert.id)
        })
    )
}

async function updateAlerts(alerts: Alert[]) {
    await Promise.all(
        alerts.map(async (alert) => {
            await exh.data.documents.update('alert', alert.id, {
                vital: alert.data.vital,
                alertType: alert.data.alertType,
                threshold: alert.data.threshold,
            })
        })
    )
}

const updateWearableSchedule = async (vitals: any) => {
    const onlySelectedVitals = findVitals(vitals)
    console.log('Found vitals: ', onlySelectedVitals)
}

// Store initial state for cancel functionality
const initialVitals = [
    { name: 'Heart Rate', abbreviation: 'HR', selected: false },
    { name: 'Oxygen Saturation', abbreviation: 'SpO2', selected: true },
    { name: 'Blood Pressure', abbreviation: 'BP', selected: false },
    { name: 'Respiration Rate', abbreviation: 'RR', selected: true },
    { name: 'Activity', abbreviation: 'ACT', selected: true },
    { name: 'Temperature', abbreviation: 'T', selected: false },
]

const EditConfigurationPage = ({
    activeCarepath,
    alerts,
    onCancel,
    patient,
    wearableSchedule,
}: EditConfigurationProps) => {
    const { selectedWearableId } = usePatient()
    const [selectedWearableSchedule, setSelectedWearableSchedule] =
        useState<any>(null)

    // useEffect(() => {
    //     const updateWearableSchedule = async () => {
    //         const updatedSchedule = await exh.data.documents.update(
    //             'wearable-schedule',
    //             '6836fec88bd54e9c2d0e3d6e',
    //             {
    //                 schedule: [
    //                     {
    //                         what: ['HR', 'SpO2', 'T'], // change to value from form
    //                         carepaths: ['COPD'], // change to value from form
    //                         mode: 'interval',
    //                         tInterval: timingConfig.frequency, // change to value from form
    //                     },
    //                 ],
    //             }
    //         )
    //         console.log('Updated Wearable Schedule:', updatedSchedule)
    //     }
    //     updateWearableSchedule()
    // }, [])

    useEffect(() => {
        const relevantWearableSchedule = wearableSchedule.find((schedule) => {
            return schedule.data.wearableId === selectedWearableId
        })
        setSelectedWearableSchedule(relevantWearableSchedule)
        // console.log(
        //     'Relevant Wearable Schedule:',
        //     relevantWearableSchedule.data.schedule[0]
        // )
        if (relevantWearableSchedule) {
            const selectedVitals =
                relevantWearableSchedule.data.schedule[0].what
            setVitals(
                initialVitals.map((vital) => {
                    if (selectedVitals.includes(vital.abbreviation)) {
                        vital.selected = true
                    } else {
                        vital.selected = false
                    }
                    return vital
                })
            )
        }
    }, [wearableSchedule, selectedWearableId])

    // Available vitals with selection state
    const [vitals, setVitals] = useState<VitalOption[]>(initialVitals)
    const [tempAlerts, setTempAlerts] = useState<Alert[]>(alerts)

    useEffect(() => {
        const test = async () => {
            await updateWearableSchedule(vitals)
        }
        test()
    }, [vitals])

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
                vital: 'HR',
                alertType: 'Above',
                threshold: 0,
                //only using first wearable for now, wearable should be passed in as a prop
                wearableId: patient.data.coupledWearables[0].wearableId,
                patientId: patient.id,
                carepathId: activeCarepath,
            },
        }
        setTempAlerts([...tempAlerts, newAlert])
    }

    const deleteAlertConfig = (id: string) => {
        setTempAlerts(tempAlerts.filter((config) => config.id !== id))
    }

    const handleSave = async () => {
        const newAlerts = tempAlerts.filter((alert) => !alert.id)
        const updatedAlerts = tempAlerts.filter(
            (alert) =>
                alert !== alerts.find((a) => a.id === alert.id) &&
                newAlerts.find((a) => a.id === alert.id) === undefined
        )
        const removeAlerts = alerts.filter(
            (alert) => alert.id && !tempAlerts.find((a) => a.id === alert.id)
        )
        await deleteAlerts(removeAlerts)
        await updateAlerts(updatedAlerts)
        await createAlerts(newAlerts)
        onCancel()
    }

    const handleCancel = () => {
        // Reset to initial state and go back
        setVitals(initialVitals)
        setTimingConfig(timingConfig)
        // should refetch the alert data to make sure it reflects the latest state
        onCancel()
    }

    // Helper function to split array into columns
    const splitIntoTwoColumns = (items: Alert[]) => {
        const left: Alert[] = []
        const right: Alert[] = []
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
                    <EditVitalsSection
                        vitals={vitals}
                        toggleVital={toggleVital}
                    />

                    {/* Timing Section */}
                    <EditTimingSection
                        timingConfig={timingConfig}
                        updateTimingConfig={updateTimingConfig}
                    />

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
                                                key={config.id || columnIndex}
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
                                                    {vitalAbreviations.map(
                                                        (vital) => {
                                                            return (
                                                                <option
                                                                    key={vital}
                                                                    value={
                                                                        vital
                                                                    }
                                                                >
                                                                    {vital}
                                                                </option>
                                                            )
                                                        }
                                                    )}
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
