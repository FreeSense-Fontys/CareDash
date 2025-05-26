import { useEffect, useState } from 'react'
import exh from '../../Auth'
import { Patient, rqlBuilder } from '@extrahorizon/javascript-sdk'
import { Checkbox } from '@mui/material'
import { usePatient } from '../../contexts/PatientProvider'

// Define the Wearable and Vital types
interface Wearable {
    id?: string
    vitals: Vital[]
}

interface Vital {
    name: string
    series: { value: number }[]
}

interface WearableDataProps {
    patients: Patient[]
    indexPatient: number
    selectedDate: string
}

enum AlertType {
    ABOVE = 'Above',
    BELOW = 'Below',
}

const allVitals = ['HR', 'SBP', 'DBP', 'SPO2', 'RR', 'ACT', 'T']

const WearableData = ({
    patients,
    indexPatient,
    selectedDate,
}: WearableDataProps) => {
    const [wearables, setWearableData] = useState<any[]>([])
    const [hasChecked, setHasChecked] = useState(false)
    const [alertTriggers, setAlertTriggers] = useState<any[]>([])
    const { setPatients } = usePatient()

    // what if patient has multiple wearables? only using the first one right now
    const wearableId: string =
        patients[indexPatient]?.data.coupledWearables[0].wearableId

    useEffect(() => {
        setWearableData([])
        const getWearable = async (): Promise<void> => {
            if (!wearableId) return

            const wearableData = await exh.data.documents.findFirst(
                'wearable-observation',
                {
                    rql: rqlBuilder()
                        .ge('creationTimestamp', `${selectedDate}T00:00:00Z`)
                        .le('creationTimestamp', `${selectedDate}T23:59:59Z`)
                        .sort('creationTimestamp')
                        .eq('creatorId', wearableId)
                        .build(),
                }
            )

            if (!wearableData) return

            wearableData.data.vitals[0].value = 105

            setWearableData([wearableData])
        }

        setHasChecked(patients[indexPatient]?.checked)
        getWearable()
    }, [selectedDate, indexPatient, patients, wearableId])

    useEffect(() => {
        const getAlerts = async () => {
            const alerts = await exh.data.documents.find('alerts', {
                rql: rqlBuilder()
                    .eq('data.wearableId', wearableId)
                    // .ge('creationTimestamp', `${selectedDate}T00:00:00Z`)
                    // .le('creationTimestamp', `${selectedDate}T23:59:59Z`)
                    .build(),
            })
            if (!alerts) return
            console.log(alerts.data)
            setAlertTriggers(alerts.data)
        }
        getAlerts()
    }, [patients, indexPatient, wearableId, selectedDate])

    const handleCheckPatient = async (e) => {
        const check = e.target.checked

        setHasChecked(check)

        await new Promise((resolve) => setTimeout(resolve, 500))

        // Update the check of this specific patient
        const updatedPatients = patients.map((p, i) =>
            i === indexPatient ? { ...p, checked: check } : p
        )

        setPatients(updatedPatients)
    }

    return (
        <>
            {wearables?.map((wearable: Wearable, wearableIndex: number) => (
                <div
                    key={wearable.id ?? `wearable-${wearableIndex}`}
                    className="flex justify-around gap-7 text-lg pr-7"
                >
                    {allVitals.map((vitalName: string) => {
                        const vital = wearable.data?.vitals?.find(
                            (v: Vital) => v.name === vitalName
                        )
                        console.log(alertTriggers)
                        const alert = alertTriggers.find(
                            (a) => a.data.vitals === vitalName
                        )

                        const isDangerous =
                            (alert?.data?.alertType === AlertType.ABOVE &&
                                vital?.value > alert.data.threshold) ||
                            (alert?.data?.alertType === AlertType.BELOW &&
                                vital?.value < alert.data.threshold)

                        return (
                            <div
                                key={vitalName}
                                className="flex justify-center items-center"
                            >
                                {vital ? (
                                    <div
                                        className={
                                            (isDangerous &&
                                                'text-white bg-red-500') +
                                            ` text-center border size-12 rounded-lg justify-center items-center flex leading-tight`
                                        }
                                    >
                                        {vital.value.toFixed(
                                            vitalName === 'T' ? 1 : 0
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center size-12 rounded-lg justify-center items-center flex leading-tight"></div>
                                )}
                            </div>
                        )
                    })}
                </div>
            ))}
            <div className="flex items-center" data-testid="checkbox">
                <Checkbox
                    color="success"
                    size="small"
                    checked={!!hasChecked}
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                    onChange={handleCheckPatient}
                />
            </div>
        </>
    )
}
export default WearableData
