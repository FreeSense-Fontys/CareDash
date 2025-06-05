import { useState } from 'react'
import CreateSchedulePage from './CreateSchedulePage'
import { usePatient } from '../../contexts/PatientProvider'

interface CreateScheduleProps {
    carepaths: any[]
}

function CreateSchedule({ carepaths }: CreateScheduleProps) {
    const [selectedCarepath, setSelectedCarepath] = useState<string>('')
    const [isCarepathSelected, setIsCarepathSelected] = useState<boolean>(false)
    const { selectedWearableId, selectedPatient } = usePatient()

    const handleCarepathChange = (e) => {
        setSelectedCarepath(e.target.value)
    }

    return (
        <div className="flex flex-col justify-between h-[59vh]">
            {!isCarepathSelected && (
                <>
                    <div className="grid grid-cols-2 max-w-100 items-center">
                        <p className="items-center w-50">Carepath</p>
                        <select
                            className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => handleCarepathChange(e)}
                            value={selectedCarepath}
                        >
                            <option value="" disabled>
                                Select carepath
                            </option>
                            {carepaths.map((carepath) => {
                                return (
                                    <option
                                        key={carepath.id}
                                        value={carepath.data.carepathName}
                                    >
                                        {carepath.data.carepathName}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button
                            className="bg-secondary text-white text-lg px-7 py-2 rounded mr-5 hover:bg-accent disabled:opacity-80 disabled:cursor-not-allowed"
                            disabled={!selectedCarepath}
                            onClick={() => setIsCarepathSelected(true)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
            {isCarepathSelected && (
                <CreateSchedulePage
                    carepath={selectedCarepath}
                    wearableId={selectedWearableId ?? ''}
                    patientId={selectedPatient?.id || ''}
                />
            )}
        </div>
    )
}

export default CreateSchedule
