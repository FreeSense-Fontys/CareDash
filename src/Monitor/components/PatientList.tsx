import { Patient } from '@extrahorizon/javascript-sdk'
import { useState, useEffect } from 'react'
import exh from '../../Auth'
import WearableData from './WearableData'

interface PatientListProps {
    selectedDate: string
}

const PatientList = ({ selectedDate }: PatientListProps) => {
    // Patient data
    const [patients, setPatients] = useState<Patient[] | null>(null)

    async function getPatientData() {
        const patients = await exh.data.documents.findAll<Patient>('patient')
        if (!patients) {
            return
        }
        // TODO Remove the slice(0,4)
        const updatedPatients = patients.map((patient) => ({
            ...patient,
            carepaths: [{ name: 'COPD' }],
        }))
        updatedPatients[0].carepaths.push({ name: 'Diabetes' })
        setPatients(updatedPatients)
    }

    useEffect(() => {
        getPatientData()
    }, [])

    if (!patients) {
        return <></>
    }

    return (
        <div
            className="h-[calc(50%)] overflow-y-auto"
            data-testid="patient-list"
        >
            {patients?.map((patient, indexPatient) => (
                <div key={patient.id}>
                    {patient.carepaths.map((carepath, index) => (
                        <div
                            className={`flex items-center  ${
                                index > 0 ? 'ml-52' : ''
                            }  p-3 bg-background rounded-xsm relative mb-2`}
                            key={`${patient.id}-${index}`}
                        >
                            {/* Always left-aligned Patient name (only show once) */}
                            <div
                                className={`flex items-center justify-between p-3 bg-background rounded-xsm relative text-lg`}
                            >
                                {index == 0 ? (
                                    <div className="flex justify-left items-center gap-5 w-50 ml-4 ">
                                        <span
                                            data-testid="patient-status"
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
                                ) : (
                                    ''
                                )}
                            </div>

                            {/* Centered carepath */}
                            <div className="w-22 flex justify-center items-center gap-2">
                                <span className="italic text-gray-600">
                                    {carepath.name}
                                </span>
                            </div>

                            {/* Right-aligned WearableData */}
                            <div className="w-full flex justify-end pr-4">
                                <WearableData
                                    patients={patients}
                                    indexPatient={indexPatient}
                                    selectedDate={selectedDate}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}
export default PatientList
