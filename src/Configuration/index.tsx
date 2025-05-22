import { useState } from "react";
import logo from '../assets/Carebuddy logo.webp';
import ConfigurationItems from "./components/ConfigurationItems";


const patients = [
    { id: "emma", name: "Emma Martin" },
    { id: "john", name: "John Doe" },
    { id: "jane", name: "Jane Smith" }
];

const defaultConfig = {
    vitals: ["Activity", "Oxygen Saturation", "Respiration Rate"],
    timing: "Every 3 Minutes",
    alerts: ["BP < 90/60 mm Hg", "BP > 140/90 mm Hg"]
};

const ConfigurationPage = () => {

    const [selectedPatient, setSelectedPatient] = useState("emma");
    const [carepaths, setCarepaths] = useState(["Diabetes"]);
    const [activeCarepath, setActiveCarepath] = useState("Diabetes");

    const handleAddCarepath = () => {
        const newCarepath = `Carepath ${carepaths.length + 1}`;
        setCarepaths([...carepaths, newCarepath]);
        setActiveCarepath(newCarepath);
    };

    return (
        <div className="w-full overflow-hidden">
            <div className="bg-white h-screen flex flex-col">
                <div className="mx-auto bg-white p-4 rounded-lg flex flex-col w-full">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">CareBuddy Configuration</h1>
                        <div className={` pr-4 mt-3 h-10 w-auto`}>
                            <img src={(logo)} alt="Logo" className="h-14 w-auto" />
                        </div>
                    </div>

                    <ConfigurationItems
                        selectedPatient={selectedPatient}
                        activeCarepath={activeCarepath}
                        handleAddCarepath={handleAddCarepath}
                    />
                </div>
            </div>
        </div>
    )
}

export default ConfigurationPage
