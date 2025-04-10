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
                            className={`flex items-center p-3 bg-background rounded-xsm relative mb-2 overflow-auto`}
                            key={`${patient.id}-${index}`}
                        >
                            {/* Always left-aligned Patient name (only show once) */}
                            <div className="w-[200px]">
                                {index === 0 && (
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`w-3 h-3 ${
                                                patient.status
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-500'
                                            } rounded-full`}
                                        ></span>
                                        <span className="font-medium truncate">
                                            {patient.data.name}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Centered carepath */}
                            <div className="w-1/5 flex justify-center">
                                <span className="italic text-gray-600">
                                    {carepath.name}
                                </span>
                            </div>

                            {/* Right-aligned WearableData */}
                            <div className="flex justify-end pr-15">
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
