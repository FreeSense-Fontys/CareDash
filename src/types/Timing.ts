export enum TimingType{
    Interval
}

export enum Time{
    Seconds,
    Minutes,
    Hours,
    Days
}

export interface Timing{
    id:string;
    type:TimingType
    value:number
    time:Time | undefined
}