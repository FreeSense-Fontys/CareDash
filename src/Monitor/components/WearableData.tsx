import { useEffect, useState } from 'react'
import exh from '../../Auth'
import { Patient } from '@extrahorizon/javascript-sdk'

interface wearableDataProps {
    patients: Patient[]
    indexPatient: number
}

const WearableData = ({ patients, indexPatient }: wearableDataProps) => {
    const [wearables, setWearableData] = useState<any>([])
    const test = async () => {
        console.log(await exh.users.me())
    }
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
                    // console.log(result)
                    setWearableData([result])
                })
        }
        getWearable(indexPatient)
    }, [])

    // if (!wearables) {
    //     return <></>
    // }

    return (
        <>
            {wearables &&
                wearables.map((wearable) =>
                    wearable.vitals.map((vital, index) => {
                        return (
                            <div key={`${vital.name}-${index}`}>
                                <div className="flex justify-around gap-5">
                                    {/* HR */}
                                    {vital.name == 'HR' ? (
                                        <div className="flex justify-center items-center">
                                            <div className="text-center border size-12 rounded-lg justify-center items-center flex leading-tight">
                                                {
                                                    vital.series[
                                                        vital.series.length - 1
                                                    ].value
                                                }
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center">
                                            <div className="text-center size-12 rounded-lg justify-center items-center flex"></div>
                                        </div>
                                    )}
                                    {/* BP */}
                                    {vital.name == 'BP' ? (
                                        <div className="flex justify-center items-center">
                                            <div className="text-center border size-12 rounded-lg justify-center items-center flex leading-tight">
                                                {
                                                    vital.series[
                                                        vital.series.length - 1
                                                    ].value
                                                }
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center">
                                            <div className="text-center size-12 rounded-lg justify-center items-center flex"></div>
                                        </div>
                                    )}
                                    {/* SBP */}
                                    {vital.name == 'SBP' ? (
                                        <div className="flex justify-center items-center">
                                            <div className="text-center border size-12 rounded-lg justify-center items-center flex leading-tight">
                                                {
                                                    vital.series[
                                                        vital.series.length - 1
                                                    ].value
                                                }
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center">
                                            <div className="text-center size-12 rounded-lg justify-center items-center flex"></div>
                                        </div>
                                    )}
                                    {/* DBP */}
                                    {vital.name == 'DBP' ? (
                                        <div className="flex justify-center items-center">
                                            <div className="text-center border size-12 rounded-lg justify-center items-center flex leading-tight">
                                                {
                                                    vital.series[
                                                        vital.series.length - 1
                                                    ].value
                                                }
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center">
                                            <div className="text-center size-12 rounded-lg justify-center items-center flex"></div>
                                        </div>
                                    )}
                                    {/* ACT */}
                                    {vital.name == 'ACT' ? (
                                        <div className="flex justify-center items-center">
                                            <div className="text-center border size-12 rounded-lg justify-center items-center flex leading-tight">
                                                {
                                                    vital.series[
                                                        vital.series.length - 1
                                                    ].value
                                                }
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center">
                                            <div className="text-center size-12 rounded-lg justify-center items-center flex"></div>
                                        </div>
                                    )}
                                    {/* T */}
                                    {vital.name == 'T' ? (
                                        <div className="flex justify-center items-center">
                                            <div className="text-center border size-12 rounded-lg justify-center items-center flex leading-tight">
                                                {
                                                    vital.series[
                                                        vital.series.length - 1
                                                    ].value
                                                }
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center items-center">
                                            <div className="text-center size-12 rounded-lg justify-center items-center flex"></div>
                                        </div>
                                    )}
                                </div>
                                {/* Checkbox */}
                                {/* <div className="flex justify-around">
                                    <input
                                        type="checkbox"
                                        className="w-6 h-6 rounded border-gray-300 focus:ring-blue-500 mr-5 "
                                    />
                                </div> */}
                            </div>
                        )
                    })
                )}
        </>
    )
}
export default WearableData
