import { useEffect, useState } from 'react'
import exh from '../../Auth'
import { Patient } from '@extrahorizon/javascript-sdk'

interface wearableDataProps {
    patients: Patient[]
    indexPatient: number
    selectedDate: string
}

const allVitals = ['HR', 'SBP', 'DBP', 'SPO2', 'T']

const WearableData = ({ patients, indexPatient, selectedDate }: wearableDataProps) => {
    const [wearables, setWearableData] = useState<any>([])
    const test = async () => {
        const fontysPermissions = (await exh.users.me()).roles[0].permissions
        await exh.auth.authenticate({
            username: 'henry@freesense-solutions.com',
            password: 'Henry1234',
        })
        const henryPermissions = (await exh.users.me()).roles[0].permissions
        // const filteredArray = fontysPermissions.filter((value) =>
        //     henryPermissions.includes(value)
        // )
        // console.log('Fontys Permissions: ', fontysPermissions)
        // console.log('Henry Permissions: ', henryPermissions)
        fontysPermissions?.forEach((permission) => {
            if (
                permission.description ==
                'EXECUTE_API_FUNCTION:get-observations-by-day'
            ) {
                console.log('Permission found: ', permission)
            }
        })
        // console.log('Filtered Permissions: ', filteredArray)
    }
    // test()

    useEffect(() => {
        const getWearable = async (indexPatient) => {
            const wearableID =
                patients[indexPatient]?.data?.coupledWearables[0]?.wearableId
            // console.log("ID ", wearableID)
            // const date = '2025-04-10'
            console.log(selectedDate)
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
                        className="flex justify-around gap-5 text-lg"
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
                                            {
                                                Number((vital.series[vital.series.length - 1].value).toFixed(
                                                    vitalName === "T" ? 1 : 0
                                                ))
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
