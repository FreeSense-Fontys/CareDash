import { Patient } from '@extrahorizon/javascript-sdk'
import { useState, useEffect } from 'react'
import exh from '../../Auth'
import WearableData from './WearableData'

interface PatientListProps {
    selectedDate: string
    searchQuery: string
    filterCarepath: string
    filterOrder: string
}

const PatientList = ({
    selectedDate,
    searchQuery,
    filterCarepath,
    filterOrder,
}: PatientListProps) => {
    // Patient data
    const [patients, setPatients] = useState<Patient[] | null>(null)

    async function getPatientData() {
        const patients = await exh.data.documents.findAll<Patient>('patient')
        if (!patients) {
            return
        }
        const updatedPatients = patients.map((patient) => ({
            ...patient,
            carepaths: [{ name: 'COPD' }],
            checked: false
        }))
        updatedPatients[0].carepaths.push({ name: 'Diabetes' })
        setPatients(updatedPatients)
    }

    useEffect(() => {
        if (!patients) return;

        // Sort the list
        const sortedPatients = [...patients]?.sort((a,b) => {
            // Sort on priority
            if (normalizedFilterOrder == "priority") {
                if (a.checked !== b.checked) {
                    if (a.checked) {return 1}
                    else {return -1}
                }
            }
            // Sort alphabetically
            else if (normalizedFilterOrder == "alphabetical") {
                if(a.data.name < b.data.name) { return -1; }
                if(a.data.name > b.data.name) { return 1; }
            }
            return 0;
        })

        // Checks if the patients ordering has changed. If it has changed, update the patients
        const isSameOrder = patients.every((patient, patientNumber) => patient === sortedPatients[patientNumber]);
        if (!isSameOrder) {
            setPatients(sortedPatients); 
        }
    }, [patients, filterOrder])

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
    const normalizedFilterCarepath = (filterCarepath ?? '').trim().toLowerCase()
    const normalizedFilterOrder = (filterOrder ?? '').trim().toLowerCase()

    const filteredPatients = patients.filter((patient) => {
        const name = patient.data.name.toLowerCase()
        const isInName = name.includes(normalizedQuery)
        const carepaths = patient.carepaths
        const isInCarepath = carepaths.some((carepath) =>
            carepath.name.toLowerCase().includes(normalizedFilterCarepath)
        )
        return isInName && isInCarepath
    })

    if (filteredPatients.length === 0) {
        return (
            <div
                className="h-[calc(50%)] overflow-y-auto text-center text-gray-500 p-4"
                data-testid="patient-list"
            >
                No patients found matching your search.
            </div>
        )
    }

    return (
        <div className="h-[70vh] overflow-y-auto" data-testid="patient-list">
            {filteredPatients?.map((patient, indexPatient) => (
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
                                        <span
                                            className="font-medium truncate"
                                            data-testid={`patient-name-${patient.id}`}
                                        >
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
                            <div className="w-22 flex justify-center items-center gap-2">
                                <span className="italic text-gray-600">
                                    {carepath.name}
                                </span>
                            </div>

                            {/* Right-aligned WearableData */}
                            <div className="w-full flex justify-end pr-4">
                                <WearableData
                                    patients={filteredPatients}
                                    indexPatient={indexPatient}
                                    selectedDate={selectedDate}
                                    setPatients={setPatients}
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
