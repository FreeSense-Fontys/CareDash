import { useEffect, useState } from 'react'
import exh from '../../Auth'
import { Patient } from '@extrahorizon/javascript-sdk'
import { Checkbox } from '@mui/material'

interface wearableDataProps {
    patients: Patient[]
    indexPatient: number
    selectedDate: string
}

const allVitals = ['HR', 'SBP', 'DBP', 'SPO2', 'RR', 'ACT', 'T']

const WearableData = ({
    patients,
    indexPatient,
    selectedDate,
}: wearableDataProps) => {
    const [wearables, setWearableData] = useState<any>([])

    useEffect(() => {
        const getWearable = async (indexPatient) => {
            const wearableID =
                patients[indexPatient]?.data?.coupledWearables[0]?.wearableId
            // console.log("ID ", wearableID)
            // const date = '2025-04-10'
            await exh.tasks.api
                .get(
                    'get-observations-by-day',
                    '?wearableId=' + wearableID + '&date=' + selectedDate,
                    {}
                )
                .then((result) => {
                    setWearableData([result])
                })
        }
        getWearable(indexPatient)
    }, [selectedDate])

    return (
        <>
            {wearables &&
                wearables.map((wearable, wearableIndex) => (
                    <div
                        key={`wearable-${wearableIndex}`}
                        className="flex justify-around gap-7 text-lg"
                    >
                        {allVitals.map((vitalName) => {
                            console.log(wearable.vitals)
                            const vital = wearable.vitals.find(
                                (v: any) => v.name === vitalName
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
