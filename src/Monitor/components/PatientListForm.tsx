import '../../App.css'
import { useState, useRef } from 'react'
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import PatientList from './PatientList';


const PatientListForm = () => {

    // Date
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [open, setOpen] = useState(false);
    // Date picker opens bellow calendar
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const handlePrevDay = () => setSelectedDate((prev) => prev.subtract(1, "day"));
    const handleNextDay = () => setSelectedDate((prev) => prev.add(1, "day"));







    return (
        <div className="bg-gray-100 p-6 ">
            <div className="max-w-5xl mx-auto bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    {/* Search */}
                    <div className='justify-center items-center'>
                        <input type="text" placeholder="Search..." className="p-2 border rounded-lg w-80 " />
                    </div>

                    <div className="flex gap-4">
                        {/* Sort */}
                        <div className='justify-center items-center'>
                            <div>Sort by</div>
                            <select className="p-2 border rounded-lg w-25">
                                <option>Priority</option>
                            </select>
                        </div>
                        {/* Filter */}
                        <div>
                            <div>Filter by</div>
                            <select className="p-2 border rounded-lg w-25">
                                <option>Illness</option>
                            </select>
                        </div>
                    </div>
                    {/* Callendar */}

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="flex items-center ">
                            <button
                                onClick={handlePrevDay}
                                className="bg-accent text-white px-3 py-2 rounded-l-lg hover:bg-blue-600"
                            >
                                &lt;
                            </button>
                            <button
                                ref={buttonRef}
                                onClick={() => setOpen(true)}
                                className="text-black bg-background py-2 p-2"
                            >
                                {selectedDate.format("DD MMM, YYYY")}
                            </button>
                            <button
                                onClick={handleNextDay}
                                className="bg-accent text-white px-3 py-2 rounded-r-lg hover:bg-blue-600"
                            >
                                &gt;
                            </button>
                        </div>
                        <DesktopDatePicker
                            value={selectedDate}
                            onChange={(newValue) => {
                                if (newValue) {
                                    setSelectedDate(newValue);
                                }
                                setOpen(false);
                            }}
                            open={open}
                            onClose={() => setOpen(false)}
                            slotProps={{
                                textField: { sx: { display: "none" } }, // Hide input field
                                popper: {
                                    anchorEl: buttonRef.current, // Attach to button
                                    placement: "bottom-start", // Open below the button
                                    disablePortal: true, // Keep inside DOM
                                },
                            }}
                        />
                    </LocalizationProvider>
                </div>

                {/* Vitals Header */}
                <div className="flex justify-between gap-5 text-center font-semibold text-white p-2 rounded">
                    <div className="flex justify-left items-center gap-5 w-50 ml-5">
                        <span className="w-3 h-3 rounded-full"></span>
                        <span className="font-medium"></span>
                    </div>
                    <div className="flex justify-center items-center gap-2 w-20">
                        <span className="italic text-gray-600"></span>
                    </div >

                    {/* Actual Vitals */}
                    <div className="flex justify-around gap-5">
                        <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">HR<p className="text-[11px]">[/min]</p></div></div>
                        <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">BP<p className="text-[11px]">[mmHg]</p></div></div>
                        <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">SPO2<p className="text-[11px]">[%]</p></div></div>
                        <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">RR<p className="text-[11px]">[/min]</p></div></div>
                        <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">ACT<p className="text-[11px]">[min]</p></div></div>
                        <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">T<p className="text-[11px]">[°C]</p></div></div>
                    </div>
                    <div className="flex justify-around">
                        <div className="w-6 h-6 rounded border-gray-300 focus:ring-blue-500 mr-5 " />
                    </div>
                </div>

                {/* Patient List */}
                <PatientList />
            </div>
        </div>
    )
}

export default PatientListForm