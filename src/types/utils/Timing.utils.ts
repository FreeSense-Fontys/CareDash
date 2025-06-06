import { Time, TimingType } from '../../types/Timing'

export const TIME_STRING_TO_ENUM: Record<string, Time> = {
  Seconds: Time.Seconds,
  Minutes: Time.Minutes,
  Hours: Time.Hours,
  Days: Time.Days,
}

export const TIME_ENUM_TO_STRING: Record<Time, string> = {
  [Time.Seconds]: 'Seconds',
  [Time.Minutes]: 'Minutes',
  [Time.Hours]: 'Hours',
  [Time.Days]: 'Days',
}

export const TIMING_TYPE_STRING_TO_ENUM: Record<string, TimingType> = {
  Interval: TimingType.Interval,
}

export const TIMING_TYPE_ENUM_TO_STRING: Record<TimingType, string> = {
  [TimingType.Interval]: 'Interval',
}
