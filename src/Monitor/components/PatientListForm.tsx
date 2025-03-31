import '../../App.css'


const PatientListForm = () => {

    return (
        <body className="bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto bg-white p-4 rounded-lg shadow">
                {/* Search, sort and filter */}
                <div className="flex justify-between items-center mb-4">
                    <input type="text" placeholder="Search..." className="p-2 border rounded w-1/3" />
                        <div className="flex gap-4">
                            <select className="p-2 border rounded">
                                <option>Sort by Priority</option>
                            </select>
                            <select className="p-2 border rounded">
                                <option>Filter by Illness</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="bg-accent text-white px-3 py-1 rounded">&#60;</button>
                            <span className="font-semibold">25 Feb, 2025</span>
                            <button className="bg-accent text-white px-3 py-1 rounded">&#62;</button>
                        </div>
                </div>

                {/* Vitals Header */}
                <div className="grid grid-cols-8 gap-2 text-center font-semibold text-white bg-blue-500 p-2 rounded">
                    <div className="col-span-2"></div>
                    <div>HR [bpm]</div>
                    <div>BP [mmHg]</div>
                    <div>SPO2 [%]</div>
                    <div>RR [min]</div>
                    <div>ACT [min]</div>
                    <div>T [°C]</div>
                </div>

                {/* Patient List */}
                <div className="space-y-4 mt-2">
                    <div className="grid grid-cols-8 gap-2 items-center p-3 bg-blue-100 rounded-xsm relative">
                        <div className="col-span-2 flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            <span className="font-medium">Eric Berry</span>
                            <span className="italic text-gray-600">COPD</span>
                        </div>

                        <div className="flex justify-center items-center"><div className="text-center border size-11 rounded-lg justify-center items-center flex">120</div></div>
                        <div className="flex justify-center items-center"><div className="text-center size-11 bg-red-500 text-white p-2 rounded-lg justify-center items-center flex line-clamp-2">128/80</div></div>
                        <div className="flex justify-center items-center"><div className="text-center size-11 bg-red-500 text-white p-2 rounded-lg justify-center items-center flex">80</div></div>
                        <div className="flex justify-center items-center"><div className="text-center border size-11 rounded-lg justify-center items-center flex">20</div></div>
                        <div className="flex justify-center items-center"><div className="text-center  size-11 rounded-lg justify-center items-center flex"></div></div>
                        <div className="text-center  p-2 rounded-lg"></div>
                    </div>

                    <div className="grid grid-cols-8 gap-2 items-center p-3 bg-blue-100 rounded-xsm relative">
                        <div className="col-span-2 flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            <span className="font-medium">Emma Martin</span>
                            <span className="italic text-gray-600">Diabetes</span>
                        </div>
                        <div className="text-center bg-white p-2 rounded shadow"></div>
                        <div className="text-center bg-white p-2 rounded shadow">120</div>
                        <div className="text-center bg-red-500 text-white p-2 rounded shadow">80</div>
                        <div className="text-center bg-white p-2 rounded shadow">15</div>
                        <div className="text-center bg-white p-2 rounded shadow"></div>
                        <div className="text-center bg-red-500 text-white p-2 rounded shadow">39.1</div>
                    </div>
                </div>
            </div>
        </body>
    )
}

export default PatientListForm