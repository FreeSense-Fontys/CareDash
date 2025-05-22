
interface ConfigurationItemsPromps {
    selectedPatient: 
    icon: ReactNode
    label: string
    testId: string
    collapsed: boolean
}


const ConfigurationItems = ({selectedPatient, activeCarepath, handleAddCarepath}: ConfigurationItemsPromps) => {

    return (

        <div className="flex flex-col ">
            <div className=" gap-4 relative inline-block w-64 bg-accent rounded-lg text-white mb-8">
                <select
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className="block appearance-none w-full py-3 px-4 pr-10 text-black rounded leading-tight focus:outline-none"
                >
                    {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                            {patient.name}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.516 7.548l4.484 4.484 4.484-4.484L16 9l-6 6-6-6z" /></svg>
                </div>
            </div>

            <div className="border-b ">
                <div className="flex ">
                    {carepaths.map((cp) => (
                        <button
                            key={cp}
                            onClick={() => setActiveCarepath(cp)}
                            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors duration-150 border-b-2 ${activeCarepath === cp
                                ? "bg-blue-100 border-t-indigo-500 border-white-500 rounded-t-lg"
                                : "bg-gray-100 border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-500"
                                }`}
                        >
                            {cp}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-4 pt-4 mb-5">
                <h2 className="text-lg font-semibold">Vitals</h2>
                <div className="col-span-3 space-y-1">
                    {defaultConfig.vitals.map((vital) => (
                        <p key={vital}>{vital}</p>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 border-t pt-4 mb-5">
                <h2 className="text-lg font-semibold">Timing</h2>
                <p className="col-span-3">{defaultConfig.timing}</p>
            </div>

            <div className="grid grid-cols-4 gap-4 border-t pt-4 mb-5">
                <h2 className="text-lg font-semibold">Alerts</h2>
                <div className="col-span-3 space-y-1">
                    {defaultConfig.alerts.map((alert) => (
                        <p key={alert}>{alert}</p>
                    ))}
                </div>
            </div>

            <div className="flex justify-end mt-15">
                <button
                    className=" bg-secondary text-white text-lg px-7 py-2 rounded mr-5 hover:bg-accent"
                    onClick={handleAddCarepath}
                >
                    Edit
                </button>
            </div>
        </div>
    )

}

export default ConfigurationItems