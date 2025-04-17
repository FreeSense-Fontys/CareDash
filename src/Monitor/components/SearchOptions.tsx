import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { useRef } from 'react'

interface wearableDataProps {
    selectedDate: any,
    setSelectedDate: (date: any) => void
    open: boolean,
    setOpen: (open: boolean) => void
    handlePrevDay: () => void
    handleNextDay: () => void
}

const SearchOptions = ({
        selectedDate, setSelectedDate, 
        open, setOpen, 
        handlePrevDay, 
        handleNextDay}:wearableDataProps) => {
    
    const buttonRef = useRef<HTMLButtonElement | null>(null)
    
    return (
        <div className="flex justify-between items-center mb-4 text-lg">
            {/* Search */}
            <div className="justify-center items-center">
                <input
                    type="text"
                    placeholder="Search..."
                    className="p-2 border rounded-lg w-80 "
                />
            </div>

            <div className="flex gap-4">
                {/* Sort */}
                <div className="justify-center items-center">
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
                        data-testid="prev_day"
                    >
                        &lt;
                    </button>
                    <button
                        ref={buttonRef}
                        onClick={() => setOpen(true)}
                        className="text-black bg-background py-2 p-2"
                    >
                        {selectedDate.format('DD MMM, YYYY')}
                    </button>
                    <button
                        onClick={handleNextDay}
                        data-testid="next_day"
                        className="bg-accent text-white px-3 py-2 rounded-r-lg hover:bg-blue-600"
                    >
                        &gt;
                    </button>
                </div>
                <DesktopDatePicker
                    value={selectedDate}
                    onChange={(newValue) => {
                        if (newValue) {
                            setSelectedDate(newValue)
                        }
                        setOpen(false)
                    }}
                    open={open}
                    onClose={() => setOpen(false)}
                    slotProps={{
                        textField: { sx: { display: 'none' } }, // Hide input field
                        popper: {
                            anchorEl: buttonRef.current, // Attach to button
                            placement: 'bottom-start', // Open below the button
                            disablePortal: true, // Keep inside DOM
                        },
                    }}
                />
            </LocalizationProvider>
        </div>
    )
}

export default SearchOptions;