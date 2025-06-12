import WearableData from './WearableData'
import { usePatient } from '../../contexts/PatientProvider'
import { useEffect, useState } from 'react'
import { rqlBuilder } from '@extrahorizon/javascript-sdk'
import exh from '../../Auth'
import { AlertTrigger } from '../../types/AlertTrigger'

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
    const {
        patients,
        setPatients,
        setIsWearableSelected,
        selectedWearableId,
        isWearableSelected,
        setSelectedWearableId,
        setSelectedPatient,
    } = usePatient()
    const [alertTriggers, setAlertTriggers] = useState<AlertTrigger[]>([])

    useEffect(() => {
        const fetchAlertTriggers = async () => {
            setAlertTriggers([])

            const alertTriggers = (await exh.data.documents.find(
                'alert-trigger',
                {
                    rql: rqlBuilder()
                        .ge('creationTimestamp', `${selectedDate}T00:00:00Z`)
                        .le('creationTimestamp', `${selectedDate}T23:59:59Z`)
                        .build(),
                }
            )) as unknown as { data: AlertTrigger[] }
            setAlertTriggers(alertTriggers.data as unknown as AlertTrigger[])
        }
        fetchAlertTriggers()
    }, [selectedDate])

    const normalizedQuery = (searchQuery ?? '').trim().toLowerCase()
    const normalizedFilterCarepath = (filterCarepath ?? '').trim().toLowerCase()
    const normalizedFilterOrder = (filterOrder ?? '').trim().toLowerCase()

    useEffect(() => {
        if (!patients) return

        // Sort the list
        const sortedPatients = [...patients]?.sort((a, b) => {
            // Sort on priority
            if (normalizedFilterOrder == 'priority') {
                if (a.checked !== b.checked) {
                    if (a.checked) {
                        return 1
                    } else {
                        return -1
                    }
                }
            }
            // Sort alphabetically
            else if (normalizedFilterOrder == 'alphabetical') {
                if (a.data.name < b.data.name) {
                    return -1
                }
                if (a.data.name > b.data.name) {
                    return 1
                }
            }

            // moves patients with alerts to the top
            const aHasAlerts = a.data.coupledWearables.some((wearable) =>
                alertTriggers.some(
                    (alert) => alert.data.wearableId === wearable.wearableId
                )
            )
            const bHasAlerts = b.data.coupledWearables.some((wearable) =>
                alertTriggers.some(
                    (alert) => alert.data.wearableId === wearable.wearableId
                )
            )

            if (aHasAlerts && !bHasAlerts) return -1
            if (!aHasAlerts && bHasAlerts) return 1
            return 0
        })

        // Checks if the patients ordering has changed. If it has changed, update the patients
        const isSameOrder = patients.every(
            (patient, patientNumber) =>
                patient === sortedPatients[patientNumber]
        )
        if (!isSameOrder) {
            setPatients(sortedPatients)
        }
    }, [
        patients,
        filterOrder,
        setPatients,
        normalizedFilterOrder,
        alertTriggers,
    ])

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

    const filteredPatients = patients.filter((patient) => {
        const name = patient.data.name.toLowerCase()
        const isInName = name.includes(normalizedQuery)
        const carepaths = patient.carepaths
        const isInCarepath =
            normalizedFilterCarepath === '' ||
            carepaths?.some((carepath) => {
                return carepath.toLowerCase().includes(normalizedFilterCarepath)
            }) ||
            false

        return isInName && isInCarepath
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
                        {patient.data.coupledWearables.map(
                            (wearable, index) => {
                                const patientWearableId =
                                    patient.data.coupledWearables[index]
                                        .wearableId
                                const alerts = alertTriggers.filter(
                                    (alert) =>
                                        alert.data.wearableId ===
                                        patientWearableId
                                )
                                const isSameWearable =
                                    selectedWearableId === patientWearableId
                                return (
                                    <div
                                        className={`flex items-center h-20 ${
                                            index > 0 ? 'ml-52' : ''
                                        }  p-3 ${
                                            isSameWearable
                                                ? 'bg-secondary text-white'
                                                : 'bg-background'
                                        } rounded-xsm relative mb-2 cursor-pointer`}
                                        key={`${patient.id}-${index}`}
                                        onClick={() => {
                                            if (isSameWearable) {
                                                setIsWearableSelected(false)
                                                setSelectedWearableId(null)
                                            } else {
                                                setIsWearableSelected(true)
                                                setSelectedWearableId(
                                                    patientWearableId
                                                )
                                                setSelectedPatient(patient)
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
                                            className={`italic w-22 justify-center items-center ${
                                                isSameWearable
                                                    ? 'text-white'
                                                    : 'text-gray-600'
                                            }`}
                                        >
                                            {wearable.productName}
                                        </div>
                                        {/* Right-aligned WearableData */}
                                        {!isWearableSelected && (
                                            <div className="w-full flex justify-end pr-4">
                                                <WearableData
                                                    patients={filteredPatients}
                                                    indexPatient={indexPatient}
                                                    selectedDate={selectedDate}
                                                    alerts={alerts}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )
                            }
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
export default PatientList
