import { VitalName } from "./Vital"

export interface PresetTiming {
    value: number
    timingType: 'Interval'
    time: 'Seconds' | 'Minutes' | 'Hours' | 'Days'
}

export interface PresetAlert {
    vitals: 'HR' | 'SBP' | 'DBP' | 'SPO2' | 'RR' | 'ACT' | 'T'
    threshold: number
    alertType: 'Above' | 'Below'
}

export interface Preset {
    id?:string
    name: string
    carepathId: string
    vitals: VitalName[]
    timings: PresetTiming[]
    alerts: PresetAlert[]
}
