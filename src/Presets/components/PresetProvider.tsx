import { createContext, useEffect, useState } from 'react'
import exh from '../../Auth'
import { Preset } from '../../types/Preset'
import { Timing, Time, TimingType } from '../../types/Timing'
import { Alert } from '../../types/Alert'
import { rqlBuilder } from '@extrahorizon/javascript-sdk'

interface PresetContextType {
    preset: Preset[] | null
    setPreset: React.Dispatch<React.SetStateAction<Preset[] | null>>
}

export const PresetContext = createContext<PresetContextType | undefined>(
    undefined
)

export const PresetProvider = ({ children }: { children: React.ReactNode }) => {
    const [preset, setPreset] = useState<Preset[] | null>(null)

    async function getPresetData() {
        try {
            const response = await exh.data.documents.find(
                'wearable-preset',
                {}
            )

            const cleanedPresets: Preset[] = await Promise.all(
                response.data.map(async (doc: any) => {
                    const data = doc.data
                    const timings: Timing[] = await Promise.all(
                        (data.timings || []).map(async (id: string) => {
                            const timingRes = await exh.data.documents.find(
                                'preset-timing',
                                {
                                    rql: rqlBuilder().eq('id', id).build(),
                                }
                            )

                            const timingDoc = timingRes.data[0]
                            const t = timingDoc.data

                            return {
                                id: timingDoc.id,
                                type: TimingType[
                                    t.timingType as keyof typeof TimingType
                                ],
                                value: t.value,
                                time: t.time
                                    ? Time[t.time as keyof typeof Time]
                                    : undefined,
                            }
                        })
                    )
                    const alerts: Alert[] = await Promise.all(
                        (data.alerts || []).map(async (id: string) => {
                            const alertRes = await exh.data.documents.find(
                                'alert',
                                {
                                    rql: rqlBuilder().eq('id', id).build(),
                                }
                            )
                            const alertDoc = alertRes.data[0]
                            return {
                                id: alertDoc.id,
                                data: alertDoc.data,
                            }
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
                })
            )

            setPreset(cleanedPresets)
        } catch (error) {
            console.error('Failed to fetch presets:', error)
        }
    }

    useEffect(() => {
        getPresetData()
    }, [])

    return (
        <PresetContext.Provider value={{ preset, setPreset }}>
            {children}
        </PresetContext.Provider>
    )
}
