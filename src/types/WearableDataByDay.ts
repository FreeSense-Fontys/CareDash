import { Vital, VitalName } from './Vital'

export interface VitalSeries {
    name: VitalName
    series: Vital[]
}

export interface WearableDataByDay {
    date: string
    patientId: string
    wearableId: string
    vitals: VitalSeries[]
}
