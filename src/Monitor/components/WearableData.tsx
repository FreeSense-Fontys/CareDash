import { useEffect, useState } from 'react'
import exh from '../../Auth'
import { Patient } from '@extrahorizon/javascript-sdk'

interface wearableDataProps {
    patients: Patient[]
    indexPatient: number
}

const allVitals = ['HR', 'BP', 'SBP', 'DBP', 'ACT', 'T']

const WearableData = ({ patients, indexPatient }: wearableDataProps) => {
    const [wearables, setWearableData] = useState<any>([])
    // const test = async () => {
    //     console.log('FONTYS: ', (await exh.users.me()).roles[0].permissions)
    //     await exh.auth.authenticate({
    //         username: 'henry@freesense-solutions.com',
    //         password: 'Henry1234',
    //     })
    //     console.log('HENRY: ', (await exh.users.me()).roles[0].permissions)
    // }
    // test()

    useEffect(() => {
        const getWearable = async (indexPatient) => {
            const wearableID =
                patients[indexPatient]?.data?.coupledWearables[0]?.wearableId
            // console.log("ID ", wearableID)
            const date = '2025-04-02'
            await exh.tasks.api
                .get(
                    'get-observations-by-day',
                    '?wearableId=' + wearableID + '&date=' + date,
                    {}
                )
                .then((result) => {
                    setWearableData([result])
                })
        }
        getWearable(indexPatient)
    }, [])

    return (
        <>
            {wearables &&
                wearables.map((wearable, wearableIndex) => (
                    <div
                        key={`wearable-${wearableIndex}`}
                        className="flex justify-around gap-5"
                    >
                        {allVitals.map((vitalName) => {
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
                                            {
                                                vital.series[0].value // vital.series.length - 1
                                            }
                                        </div>
                                    ) : (
                                        <div className="text-center size-12 rounded-lg justify-center items-center flex leading-tight"></div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ))}
        </>
    )
}
export default WearableData
