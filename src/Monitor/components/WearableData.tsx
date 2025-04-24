import { useEffect, useState } from 'react'
import exh from '../../Auth'
import { Patient } from '@extrahorizon/javascript-sdk'
import { Checkbox } from '@mui/material'

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
    const [wearables, setWearableData] = useState<any>([])

    useEffect(() => {
        interface GetWearableResponse {
            id?: string
            vitals: Vital[]
        }

        const getWearable = async (indexPatient: number): Promise<void> => {
            const wearableID: string | undefined = (
                patients[indexPatient] as Patient & {
                    coupledWearables?: { wearableId: string }[]
                }
            )?.coupledWearables?.[0]?.wearableId
            if (!wearableID) return

            await exh.tasks.api
                .get<GetWearableResponse>(
                    'get-observations-by-day',
                    '?wearableId=' + wearableID + '&date=' + selectedDate,
                    {}
                )
                .then((result: GetWearableResponse) => {
                    setWearableData([result])
                })
        }
        getWearable(indexPatient)
    }, [selectedDate])

    return (
        <>
            {wearables?.map((wearable: Wearable, wearableIndex: number) => (
                <div
                    key={wearable.id ?? `wearable-${wearableIndex}`}
                    className="flex justify-around gap-7 text-lg"
                >
                    {allVitals.map((vitalName: string) => {
                        console.log(wearable.vitals)
                        const vital = wearable.vitals.find(
                            (v: Vital) => v.name === vitalName
                        )
                        return (
                            <div
                                key={vitalName}
                                className="flex justify-center items-center"
                            >
                                {vital ? (
                                    <div className="text-center border size-12 rounded-lg justify-center items-center flex leading-tight">
                                        {Number(
                                            vital.series[
                                                vital.series.length - 1
                                            ].value.toFixed(
                                                vitalName === 'T' ? 1 : 0
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center size-12 rounded-lg justify-center items-center flex leading-tight"></div>
                                )}
                            </div>
                        )
                    })}
                    <div className="flex items-center">
                        <Checkbox color="success" size="small" />
                    </div>
                </div>
            ))}
        </>
    )
}
export default WearableData
