import '../../App.css'
import { useState, useRef } from 'react'
import dayjs from 'dayjs'
import PatientList from './PatientList'
import SearchOptions from './SearchOptions'
import AddMockVitals from './AddMockVitals'

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
        <div className="bg-gray-100 p-6 h-full">
            <div className=" mx-auto bg-white p-4 rounded-lg shadow">
                <SearchOptions 
                    selectedDate={selectedDate} 
                    setSelectedDate={setSelectedDate}
                    open={open}
                    setOpen={setOpen}
                    handlePrevDay={handlePrevDay}
                    handleNextDay={handleNextDay}/>

                {/* Vitals Header */}
                <div className="flex justify-end gap-5 text-center font-semibold text-white p-2 rounded pr-18 text-lg">
                    {/* Actual Vitals */}
                    <div className="flex justify-around gap-5">
                        <div className="flex justify-center items-center">
                            <div className="text-center border size-12 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">
                                HR<p className="text-[14px]">[/min]</p>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="text-center border size-12 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">
                                BP<p className="text-[14px]">[mmHg]</p>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="text-center border size-12 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">
                                SPO2<p className="text-[14px]">[%]</p>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="text-center border size-12 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">
                                RR<p className="text-[14px]">[/min]</p>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="text-center border size-12 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">
                                ACT<p className="text-[14px]">[min]</p>
                            </div>
                        </div>
                        <div className="flex justify-center items-center">
                            <div className="text-center border size-12 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">
                                T<p className="text-[14px]">[°C]</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Patient List */}
                <PatientList selectedDate={selectedDate.format("YYYY-MM-DD")}/>

                <button onClick={() => MockVitals()} className="bg-accent text-white px-3 py-2 rounded hover:bg-blue-600 center">
                    Add mock vitals
                </button>
            </div>
        </div>
    )
}

export default PatientListForm
