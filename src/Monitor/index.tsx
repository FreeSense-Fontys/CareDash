import { useState } from 'react'
import PatientList from './components/PatientList'
import SearchOptions from './components/SearchOptions'
// import AddMockVitals from './components/AddMockVitals'
import { Dayjs } from 'dayjs'
import { usePatient } from '../contexts/PatientProvider'
import PatientDetails from '../PatientDetails'

interface PatientListFormProps {
    setSelectedDate: React.Dispatch<React.SetStateAction<Dayjs>>
    selectedDate: Dayjs
}

const PatientListForm = ({
    setSelectedDate,
    selectedDate,
}: PatientListFormProps) => {
    const [open, setOpen] = useState(false)
    const { isWearableSelected } = usePatient()

    // Date picker opens below calendar
    const handlePrevDay = () =>
        setSelectedDate((prev: Dayjs) => prev.subtract(1, 'day'))
    const handleNextDay = () =>
        setSelectedDate((prev: Dayjs) => prev.add(1, 'day'))

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
                        {!isWearableSelected && (
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
                    <div
                        className={`${
                            isWearableSelected ? 'w-max-200' : 'w-full'
                        } min-w-90 h-[70vh] overflow-y-auto`}
                    >
                        <PatientList
                            selectedDate={selectedDate.format('YYYY-MM-DD')}
                            searchQuery={searchQuery}
                        />
                    </div>
                    {isWearableSelected && (
                        <div className="flex justify-center items-center w-full bg-secondary p-6 rounded-2xl overflow-y-auto h-full">
                            <PatientDetails
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
