import { Patient } from '@extrahorizon/javascript-sdk'
import { useState, useEffect } from 'react'
import exh from '../../Auth'
import WearableData from './WearableData'

const PatientList = () => {
    // Patient data
    const [patients, setPatients] = useState<Patient[]>([])

    async function getPatientData() {
        await exh.data.documents.findAll<Patient>('patient').then((result) => {
            // console.log('Result ', result)

            const updatedPatients = result.map((patient) => ({
                ...patient,
                carepaths: [{ name: 'COPD' }, { name: 'Diabetes' }],
            }))
            setPatients(updatedPatients)
        })
    }

    // console.log(patients);

    useEffect(() => {
        getPatientData()
    }, [])

    if (!patients) {
        return <></>
    }

    return (
        <>
            {patients?.map((patient, indexPatient) => (
                <div key={patient.id}>
                    {patient.carepaths.map((carepath, index) => (
                        <div
                            key={`${patient.id}-${index}`}
                            className="space-y-4 mt-2"
                        >
                            <div
                                className={`flex items-center ${
                                    index > 0 ? 'ml-73' : ''
                                } justify-between p-3 bg-background rounded-xsm relative`}
                            >
                                {/* Patient name and online status */}
                                {index == 0 ? (
                                    <div className="flex justify-left items-center gap-5 w-50 ml-4">
                                        <span
                                            className={`w-3 h-3 ${
                                                patient.status
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-500'
                                            } rounded-full`}
                                        ></span>
                                        <span className="font-medium">
                                            {patient.data.name}
                                        </span>
                                    </div>
                                ) : (
                                    ''
                                )}

                                {/* Carepath */}
                                <div className="flex justify-center items-center gap-2 w-22">
                                    <span className="italic text-gray-600">
                                        {carepath.name}
                                    </span>
                                </div>

                                <WearableData
                                    patients={patients}
                                    indexPatient={indexPatient}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </>
    )
}
export default PatientList
