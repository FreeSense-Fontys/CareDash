import { useEffect, useState } from 'react'
import ConfigurationItems from './ConfigurationItems'
import { usePatient } from '../../contexts/PatientProvider'

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
            <div className=" gap-4 relative inline-block w-64 bg-accent rounded-lg text-white mb-8">
                <select
                    value={selectedPatient?.id}
                    onChange={(e) => handlePatientChange(e.target.value)}
                    className="block appearance-none w-full py-3 px-4 pr-10 text-black rounded leading-tight focus:outline-none"
                >
                    {patients?.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                            {patient.data.name}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                    >
                        <path d="M5.516 7.548l4.484 4.484 4.484-4.484L16 9l-6 6-6-6z" />
                    </svg>
                </div>
            </div>

            {/* Carepath Tabs */}
            {selectedPatient && (
                <div className="border-b mb-6">
                    <div className="flex">
                        {selectedPatient.data.coupledWearables.map((cp) => (
                            <button
                                key={cp.productName}
                                onClick={() => {
                                    setActiveCarepath(cp.productName)
                                    setSelectedWearableId(cp.wearableId)
                                }}
                                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors duration-150 border-b-2 ${
                                    activeCarepath === cp.productName
                                        ? 'bg-blue-100 border-blue-500 text-blue-700'
                                        : 'bg-gray-100 border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
                                }`}
                            >
                                {cp.productName}
                            </button>
                        ))}
                    </div>
                </div>
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
