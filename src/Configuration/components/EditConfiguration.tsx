import { useEffect, useState } from 'react'
import exh from '../../Auth'
import { PatientResponse } from '../../types/PatientResponse'
import { Alert } from '../../types/Alert'
import EditVitalsSection from './EditVitalsSection'
import EditTimingSection from './EditTimingSection'
import { usePatient } from '../../contexts/PatientProvider'
import EditAlertSection from './EditAlertSection'
import UpdateButtons from './UpdateButtons'

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
    alerts.map(async (alert) => {
        const tempAlert = await exh.data.documents.create('alert', alert.data)
        console.log('Created alert:', tempAlert)
    })
}
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

// createWearableScheduleDocument()

async function deleteAlerts(alerts: Alert[]) {
    alerts.map(async (alert) => {
        await exh.data.documents.remove('alert', alert.id)
    })
}

async function updateAlerts(alerts: Alert[]) {
    alerts.map(async (alert) => {
        await exh.data.documents.update('alert', alert.id, {
            vital: alert.data.vital,
            alertType: alert.data.alertType,
            threshold: alert.data.threshold,
        })
    })
}

async function updateWearableSchedule(vitals: any, wearableSchedule: any) {
    const onlySelectedVitals = findVitals(vitals)
    await exh.data.documents.update('wearable-schedule', wearableSchedule.id, {
        schedule: [
            {
                what: onlySelectedVitals,
                carepaths: wearableSchedule.data.schedule[0].carepaths, // use existing carepath
                mode: 'interval',
                tInterval: wearableSchedule.data.schedule[0].tInterval, // use existing interval
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
        const relevantWearableSchedule = wearableSchedule.find((schedule) => {
            return schedule.data.wearableId === selectedWearableId
        })
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
        }
    }, [wearableSchedule, selectedWearableId])

    // Available vitals with selection state
    const [vitals, setVitals] = useState<VitalOption[]>([])
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
        await updateWearableSchedule(vitals, selectedWearableSchedule)
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
        <>
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
