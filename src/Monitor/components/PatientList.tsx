import WearableData from './WearableData'
import { usePatient } from '../../contexts/PatientProvider'

interface PatientListProps {
    selectedDate: string
    searchQuery: string
}

const PatientList = ({ selectedDate, searchQuery }: PatientListProps) => {
    const {
        patients,
        selectedWearableId,
        isWearableSelected,
        setSelectedPatient,
        setIsWearableSelected,
        setSelectedWearableId,
    } = usePatient()

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
                        {patient.carepaths.map((carepath, index) => {
                            const patientWearableId =
                                patient.data.coupledWearables[index].wearableId
                            const isSameWearable =
                                selectedWearableId === patientWearableId
                            return (
                                <div
                                    className={`flex items-center h-20 ${
                                        index > 0 ? 'ml-52' : ''
                                    }  p-3 ${
                                        isSameWearable
                                            ? 'bg-accent text-white'
                                            : 'bg-background'
                                    } rounded-xsm relative mb-2 cursor-pointer`}
                                    key={`${patient.id}-${index}`}
                                    onClick={() => {
                                        if (isSameWearable) {
                                            setIsWearableSelected(false)
                                            setSelectedWearableId(null)
                                            // setIsDetailsOpen(false)
                                        } else {
                                            setIsWearableSelected(true)
                                            setSelectedWearableId(
                                                patientWearableId
                                            )
                                            // setIsDetailsOpen(true)
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
                                            isSameWearable
                                                ? 'text-white'
                                                : 'text-gray-600'
                                        }`}
                                    >
                                        {carepath.name}
                                    </div>

                                    {/* Right-aligned WearableData */}
                                    {!isWearableSelected && (
                                        <div className="w-full flex justify-end pr-4">
                                            <WearableData
                                                patients={filteredPatients}
                                                indexPatient={indexPatient}
                                                selectedDate={selectedDate}
                                            />
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}
export default PatientList
