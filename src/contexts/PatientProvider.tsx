import { PatientResponse } from '../types/PatientResponse'
import exh from '../Auth'
import { createContext, useState, useEffect, useContext } from 'react'
import { rqlBuilder } from '@extrahorizon/javascript-sdk'

interface PatientContextType {
    patients: PatientResponse[] | null
    setPatients: (patients: PatientResponse[] | null) => void
    selectedPatient: PatientResponse | null
    setSelectedPatient: (patient: PatientResponse | null) => void
    isWearableSelected: boolean
    setIsWearableSelected: (isSelected: boolean) => void
    selectedWearableId: string | null
    setSelectedWearableId: (wearableId: string | null) => void
}

const PatientContext = createContext<PatientContextType | undefined>(undefined)
export const PatientProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [patients, setPatients] = useState<PatientResponse[] | null>(null)
    const [selectedPatient, setSelectedPatient] =
        useState<PatientResponse | null>(null)
    const [isWearableSelected, setIsWearableSelected] = useState(false)
    const [selectedWearableId, setSelectedWearableId] = useState<string | null>(
        null
    )

    async function getPatientData() {
        const patients = await exh.data.documents.findAll<PatientResponse>(
            'patient'
        )
        if (!patients || patients.length === 0) {
            setPatients(null)
            return
        }

        // Fetch wearable schedules for each patient and update carepaths for filtering to work
        const updatedPatients = await Promise.all(
            patients.map(async (patient) => {
                const wearableSchedules = await exh.data.documents.find(
                    'wearable-schedule',
                    {
                        rql: rqlBuilder()
                            .eq('data.patientId', patient.id)
                            .build(),
                    }
                )
                if (!wearableSchedules || wearableSchedules.data.length === 0) {
                    return {
                        ...patient,
                        carepaths: [],
                    }
                }

                // extracting carepaths from all wearable schedules of a patient
                const carepaths = wearableSchedules.data.map((schedule) => {
                    return schedule.data.schedule[0].carepaths
                })

                // this flattens the array of arrays into a single array
                let uniqueCarepaths: string[] = []
                carepaths.forEach((scheduleCarepaths) => {
                    uniqueCarepaths = uniqueCarepaths.concat(scheduleCarepaths)
                })

                return {
                    ...patient,
                    carepaths: uniqueCarepaths,
                }
            })
        )
        setPatients(updatedPatients)
    }

    useEffect(() => {
        getPatientData()
    }, [])

    return (
        <PatientContext.Provider
            value={{
                patients,
                setPatients,
                selectedPatient,
                setSelectedPatient,
                isWearableSelected,
                setIsWearableSelected,
                selectedWearableId,
                setSelectedWearableId,
            }}
        >
            {children}
        </PatientContext.Provider>
    )
}

export const usePatient = () => {
    const context = useContext(PatientContext)
    if (!context) {
        throw new Error('usePatient must be used within a PatientProvider')
    }
    return context
}
