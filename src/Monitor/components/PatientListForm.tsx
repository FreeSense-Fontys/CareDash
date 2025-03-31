import '../../App.css'
import mock_patient_data from './MockPatientData'


const PatientListForm = () => {

    return (
        <div className="bg-gray-100 p-6 ">
            <div className="max-w-5xl mx-auto bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    {/* Search */}
                    <div className='justify-center items-center'>
                        <div className='text-white'>.....</div>
                        <input type="text" placeholder="Search..." className="p-2 border rounded w-80" />
                    </div>

                    <div className="flex gap-4">
                    {/* Sort */}
                        <div className='justify-center items-center'>
                            <div>Sort by</div>
                            <select className="p-2 border rounded w-25">
                                <option>Priority</option>
                            </select>
                        </div>
                    {/* Filter */}
                        <div>
                            <div>Filter by</div>
                            <select className="p-2 border rounded w-25">
                                <option>Illness</option>
                            </select>
                        </div>
                    </div>
                    {/* Calendar */}
                    <div className="flex items-center bg-background">
                        <button className="bg-accent text-white px-3 py-1 rounded rounded-l-lg">&#60;</button>
                        <span className=" font-semibold m-1"> 25 Feb, 2025 </span>
                        <button className="bg-accent text-white px-3 py-1 rounded rounded-r-lg">&#62;</button>
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
                        <input className="w-6 h-6 rounded border-gray-300 focus:ring-blue-500 mr-5 " />
                    </div>
                </div>

                {/* Patient List */}
                {mock_patient_data.map((patient) =>
                    patient.carepaths.map((carepath, index) => (
                        <div key={`${patient.id}-${index}`} className="space-y-4 mt-2">
                            <div className={`flex items-center ${index > 0 ? "ml-73" : ""} justify-between p-3 bg-background rounded-xsm relative`}>
                                {/* Patient name and online status */}
                                {index == 0 ?
                                    <div className="flex justify-left items-center gap-5 w-50 ml-4">
                                        <span className={`w-3 h-3 ${patient.online ? "bg-green-500" : "bg-gray-500"} rounded-full`}></span>
                                        <span className="font-medium">{patient.name}</span>
                                    </div> : ""
                                }

                                {/* Carepath */}
                                <div className="flex justify-center items-center gap-2 w-22">
                                    <span className="italic text-gray-600">{carepath.carepath}</span>
                                </div >

                                <div className="flex justify-around gap-5">
                                    {/* HR */}
                                    {carepath.HR == "" || carepath.HR == null ? (
                                        <div className="flex justify-center items-center"><div className="text-center size-12 rounded-lg justify-center items-center flex"></div></div>
                                    ) : (
                                        <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center items-center flex leading-tight">{carepath.HR}</div></div>
                                    )}
                                    {/* BP */}
                                    {carepath.BP == "" || carepath.BP == null ? (
                                        <div className="flex justify-center items-center"><div className="text-center size-12 rounded-lg justify-center items-center flex"></div></div>
                                    ) : (
                                        <div className="flex justify-center items-center"><div className="text-center border size-12 p-2 rounded-lg justify-center items-center flex leading-tight">{carepath.BP}</div></div>)
                                    }
                                    {/* SPO2 */}
                                    {carepath.SPO2 == "" || carepath.SPO2 == null ? (
                                        <div className="flex justify-center items-center"><div className="text-center size-12 rounded-lg justify-center items-center flex"></div></div>
                                    ) : (
                                        <div className="flex justify-center items-center"><div className="text-center border size-12 p-2 rounded-lg justify-center items-center flex leading-tight">{carepath.SPO2}</div></div>)
                                    }
                                    {/* RR */}
                                    {carepath.RR == "" || carepath.RR == null ? (
                                        <div className="flex justify-center items-center"><div className="text-center size-12 rounded-lg justify-center items-center flex"></div></div>
                                    ) : (
                                        <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center items-center flex leading-tight">{carepath.RR}</div></div>
                                    )}
                                    {/* ACT */}
                                    {carepath.ACT == "" || carepath.ACT == null ? (
                                        <div className="flex justify-center items-center"><div className="text-center size-12 rounded-lg justify-center items-center flex"></div></div>
                                    ) : (
                                        <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center items-center flex leading-tight">{carepath.ACT}</div></div>
                                    )}
                                    {/* T */}
                                    {carepath.T == "" || carepath.T == null ? (
                                        <div className="flex justify-center items-center"><div className="text-center size-12 rounded-lg justify-center items-center flex"></div></div>
                                    ) : (
                                        <div className="flex justify-center items-center"><div className="text-center border size-12 rounded-lg justify-center items-center flex leading-tight">{carepath.T}</div></div>
                                    )}
                                </div>

                                {/* Checkbox */}
                                <div className="flex justify-around">
                                    <input type="checkbox" className="w-6 h-6 rounded border-gray-300 focus:ring-blue-500 mr-5 " />
                                </div>
                            </div>
                        </div>
                    )))}
            </div>
        </div>
    )
}

export default PatientListForm