import { PatientResponse } from '../types/PatientResponse'
import exh from '../Auth'
import { createContext, useState, useEffect, useContext } from 'react'

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
        // const updatedPatients = patients.map((patient) => ({
        //     ...patient,
        //     carepaths: [{ name: 'COPD' }],
        // }))
        // updatedPatients[0].carepaths.push({ name: 'Diabetes' })
        // const firstWearable = updatedPatients[0].data.coupledWearables[0]
        // updatedPatients[0].data.coupledWearables.push({
        //     ...firstWearable,
        // })
        // setPatients(updatedPatients)
        setPatients(patients)
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
