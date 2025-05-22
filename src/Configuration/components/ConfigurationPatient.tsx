import { useEffect, useState } from 'react'
import exh from '../../Auth'
import { Patient } from '@extrahorizon/javascript-sdk'
import ConfigurationItems from './ConfigurationItems'


const ConfigurationPatient = () => {

    const [patients, setPatients] = useState<Patient[] | null>(null)
    const [selectedPatient, setSelectedPatient] = useState(String);
    const [activeCarepath, setActiveCarepath] = useState(String);

    // getting all patiens
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
        setPatients(updatedPatients)

        // selecting active patient
        if (updatedPatients.length > 0) {
            setSelectedPatient(updatedPatients[0].id);
            if (updatedPatients[0].carepaths.length > 0) {
                setActiveCarepath(updatedPatients[0].carepaths[0].name);
            }
        }
    }

    useEffect(() => {
        getPatientData()
    }, [])

    // after patient is selected it changes to current patient
    const currentPatient = patients?.find(p => p.id === selectedPatient);

    const handlePatientChange = (patientId: string) => {
        setSelectedPatient(patientId);
        const patient = patients?.find(p => p.id === patientId);
        if (patient && patient.carepaths.length > 0) {
            setActiveCarepath(patient.carepaths[0].name);
        }
    };

    if (!patients) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading patients...</div>
            </div>
        );
    }

    return (

        <div className="flex flex-col ">
            <div className=" gap-4 relative inline-block w-64 bg-accent rounded-lg text-white mb-8">
                <select
                    value={selectedPatient}
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
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.516 7.548l4.484 4.484 4.484-4.484L16 9l-6 6-6-6z" /></svg>
                </div>
            </div>

            {/* Carepath Tabs */}
            {currentPatient && (
                <div className="border-b mb-6">
                    <div className="flex">
                        {currentPatient.carepaths.map((cp) => (
                            <button
                                key={cp.name}
                                onClick={() => setActiveCarepath(cp.name)}
                                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors duration-150 border-b-2 ${activeCarepath === cp.name
                                    ? "bg-blue-100 border-blue-500 text-blue-700"
                                    : "bg-gray-100 border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                                    }`}
                            >
                                {cp.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Configuration Items Component */}
            {selectedPatient && activeCarepath && (
                <ConfigurationItems
                    activeCarepath={activeCarepath}
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

export default ConfigurationPatient;