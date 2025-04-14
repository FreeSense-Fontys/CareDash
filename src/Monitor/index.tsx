// import '../../App.css'
import { useState } from 'react'
import dayjs from 'dayjs'
import PatientList from './components/PatientList'
import SearchOptions from './components/SearchOptions'
import AddMockVitals from './components/AddMockVitals'

const PatientListForm = () => {
    // Date
    const [selectedDate, setSelectedDate] = useState(dayjs())
    const [open, setOpen] = useState(false)
    // Date picker opens bellow calendar
    const handlePrevDay = () =>
        setSelectedDate((prev) => prev.subtract(1, 'day'))
    const handleNextDay = () => setSelectedDate((prev) => prev.add(1, 'day'))

    function MockVitals() {
        // Add mock vitals to all patients if needed
        AddMockVitals.AddMockVitals()
    }

    return (
        <div className=" bg-gray-100 h-screen flex flex-col">
            <div className=" mx-auto bg-white p-4 rounded-lg shadow flex flex-col flex-grow w-full">
                <SearchOptions
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    open={open}
                    setOpen={setOpen}
                    handlePrevDay={handlePrevDay}
                    handleNextDay={handleNextDay}
                />

                {/* Vitals Header */}
                <div className="flex justify-end gap-5 text-center font-semibold text-white p-3 pr-[14px] rounded text-lg">
                    {/* Actual Vitals */}
                    <div className="flex justify-around gap-5">
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
                            <div className="text-center border size-14 rounded-lg justify-center items-center flex flex-col leading-tight">
                                {/* T<p className="text-[12px]">[°C]</p> */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patient List */}
                <div>
                    <PatientList
                        selectedDate={selectedDate.format('YYYY-MM-DD')}
                    />
                </div>

                <button
                    onClick={() => MockVitals()}
                    className="bg-accent text-white px-3 py-2 rounded hover:opacity-80 cursor-pointer center"
                >
                    Add mock vitals
                </button>
            </div>
        </div>
    )
}

export default PatientListForm
