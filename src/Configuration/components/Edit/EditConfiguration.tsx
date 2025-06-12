import { useEffect, useState } from 'react'
import exh from '../../../Auth'
import { PatientResponse } from '../../../types/PatientResponse'
import { Alert } from '../../../types/Alert'
import EditVitalsSection from './EditVitalsSection'
import EditTimingSection from './EditTimingSection'
import { usePatient } from '../../../contexts/PatientProvider'
import EditAlertSection from './EditAlertSection'
import UpdateButtons from './UpdateButtons'
import { TimingConfig } from './CreateSchedulePage'

interface VitalOption {
    name: string
    selected: boolean
    abbreviation: string[]
}

interface EditConfigurationProps {
    activeCarepath: string
    alerts: Alert[]
    onCancel: () => void
    patient: PatientResponse
    wearableSchedule: any
}

async function createAlerts(alerts: Alert[]) {
    return Promise.all(
        alerts.map(async (alert) => {
            await exh.data.documents.create('alert', alert.data)
        })
    )
}

const vitalName = [
    { name: 'Heart Rate', abreviation: 'HR' },
    { name: 'Blood Pressure', abreviation: ['DBP', 'SBP'] },
    { name: 'Oxygen Saturation', abreviation: 'SpO2' },
    { name: 'Respiration Rate', abreviation: 'RR' },
    { name: 'Activity', abreviation: 'ACT' },
    { name: 'Temperature', abreviation: 'T' },
]

const findVitals = (vitals: any) => {
    const selectedVitalsAbreviations: string[] = []
    vitals.forEach((vital: any) => {
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

async function deleteAlerts(alerts: Alert[]) {
    return Promise.all(
        alerts.map(async (alert) => {
            await exh.data.documents.remove('alert', alert.id)
        })
    )
}

async function updateAlerts(alerts: Alert[]) {
    return Promise.all(
        alerts.map(async (alert) => {
            await exh.data.documents.update('alert', alert.id, {
                vital: alert.data.vital,
                alertType: alert.data.alertType,
                threshold: alert.data.threshold,
            })
        })
    )
}

async function editAlerts(alerts: Alert[], originalAlerts: Alert[]) {
    const newAlerts = alerts.filter(
        (alert) => !originalAlerts.find((a) => a.id === alert.id)
    )
    const updatedAlerts = alerts.filter(
        (alert) =>
            alert !== originalAlerts.find((a) => a.id === alert.id) &&
            newAlerts.find((a) => a.id === alert.id) === undefined
    )
    const removeAlerts = originalAlerts.filter(
        (a) => alerts.find((alert) => alert.id === a.id) === undefined
    )
    await createAlerts(newAlerts)
    await updateAlerts(updatedAlerts)
    await deleteAlerts(removeAlerts)
}

async function updateWearableSchedule(
    vitals: any,
    timing: TimingConfig,
    wearableSchedule: any
) {
    const onlySelectedVitals = findVitals(vitals)
    await exh.data.documents.update('wearable-schedule', wearableSchedule.id, {
        schedule: [
            {
                what: onlySelectedVitals,
                carepaths: wearableSchedule.data.schedule[0].carepaths, // use existing carepath
                mode: timing.mode,
                tInterval: timing.tInterval, // use existing interval
            },
        ],
    })
}

// Store initial state for cancel functionality
const initialVitals = [
    { name: 'Heart Rate', abbreviation: ['HR'], selected: false },
    { name: 'Oxygen Saturation', abbreviation: ['SpO2'], selected: true },
    {
        name: 'Blood Pressure',
        abbreviation: ['SBP', 'DBP'],
        selected: false,
    },
    { name: 'Respiration Rate', abbreviation: ['RR'], selected: true },
    { name: 'Activity', abbreviation: ['ACT'], selected: true },
    { name: 'Temperature', abbreviation: ['T'], selected: false },
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

    useEffect(() => {
        if (!wearableSchedule || !selectedWearableId) return
        const relevantWearableSchedule = wearableSchedule.find(
            (schedule: any) => {
                return schedule.data.wearableId === selectedWearableId
            }
        )
        setSelectedWearableSchedule(relevantWearableSchedule)

        if (relevantWearableSchedule) {
            const selectedVitals =
                relevantWearableSchedule.data.schedule[0].what
            setVitals(
                initialVitals.map((vital) => {
                    if (vital.name === 'Blood Pressure') {
                        if (
                            selectedVitals.includes('SBP') &&
                            selectedVitals.includes('DBP')
                        ) {
                            vital.selected = true
                        }
                    } else if (selectedVitals.includes(vital.abbreviation[0])) {
                        vital.selected = true
                    } else {
                        vital.selected = false
                    }
                    return vital
                })
            )
            setTimingConfig({
                mode: relevantWearableSchedule.data.schedule[0].mode,
                tInterval: relevantWearableSchedule.data.schedule[0].tInterval,
                unit:
                    relevantWearableSchedule.data.schedule[0].unit || 'Minutes',
            })
        }
    }, [wearableSchedule, selectedWearableId])

    // Available vitals with selection state
    const [vitals, setVitals] = useState<VitalOption[]>([])
    const [tempAlerts, setTempAlerts] = useState<Alert[]>(alerts)

    // Timing configurations
    const [timingConfig, setTimingConfig] = useState<TimingConfig>({
        mode: 'interval',
        tInterval: 3,
        unit: 'Minutes',
    })

    const toggleVital = (index: number) => {
        const newVitals = [...vitals]
        newVitals[index].selected = !newVitals[index].selected
        setVitals(newVitals)
    }

    const updateTimingConfig = (field: string, value: string | number) => {
        setTimingConfig({ ...timingConfig, [field]: value })
    }

    const addAlert = () => {
        const newAlert: Alert = {
            id: Date.now().toString(),
            data: {
                vital: 'HR',
                alertType: 'Above',
                threshold: 0,
                wearableId: selectedWearableId || '',
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
        await editAlerts(tempAlerts, alerts)
        await updateWearableSchedule(
            vitals,
            timingConfig,
            selectedWearableSchedule
        )
        onCancel()
    }

    const handleCancel = () => {
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
        <>
            <div className="h-[57vh] overflow-y-auto">
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
                    <EditAlertSection
                        alertLeft={alertLeft}
                        alertRight={alertRight}
                        setTempAlerts={setTempAlerts}
                        tempAlerts={tempAlerts}
                        deleteAlertConfig={deleteAlertConfig}
                        addAlert={addAlert}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <UpdateButtons
                handleCancel={handleCancel}
                handleSave={handleSave}
            />
        </>
    )
}
export default EditConfigurationPage
