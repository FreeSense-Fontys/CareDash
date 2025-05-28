export enum VitalName {
    HeartRate = 'HR',
    SystolicBloodPressure = 'SBP',
    DiastolicBloodPressure = 'DBP',
    OxygenSaturation = 'SPO2',
    RespiratoryRate = 'RR',
    Activity = 'ACT',
    Temperature = 'T',
}

export interface Vital {
    id?: string
    name: VitalName
    sqiStatus: number
    timestamp: Date
    value: number
}
