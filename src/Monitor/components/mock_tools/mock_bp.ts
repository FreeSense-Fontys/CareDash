/**
 * Interpolates blood pressure readings over a specified time range at a given interval.
 * 
 * @param {BP[]} data - Array of blood pressure readings with time stamps.
 * @param {string} startTime - The start time in "hh:mm" format.
 * @param {string} stopTime - The stop time in "hh:mm" format.
 * @param {number} [interval=5] - The interval in minutes for interpolation.
 * @returns {BP[]} - An array of interpolated blood pressure readings.
 */
export function interpolateBloodPressure(
    data: BP[],
    startTime: string = "00:00",
    stopTime: string = "23:59",
    interval: number = 5
): BP[] {
    const interpolatedData: BP[] = [];

    /**
     * Performs linear interpolation between two values.
     * @param {number} start - Start value.
     * @param {number} end - End value.
     * @param {number} steps - Number of steps.
     * @returns {number[]} - Array of interpolated values.
     */
    function interpolate(start: number, end: number, steps: number) {
        return Array.from({ length: steps }, (_, i) =>
            start + (end - start) * (i / (steps - 1))
        );
    }

    /**
     * Converts a time string in "hh:mm" format to a Date object.
     * @param {string} timeStr - Time string in "hh:mm" format.
     * @returns {Date} - Corresponding Date object.
     */
    const parseTime = (timeStr: string) => new Date(`2000-01-01T${timeStr}`);

    let startDate = parseTime(startTime);
    let stopDate = parseTime(stopTime);

    for (let i = 0; i < data.length - 1; i++) {
        let t1 = parseTime(data[i].time);
        let t2 = parseTime(data[i + 1].time);

        // Skip segments outside the desired range
        if (t2 < startDate || t1 > stopDate) continue;

        // Clamp start and end times to the desired range
        let segmentStart = t1 < startDate ? startDate : t1;
        let segmentEnd = t2 > stopDate ? stopDate : t2;

        let minutesBetween = (segmentEnd.valueOf() - segmentStart.valueOf()) / (1000 * 60);
        let steps = Math.round(minutesBetween / interval);

        let sbpValues = interpolate(data[i].SBP, data[i + 1].SBP, steps);
        let dbpValues = interpolate(data[i].DBP, data[i + 1].DBP, steps);

        for (let j = 0; j < steps; j++) {
            let newTime = new Date(segmentStart.getTime() + j * interval * 60000);
            if (newTime > stopDate) break;

            let formattedTime = newTime.toTimeString().slice(0, 5);
            interpolatedData.push({ time: formattedTime, SBP: sbpValues[j], DBP: dbpValues[j] });
        }
    }

    return interpolatedData;
}

export interface BP {
    time: string,
    SBP: number,
    DBP: number
}

export const EXAMPLE_DATA = [
    { time: "00:00", SBP: 140, DBP: 80 },
    { time: "02:00", SBP: 130, DBP: 80 },
    { time: "06:00", SBP: 145, DBP: 85 },
    { time: "10:00", SBP: 180, DBP: 110 },
    { time: "14:00", SBP: 170, DBP: 100 },
    { time: "18:00", SBP: 160, DBP: 100 },
    { time: "22:00", SBP: 150, DBP: 90 },
    { time: "24:00", SBP: 140, DBP: 80 },
];