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

const allVitals = ['HR', 'SBP', 'DBP', 'SPO2', 'RR', 'ACT', 'T']

const WearableData = ({
    patients,
    indexPatient,
    selectedDate,
}: WearableDataProps) => {
    const [wearables, setWearableData] = useState<any[]>([])
    const [hasChecked, setHasChecked] = useState(false)
    const { setPatients } = usePatient()

    useEffect(() => {
        setWearableData([])
        const getWearable = async (indexPatient: number): Promise<void> => {
            // what if patient has multiple wearables? only taking the first one right now
            const wearableID: string =
                patients[indexPatient]?.data.coupledWearables[0].wearableId
            if (!wearableID) return

            const wearableData = await exh.data.documents.findFirst(
                'wearable-observation',
                {
                    rql: rqlBuilder()
                        .ge('updateTimestamp', `${selectedDate}T00:00:00Z`)
                        .le('updateTimestamp', `${selectedDate}T23:59:59Z`)
                        .sort('updateTimestamp')
                        .eq('creatorId', wearableID)
                        .build(),
                }
            )

            if (!wearableData) return

            setWearableData([wearableData])
        }

        setHasChecked(patients[indexPatient]?.checked)
        getWearable(indexPatient)
    }, [selectedDate, indexPatient, patients])

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

    // console.log('WearableData: ', wearables)

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
                        return (
                            <div
                                key={vitalName}
                                className="flex justify-center items-center"
                            >
                                {vital ? (
                                    <div className="text-center border size-12 rounded-lg justify-center items-center flex leading-tight">
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
