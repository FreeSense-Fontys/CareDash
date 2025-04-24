import { formatTime, timeToMinutes } from "./utils";

export interface T {
    time: string,
    T: number
}


/**
 * Generates a temperature signal for a patient, optionally simulating a fever.
 *
 * @param {number} interval - The time interval in minutes for generating data points.
 * @param {string} startTime - The start time in "hh:mm" format.
 * @param {string} endTime - The end time in "hh:mm" format.
 * @param {Object} [fever] - Optional fever onset period with start time in "hh:mm" format.
 * @param {string} fever.start - The start time of the fever period.
 * @returns {Temp[]} - An array of temperature data points with timestamps.
 */
export function generateTemperatureSignal(startTime: string, endTime: string, interval = 5, fever?: { start: string }): T[] {
    const baseTemperature = 36.8;
    const feverStart = fever ? timeToMinutes(fever.start) : null;

    // Models temperature increase due to fever, if applicable
    const feverFactor = (minuteOfDay: number) => {
        if (feverStart !== null && minuteOfDay >= feverStart) {
            return 2 * (1 - Math.exp(-0.05 * (minuteOfDay - feverStart))); // Gradual fever increase
        }
        return 0;
    };

    const signal: T[] = [];
    for (let minute = timeToMinutes(startTime); minute <= timeToMinutes(endTime); minute += interval) {
        const temperature = baseTemperature + feverFactor(minute);
        const time = formatTime(minute);

        signal.push({ time, T: temperature });
    }

    return signal;
}