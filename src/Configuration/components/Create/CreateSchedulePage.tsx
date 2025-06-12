import { useState } from 'react'
import { Alert } from '../../../types/Alert'
import AlertSection from '../Edit/EditAlertSection'
import EditVitalsSection from '../Edit/EditVitalsSection'
import exh from '../../../Auth'
import EditTimingSection from '../Edit/EditTimingSection'

interface CreateSchedulePageProps {
    carepath: string
    wearableId: string
    patientId: string
    setIsCarepathSelected: (isSelected: boolean) => void
    onCancel: () => void
}

export interface TimingConfig {
    mode: string
    tInterval: number
    unit: string
}

const vitalName = [
    { name: 'Heart Rate', abreviation: 'HR' },
    { name: 'Blood Pressure', abreviation: ['DBP', 'SBP'] },
    { name: 'Oxygen Saturation', abreviation: 'SpO2' },
    { name: 'Respiration Rate', abreviation: 'RR' },
    { name: 'Activity', abreviation: 'ACT' },
    { name: 'Temperature', abreviation: 'T' },
]

const initialVitals = [
    { name: 'Heart Rate', abbreviation: ['HR'], selected: false },
    { name: 'Oxygen Saturation', abbreviation: ['SpO2'], selected: false },
    {
        name: 'Blood Pressure',
        abbreviation: ['SBP', 'DBP'],
        selected: false,
    },
    { name: 'Respiration Rate', abbreviation: ['RR'], selected: false },
    { name: 'Activity', abbreviation: ['ACT'], selected: false },
    { name: 'Temperature', abbreviation: ['T'], selected: false },
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

async function createAlerts(alerts: Alert[]) {
    return Promise.all(
        alerts.map(async (alert) => {
            await exh.data.documents.create('alert', alert.data)
        })
    )
}

const createWearableScheduleDocument = async (
    wearableId: string,
    patientId: string,
    vitals: string[],
    carepaths: string[]
) => {
    await exh.data.documents.create('wearable-schedule', {
        patientId: patientId,
        schedule: [
            {
                what: vitals, // change to value from form
                tag: 'Wearable Schedule',
                carepaths: carepaths, // change to value from form
                mode: 'interval',
                tInterval: 3, // change to value from form
            },
        ],
        wearableId: wearableId,
    })
}

function CreateSchedulePage({
    carepath,
    wearableId,
    patientId,
    setIsCarepathSelected,
    onCancel,
}: CreateSchedulePageProps) {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [vitals, setVitals] = useState(initialVitals)
    // Timing configurations
    const [timingConfig, setTimingConfig] = useState<TimingConfig>({
        mode: 'Interval',
        tInterval: 3,
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

    const handleCreate = async () => {
        await createWearableScheduleDocument(
            wearableId,
            patientId,
            findVitals(vitals),
            [carepath]
        )
        await createAlerts(alerts)
        onCancel()
    }

    const addAlert = () => {
        const newAlert: Alert = {
            id: Date.now().toString(),
            data: {
                vital: 'HR',
                alertType: 'Above',
                threshold: 0,
                wearableId: wearableId,
                patientId: patientId,
                carepathId: carepath,
            },
        }
        setAlerts([...alerts, newAlert])
    }

    const deleteAlert = (id: string) => {
        setAlerts(alerts.filter((alert) => alert.id !== id))
    }

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
    const [alertLeft, alertRight] = splitIntoTwoColumns(alerts)

    return (
        <div>
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
                    <AlertSection
                        alertLeft={alertLeft}
                        alertRight={alertRight}
                        setTempAlerts={setAlerts}
                        tempAlerts={alerts}
                        deleteAlertConfig={deleteAlert}
                        addAlert={addAlert}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div>
                <div className="flex justify-between pt-3 border-t">
                    <button
                        onClick={() => setIsCarepathSelected(false)}
                        className="bg-gray-500 text-white text-lg px-7 py-2 rounded hover:bg-gray-600 cursor-pointer"
                    >
                        Back
                    </button>

                    <button
                        onClick={handleCreate}
                        className="bg-secondary text-white text-lg px-7 py-2 rounded mr-5 hover:bg-accent cursor-pointer"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateSchedulePage
