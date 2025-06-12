import { useEffect, useState } from 'react'
import ConfigurationItems from './ConfigurationItems'
import { usePatient } from '../../../contexts/PatientProvider'
import CarepathTabs from './CarepathTabs'
import PatientSelector from './PatientSelector'

const ConfigurationPatient = () => {
    const [activeCarepath, setActiveCarepath] = useState(String)
    const {
        patients,
        selectedPatient,
        setSelectedPatient,
        setSelectedWearableId,
    } = usePatient()

    // when page is first loaded, set the first patient as selected
    useEffect(() => {
        setSelectedPatient(patients?.[0] ?? null)
        setActiveCarepath(
            patients?.[0].data.coupledWearables[0].productName ?? ''
        )
        setSelectedWearableId(
            patients?.[0].data.coupledWearables[0].wearableId ?? ''
        )
    }, [setSelectedPatient, patients, setSelectedWearableId])

    const handlePatientChange = (patientId: string) => {
        setSelectedPatient(patients?.find((p) => p.id === patientId) ?? null)
        const patient = patients?.find((p) => p.id === patientId)
        if (patient) {
            setActiveCarepath(patient.data.coupledWearables[0].productName)
        }
        setSelectedWearableId(
            patient?.data.coupledWearables[0].wearableId ?? ''
        )
    }

    if (!patients) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading patients...</div>
            </div>
        )
    }

    return (
        <div className="flex flex-col ">
            <PatientSelector
                selectedPatient={selectedPatient}
                handlePatientChange={handlePatientChange}
                patients={patients}
            />

            {/* Carepath Tabs */}
            {selectedPatient && (
                <CarepathTabs
                    coupledWearables={selectedPatient.data.coupledWearables}
                    setActiveCarepath={setActiveCarepath}
                    setSelectedWearableId={setSelectedWearableId}
                    activeCarepath={activeCarepath}
                />
            )}

            {/* Configuration Items Component */}
            {selectedPatient && activeCarepath && (
                <ConfigurationItems
                    activeCarepath={activeCarepath}
                    currentPatient={selectedPatient}
                />
            )}

            {/* No Patient Selected State */}
            {!selectedPatient && (
                <div className="text-center py-12 text-gray-500">
                    <p>Please select a patient to view configuration</p>
                </div>
            )}
        </div>
    )
}

export default ConfigurationPatient
