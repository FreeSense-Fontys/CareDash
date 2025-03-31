import { C } from 'vitest/dist/chunks/reporters.d.CqBhtcTq.js'
import '../../App.css'
import mock_patient_data from './MockPatientData'


const PatientListForm = () => {

    return (
        <body className="bg-gray-100 p-6 ">
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
                <div className="flex justify-between gap-5 text-center font-semibold text-white p-2 rounded">
                    <div className="flex justify-left items-center gap-5 w-50 ml-5">
                        <span className="w-3 h-3 rounded-full"></span>
                        <span className="font-medium"></span>
                    </div>
                    <div className="flex justify-center items-center gap-2 w-20">
                        <span className="italic text-gray-600"></span>
                    </div >

                    <div className="flex justify-around gap-5">
                        <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">HR<p className="text-[11px]">[/min]</p></div></div>
                        <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">BP<p className="text-[11px]">[mmHg]</p></div></div>
                        <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">SPO2<p className="text-[11px]">[%]</p></div></div>
                        <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">RR<p className="text-[11px]">[/min]</p></div></div>
                        <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">ACT<p className="text-[11px]">[min]</p></div></div>
                        <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center bg-accent items-center flex flex-col leading-tight">T<p className="text-[11px]">[°C]</p></div></div>
                    </div>
                    <div className="flex justify-around">
                        <input className="w-6 h-6 rounded border-gray-300 focus:ring-blue-500 mr-5 " />
                    </div>
                </div>

                {/* Patient List */}
                {mock_patient_data.map((patient) =>
                    patient.carepaths.map((carepath, index) => (
                        <div key={`${patient.id}-${index}`} className="space-y-4 mt-2">
                            <div className="flex items-center justify-between  p-3 bg-background rounded-xsm relative">

                                <div className="flex justify-left items-center gap-5 w-50 ml-4">
                                    <span className={`w-3 h-3 ${patient.online ? "bg-green-500" : "bg-gray-500"} rounded-full`}></span>
                                    <span className="font-medium">{patient.name}</span>
                                </div>
                                <div className="flex justify-center items-center gap-2 w-22">
                                    <span className="italic text-gray-600">{carepath.carepath}</span>
                                </div >

                                <div className="flex justify-around gap-5 ">
                                    <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center items-center flex">120</div></div>
                                    <div className="flex justify-center items-center"><div className="text-center size-12 bg-red-500 text-white p-2 rounded-lg justify-center items-center flex leading-tight">128 /80</div></div>
                                    <div className="flex justify-center items-center"><div className="text-center size-12 bg-red-500 text-white p-2 rounded-lg justify-center items-center flex">80</div></div>
                                    <div className="flex justify-center items-center"><div className="text-center size-12 rounded-lg justify-center items-center flex"></div></div>
                                    <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center items-center flex">20</div></div>
                                    <div className="flex justify-center items-center"><div className="text-center  size-12 rounded-lg justify-center items-center flex"></div></div>
                                </div>
                                <div className="flex justify-around">
                                    <input type="checkbox" className="w-6 h-6 rounded border-gray-300 focus:ring-blue-500 mr-5 " />
                                </div>
                            </div>

                            {/* <div className="flex items-center justify-between  p-3 bg-blue-100 rounded-xsm relative">

                        <div className="flex justify-left items-center gap-5 w-50 ml-4">
                            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            <span className="font-medium">Emma Martin</span>
                        </div>
                        <div className="flex justify-center items-center gap-2 w-20">
                            <span className="italic text-gray-600">Diabetes</span>
                        </div >

                        <div className="flex justify-around gap-5 ">
                            <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center items-center flex">120</div></div>
                            <div className="flex justify-center items-center"><div className="text-center size-12  p-2 rounded-lg justify-center items-center flex"></div></div>
                            <div className="flex justify-center items-center"><div className="text-center size-12 bg-red-500 text-white p-2 rounded-lg justify-center items-center flex">80</div></div>
                            <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center items-center flex">15</div></div>
                            <div className="flex justify-center items-center"><div className="text-center  size-12 rounded-lg justify-center items-center flex"></div></div>
                            <div className="flex justify-center items-center"><div className="text-center  size-12 rounded-lg justify-center items-center flex"></div></div>
                        </div>
                        <div className="flex justify-around">
                            <input type="checkbox" className="w-6 h-6 rounded border-gray-300 focus:ring-blue-500 mr-5 " />
                        </div>
                    </div> */}

                        </div>
                    )))}
            </div>
        </body>
    )
}

export default PatientListForm