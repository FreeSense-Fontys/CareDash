import { useEffect, useState } from 'react'
import { Alert } from '../../types/Alert'
import AlertSection from './AlertSection'
import EditTimingSection from './EditTimingSection'
import EditVitalsSection from './EditVitalsSection'
import exh from '../../Auth'
import { useAuth } from '../../contexts/AuthProvider'

interface CreateSchedulePageProps {
    carepath: string
    wearableId: string
    patientId: string
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

const createWearableScheduleDocument = async (
    wearableId: string,
    patientId: string,
    vitals: string[],
    carepaths: string[],
    groupId: string | undefined
) => {
    if (groupId === undefined) {
        return
    }
    const createdWearableSchedule = await exh.data.documents.create(
        'wearable-schedule',
        {
            patientId: patientId,
            schedule: [
                {
                    what: vitals, // change to value from form
                    tag: 'Wearable Schedule',
                    carepaths: carepaths, // change to value from form
                    mode: 'interval',
                    tInterval: 5, // change to value from form
                },
            ],
            wearableId: wearableId,
        }
    )
    console.log('Created wearable schedule: ', createdWearableSchedule)
    // await exh.data.documents.linkGroups(
    //     'wearable-schedule',
    //     createdWearableSchedule.id,
    //     {
    //         groupIds: [groupId],
    //     }
    // )
}

const deleteWearableSchedule = async () => {
    await exh.data.documents.remove(
        'wearable-schedule',
        '68418f958bd54ec8770e3dc9'
    )
}

function CreateSchedulePage({
    carepath,
    wearableId,
    patientId,
}: CreateSchedulePageProps) {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [vitals, setVitals] = useState(initialVitals)
    const { user } = useAuth()

    const toggleVital = (index: number) => {
        const newVitals = [...vitals]
        newVitals[index].selected = !newVitals[index].selected
        setVitals(newVitals)
    }

    useEffect(() => {
        deleteWearableSchedule()
    }, [])

    const handleCreate = async () => {
        await createWearableScheduleDocument(
            wearableId,
            patientId,
            findVitals(vitals),
            [carepath],
            user && user?.staffEnlistments && user?.staffEnlistments[0]?.groupId
        )
    }

    const addAlert = () => {
        const newAlert: Alert = {
            // id: Date.now().toString(),
            data: {
                vital: 'HR',
                alertType: 'Above',
                threshold: 0,
                //only using first wearable for now, wearable should be passed in as a prop
                wearableId: wearableId,
                patientId: patientId,
                carepathId: carepathId,
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
            <div className="h-[59vh] overflow-y-auto">
                <div className="space-y-8 mr-2">
                    {/* Vitals Section */}
                    <EditVitalsSection
                        vitals={vitals}
                        toggleVital={toggleVital}
                    />

                    {/* Timing Section */}
                    {/* <EditTimingSection
                        timingConfig={timingConfig}
                        updateTimingConfig={updateTimingConfig}
                    /> */}

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
                        // onClick={handleCancel}
                        className="bg-gray-500 text-white text-lg px-7 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleCreate}
                        className="bg-secondary text-white text-lg px-7 py-2 rounded mr-5 hover:bg-accent"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateSchedulePage
