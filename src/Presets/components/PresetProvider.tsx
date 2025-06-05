import { createContext, useEffect, useState } from 'react'
import { Preset } from '../../types/Preset'
import { VitalName } from '../../types/Vital'
import { Time, TimingType } from '../../types/Timing'

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
        const dummyData: Preset[] = [
            {
                id: '1',
                name: 'POTS',
                carepathId: 'carepath-pots',
                vitals: [
                    VitalName.HeartRate,
                    VitalName.DiastolicBloodPressure,
                    VitalName.SystolicBloodPressure,
                ],
                timings: [
                    {
                        id: 't1',
                        type: TimingType.Interval,
                        value: 15,
                        time: Time.Minutes,
                    },
                ],
                alerts: [
                    {
                        id: 'a1',
                        data: {
                            vital: VitalName.HeartRate,
                            alertType: 'Above',
                            threshold: 120,
                            wearableId: '',
                            carepathId: 'carepath-pots',
                        },
                    },
                    {
                        id: 'a2',
                        data: {
                            vital: VitalName.DiastolicBloodPressure,
                            alertType: 'Below',
                            threshold: 90,
                            wearableId: '',
                            carepathId: 'carepath-pots',
                        },
                    },
                    {
                        id: 'a3',
                        data: {
                            vital: VitalName.SystolicBloodPressure,
                            alertType: 'Below',
                            threshold: 50,
                            wearableId: '',
                            carepathId: 'carepath-pots',
                        },
                    },
                ],
            },
            {
                id: '2',
                name: 'COPD',
                carepathId: 'carepath-copd',
                vitals: [VitalName.OxygenSaturation, VitalName.RespiratoryRate],
                timings: [
                    {
                        id: 't2',
                        type: TimingType.Interval,
                        value: 30,
                        time: Time.Minutes,
                    },
                ],
                alerts: [
                    {
                        id: 'a3',
                        data: {
                            vital: VitalName.OxygenSaturation,
                            alertType: 'Below',
                            threshold: 90,
                            wearableId: '',
                            carepathId: 'carepath-copd',
                        },
                    },
                ],
            },
            {
                id: '3',
                name: 'Asthma',
                carepathId: 'carepath-asthma',
                vitals: [VitalName.RespiratoryRate],
                timings: [
                    {
                        id: 't3',
                        type: TimingType.Interval,
                        value: 4, 
                        time: Time.Hours,
                    },
                ],
                alerts: [
                    {
                        id: 'a4',
                        data: {
                            vital: VitalName.RespiratoryRate,
                            alertType: 'Below',
                            threshold: 250,
                            wearableId: '',
                            carepathId: 'carepath-asthma',
                        },
                    },
                ],
            },
        ]

        setPreset(dummyData)
    }

    useEffect(() => {
        getPresetData()
    }, [])

    return (
        <PresetContext.Provider
            value={{
                preset,
                setPreset,
            }}
        >
            {children}
        </PresetContext.Provider>
    )
}
