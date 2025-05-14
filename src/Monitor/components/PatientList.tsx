import { Patient } from '@extrahorizon/javascript-sdk'
import { useState, useEffect } from 'react'
import exh from '../../Auth'
import WearableData from './WearableData'

interface PatientListProps {
    selectedDate: string
    searchQuery: string
    setIsDetailsOpen: (isOpen: boolean) => void
    isDetailsOpen: boolean
    setIsWearableSelected: (isSelected: boolean) => void
    setSelectedWearableId: (wearableId: string | null) => void
    setSelectedPatient: (patient: Patient | null) => void
    selectedWearableId: string | null
}

const PatientList = ({
    selectedDate,
    searchQuery,
    setIsDetailsOpen,
    isDetailsOpen,
    setIsWearableSelected,
    setSelectedWearableId,
    setSelectedPatient,
    selectedWearableId,
}: PatientListProps) => {
    const [patients, setPatients] = useState<Patient[] | null>(null)

    async function getPatientData() {
        const patients = await exh.data.documents.findAll<Patient>('patient')
        if (!patients) {
            return
        }
        const updatedPatients = patients.map((patient) => ({
            ...patient,
            carepaths: [{ name: 'COPD' }],
        }))
        updatedPatients[0].carepaths.push({ name: 'Diabetes' })
        const firstWearable = updatedPatients[0].data.coupledWearables[0]
        updatedPatients[0].data.coupledWearables.push({
            ...firstWearable,
            // wearableId: '67f391ad53535d5d4c36cb2b',
        })
        setPatients(updatedPatients)
    }

    useEffect(() => {
        getPatientData()
        const refreshtime = 60000 // 1 minutes
        const interval = setInterval(() => getPatientData(), refreshtime)
        return () => clearInterval(interval)
    }, [])

    const highlightMatch = (text: string, query: string) => {
        if (!query) return text
        const lowerText = text.toLowerCase()
        const lowerQuery = query.toLowerCase()
        const matchIndex = lowerText.indexOf(lowerQuery)

        if (matchIndex === -1) return text

        const before = text.slice(0, matchIndex)
        const match = text.slice(matchIndex, matchIndex + query.length)
        const after = text.slice(matchIndex + query.length)

        return (
            <>
                {before}
                <span className="bg-blue-200 font-bold">{match}</span>
                {after}
            </>
        )
    }

    if (!patients) return <></>

    const normalizedQuery = (searchQuery ?? '').trim().toLowerCase()

    const filteredPatients = patients.filter((patient) => {
        const name = patient.data.name.toLowerCase()
        return name.includes(normalizedQuery)
    })

    if (filteredPatients.length === 0) {
        return (
            <div
                className="h-[70vh] overflow-y-auto text-center text-gray-500 p-4"
                data-testid="patient-list"
            >
                No patients found matching your search.
            </div>
        )
    }

    return (
        <div data-testid="patient-list">
            {filteredPatients?.map((patient, indexPatient) => (
                <div key={patient.id} className="flex">
                    <div className="flex flex-col w-full">
                        {patient.carepaths.map((carepath, index) => (
                            <div
                                className={`flex items-center h-20 ${
                                    index > 0 ? 'ml-52' : ''
                                }  p-3 ${
                                    selectedWearableId ==
                                    patient.data.coupledWearables[index]
                                        .wearableId
                                        ? 'bg-accent text-white'
                                        : 'bg-background'
                                } rounded-xsm relative mb-2 cursor-pointer`}
                                key={`${patient.id}-${index}`}
                                onClick={() => {
                                    const isSameWearable =
                                        selectedWearableId ===
                                        patient.data.coupledWearables[index]
                                            .wearableId
                                    if (isSameWearable) {
                                        setIsWearableSelected(false)
                                        setSelectedWearableId(null)
                                        setIsDetailsOpen(false)
                                    } else {
                                        setIsWearableSelected(true)
                                        setSelectedWearableId(
                                            patient.data.coupledWearables[index]
                                                .wearableId
                                        )
                                        setIsDetailsOpen(true)
                                        setSelectedPatient(patient.data)
                                    }
                                }}
                            >
                                {/* Always left-aligned Patient name (only show once) */}
                                <div
                                    className={`flex items-center justify-between p-3 rounded-xsm relative text-lg`}
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
                                                {highlightMatch(
                                                    patient.data.name,
                                                    searchQuery
                                                )}
                                            </span>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>

                                {/* Centered carepath */}
                                <div
                                    className={`italic w-22 justify-center items-center${
                                        selectedWearableId ==
                                        patient.data.coupledWearables[index]
                                            .wearableId
                                            ? 'text-white'
                                            : 'text-gray-600'
                                    }`}
                                >
                                    {carepath.name}
                                </div>

                                {/* Right-aligned WearableData */}
                                {!isDetailsOpen && (
                                    <div className="w-full flex justify-end pr-4">
                                        <WearableData
                                            patients={filteredPatients}
                                            indexPatient={indexPatient}
                                            selectedDate={selectedDate}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
export default PatientList
