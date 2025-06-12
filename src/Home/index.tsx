import { useState } from 'react'
import { PatientProvider } from '../contexts/PatientProvider'
import PatientListForm from '../Monitor'
import dayjs from 'dayjs'

const Home = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs('2025-04-10'))

    return (
        <PatientProvider>
            <div className="w-full h-full bg-gray-400 overflow-hidden">
                <PatientListForm
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />
            </div>
        </PatientProvider>
    )
}

export default Home
