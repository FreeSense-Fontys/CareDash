import { Patient } from '@extrahorizon/javascript-sdk'
import exh from '../Auth'
import { createContext, useState, useEffect, useContext } from 'react'

interface PatientContextType {
    patients: Patient[] | null
    selectedPatient: Patient | null
    setSelectedPatient: (patient: Patient | null) => void
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
    const [patients, setPatients] = useState<Patient[] | null>(null)
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
    const [isWearableSelected, setIsWearableSelected] = useState(false)
    const [selectedWearableId, setSelectedWearableId] = useState<string | null>(
        null
    )

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

    return (
        <PatientContext.Provider
            value={{
                patients,
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
