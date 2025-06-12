import { Patient } from '@extrahorizon/javascript-sdk'

const ArrowDown = () => {
    return (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
            >
                <path d="M5.516 7.548l4.484 4.484 4.484-4.484L16 9l-6 6-6-6z" />
            </svg>
        </div>
    )
}

interface PatientSelectorProps {
    selectedPatient: Patient | null
    handlePatientChange: (patientId: string) => void
    patients: Patient[] | undefined
}

const PatientSelector = ({
    selectedPatient,
    handlePatientChange,
    patients,
}: PatientSelectorProps) => {
    return (
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
            <ArrowDown />
        </div>
    )
}

export default PatientSelector
