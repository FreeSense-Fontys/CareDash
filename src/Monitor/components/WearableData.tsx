import { useEffect, useState } from 'react'
import exh from '../../Auth'
import { Patient, rqlBuilder } from '@extrahorizon/javascript-sdk'
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

interface GetWearableResponse {
    id?: string
    vitals: Vital[]
}

const allVitals = ['HR', 'SBP', 'DBP', 'SPO2', 'RR', 'ACT', 'T']

const WearableData = ({
    patients,
    indexPatient,
    selectedDate,
}: WearableDataProps) => {
    const [wearables, setWearableData] = useState<any>([])

    useEffect(() => {
        const getWearable = async (indexPatient: number): Promise<void> => {
            const wearableID: string =
                patients[indexPatient]?.data.coupledWearables[0].id
            console.log(wearableID)
            if (!wearableID) return

            // await exh.tasks.api
            //     .get<GetWearableResponse>(
            //         'get-observations-by-day',
            //         '?wearableId=' + wearableID + '&date=' + selectedDate,
            //         {}
            //     )
            //     .then((result: GetWearableResponse) => {
            //         // setWearableData([result])
            //         console.log(result)
            //     })
            const patientId = patients[indexPatient].id
            const patient = await exh.data.documents.findFirst(
                'wearable-observation',
                {
                    rql: rqlBuilder().sort('updateTimestamp').build(),
                }
            )
            console.log(patient)
            // const wearableObservation = await exh.data.documents.findById(
            //     'wearable-observation',
            //     wearableID
            // )
            // console.log(wearableObservation)
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
                        const vital = wearable.vitals?.find(
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
                    <div className="flex items-center" data-testid="checkbox">
                        <Checkbox color="success" size="small" />
                    </div>
                </div>
            ))}
        </>
    )
}
export default WearableData
