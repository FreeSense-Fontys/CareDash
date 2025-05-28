import { useEffect, useState } from 'react'
import exh from '../../Auth'
import { rqlBuilder } from '@extrahorizon/javascript-sdk'
import { Checkbox } from '@mui/material'

import { AlertTrigger } from '../../types/AlertTrigger'
import { Vital } from '../../types/Vital'
import { PatientResponse } from '../../types/PatientResponse'
import { usePatient } from '../../contexts/PatientProvider'
import { WearableResponse } from '../../types/WearableResponse'

interface WearableDataProps {
    patients: PatientResponse[]
    indexPatient: number
    selectedDate: string
}

const allVitals = ['HR', 'SBP', 'DBP', 'SPO2', 'RR', 'ACT', 'T']

const WearableData = ({
    patients,
    indexPatient,
    selectedDate,
}: WearableDataProps) => {
    const [wearables, setWearableData] = useState<WearableResponse[]>([])
    const [hasChecked, setHasChecked] = useState(false)
    const [alertTriggers, setAlertTriggers] = useState<AlertTrigger[]>([])
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
                        .sort('-creationTimestamp')
                        .eq('creatorId', wearableId)
                        .build(),
                }
            )

            if (!wearableData) return

            setWearableData([wearableData as unknown as WearableResponse])
        }

        setHasChecked(patients[indexPatient]?.checked ?? false)
        getWearable()
    }, [selectedDate, indexPatient, patients, wearableId])

    useEffect(() => {
        const getAlerts = async () => {
            // gets alert triggers for each wearable for the selected date
            const alerts = await exh.data.documents.find('alert-trigger', {
                rql: rqlBuilder()
                    .eq('data.wearableId', wearableId)
                    .ge('creationTimestamp', `${selectedDate}T00:00:00Z`)
                    .le('creationTimestamp', `${selectedDate}T23:59:59Z`)
                    .build(),
            })
            if (alerts.data.length == 0) return
            setAlertTriggers(alerts.data as unknown as AlertTrigger[])
        }
        getAlerts()
    }, [patients, indexPatient, wearableId, selectedDate])

    interface CheckPatientEvent {
        target: {
            checked: boolean
        }
    }

    const handleCheckPatient = async (e: CheckPatientEvent): Promise<void> => {
        const check = e.target.checked

        setHasChecked(check)

        await new Promise<void>((resolve) => setTimeout(resolve, 500))

        // update the check of this specific patient
        const updatedPatients = patients.map((p, i) =>
            i === indexPatient ? { ...p, checked: check } : p
        )

        setPatients(updatedPatients)
    }

    return (
        <>
            {wearables?.map(
                (wearable: WearableResponse, wearableIndex: number) => (
                    <div
                        key={wearable.id ?? `wearable-${wearableIndex}`}
                        className="flex justify-around gap-7 text-lg pr-7"
                    >
                        {allVitals.map((vitalName: string) => {
                            const vital = wearable.data.vitals.find(
                                (v: Vital) => v.name === vitalName
                            )

                            const temp = alertTriggers.some(
                                (alert) =>
                                    alert.data.vital === vitalName &&
                                    alert.data.wearableId === wearableId
                            )

                            return (
                                <div
                                    key={vitalName}
                                    className="flex justify-center items-center"
                                >
                                    {vital ? (
                                        <div
                                            className={
                                                (temp &&
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
                )
            )}
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
