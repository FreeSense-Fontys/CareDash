import { useState } from 'react'
import dayjs from 'dayjs'
import PatientList from './components/PatientList'
import SearchOptions from './components/SearchOptions'
import PatientDetails from '../PatientDetails'
import { Patient } from '@extrahorizon/javascript-sdk'
// import AddMockVitals from './components/AddMockVitals'

const PatientListForm = () => {
    // Date
    const [selectedDate, setSelectedDate] = useState(dayjs('2025-04-01'))
    const [open, setOpen] = useState(false)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    // const [isWearableSelected, setIsWearableSelected] = useState(true)
    // const [selectedWearableId, setSelectedWearableId] = useState<string | null>(
    //     '679c853b53535d5d4c36cae6'
    // )
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
    const [isWearableSelected, setIsWearableSelected] = useState(false)
    const [selectedWearableId, setSelectedWearableId] = useState<string | null>(
        null
    )
    // Date picker opens bellow calendar
    const handlePrevDay = () =>
        setSelectedDate((prev) => prev.subtract(1, 'day'))
    const handleNextDay = () => setSelectedDate((prev) => prev.add(1, 'day'))

    const [searchQuery, setSearchQuery] = useState('')

    // function MockVitals() {
    //     // Add mock vitals to all patients if needed
    //     AddMockVitals.AddMockVitals()
    // }

    return (
        <div className="bg-white h-screen flex flex-col ">
            <div className=" mx-auto bg-white p-4 rounded-lg flex flex-col w-full">
                <SearchOptions
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    open={open}
                    setOpen={setOpen}
                    handlePrevDay={handlePrevDay}
                    handleNextDay={handleNextDay}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                {/* Vitals Header */}
                <div className="flex justify-end gap-5 text-center font-semibold text-white p-3 pr-[14px] h-18 rounded text-lg">
                    <div className="flex">
                        {!isDetailsOpen && (
                            <div className="flex gap-x-5">
                                <div className="flex justify-center items-center">
                                    <div className="text-center border size-14 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">
                                        HR<p className="text-[12px]">[/min]</p>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center">
                                    <div className="text-center border size-14 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">
                                        SBP<p className="text-[12px]">[mmHg]</p>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center">
                                    <div className="text-center border size-14 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">
                                        DPB<p className="text-[12px]">[mmHg]</p>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center">
                                    <div className="text-center border size-14 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">
                                        SPO2<p className="text-[12px]">[%]</p>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center">
                                    <div className="text-center border size-14 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">
                                        RR<p className="text-[12px]">[/min]</p>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center">
                                    <div className="text-center border size-14 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">
                                        ACT<p className="text-[12px]"></p>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center">
                                    <div className="text-center border size-14 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">
                                        T<p className="text-[12px]">[°C]</p>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center">
                                    <div className="text-center border size-14 rounded-lg justify-center items-center flex flex-col leading-tight"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-x-4">
                    {/* Patient List */}
                    <div className="w-full min-w-90 h-[70vh] overflow-y-auto">
                        <PatientList
                            selectedDate={selectedDate.format('YYYY-MM-DD')}
                            searchQuery={searchQuery}
                            setIsDetailsOpen={setIsDetailsOpen}
                            isDetailsOpen={isDetailsOpen}
                            setIsWearableSelected={setIsWearableSelected}
                            setSelectedWearableId={setSelectedWearableId}
                            setSelectedPatient={setSelectedPatient}
                            selectedWearableId={selectedWearableId}
                        />
                    </div>
                    {isWearableSelected && (
                        <div className="flex bg-secondary p-6 rounded-2xl w-full overflow-y-auto h-[70vh]">
                            <PatientDetails
                                wearableId={selectedWearableId}
                                patient={selectedPatient}
                                currentDate={selectedDate.format('YYYY-MM-DD')}
                            />
                        </div>
                    )}
                </div>
                {/* 
                <button
                    onClick={() => MockVitals()}
                    className="bg-accent text-white px-3 py-2 rounded hover:opacity-80 cursor-pointer center"
                    data-testid="mock_vitals"
                >
                    Add mock vitals
                </button> */}
            </div>
        </div>
    )
}

export default PatientListForm
