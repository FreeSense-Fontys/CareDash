import { createContext, useEffect, useState } from "react"
import { Preset } from "../../types/Preset"

interface PresetContextType {
    preset: Preset[] | null
    setPreset: React.Dispatch<React.SetStateAction<Preset[] | null>>
}

export const PresetContext = createContext<PresetContextType | undefined>(undefined)
export const PresetProvider = ({
    children,
}: {
    children: React.ReactNode
}) => {
    const [preset, setPreset] = useState<Preset[] | null>(null)

    async function getPresetData() {
    const dummyData: Preset[] = [
        {
            id: "1",
            name: "Depression",
            carepathId: "carepath-101",
            measuredVitals: [],
            timings: [],
            alerts: []
        },
        {
            id: "2",
            name: "COPD",
            carepathId: "carepath-102",
            measuredVitals: [],
            timings: [],
            alerts: []
        }
    ];

    setPreset(dummyData);
    }

    useEffect(() => {
        getPresetData()
    }, [])

    return (
        <PresetContext.Provider
            value={{
                preset,
                setPreset
            }}
        >
            {children}
        </PresetContext.Provider>
    )
}

