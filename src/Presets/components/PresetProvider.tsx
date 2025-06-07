import { createContext, useEffect, useState } from 'react'
import exh from '../../Auth'
import { Preset, PresetTiming, PresetAlert } from '../../types/Preset'

interface PresetContextType {
    preset: Preset[] | null
    setPreset: React.Dispatch<React.SetStateAction<Preset[] | null>>
}

export const PresetContext = createContext<PresetContextType | undefined>(
    undefined
)

export const PresetProvider = ({ children }: { children: React.ReactNode }) => {
    const [preset, setPreset] = useState<Preset[] | null>(null)

    async function GetPresets() {
        try {
            const response = await exh.data.documents.find(
                'wearable-preset',
                {}
            )

            const cleanedPresets: Preset[] = response.data.map(
                (doc: any) => {
                    const data = doc.data

                    const timings: PresetTiming[] = (data.timings || []).map(
                        (t: any) => ({
                            value: t.value,
                            timingType: t.timingType as 'Interval',
                            time: t.time as
                                | 'Seconds'
                                | 'Minutes'
                                | 'Hours'
                                | 'Days',
                        })
                    )

                    const alerts: PresetAlert[] = (data.alerts || []).map(
                        (a: any) => ({
                            vitals: a.vitals,
                            threshold: a.threshold,
                            alertType: a.alertType,
                        })
                    )

                    return {
                        id: doc.id,
                        name: data.name,
                        carepathId: data.carepathId,
                        vitals: data.vitals,
                        timings,
                        alerts,
                    }
                }
            )

            console.log(cleanedPresets);
            setPreset(cleanedPresets)
        } catch (error) {
            console.error('Failed to fetch presets:', error)
        }
    }

    useEffect(() => {
        GetPresets()
    }, [])

    return (
        <PresetContext.Provider value={{ preset, setPreset }}>
            {children}
        </PresetContext.Provider>
    )
}
