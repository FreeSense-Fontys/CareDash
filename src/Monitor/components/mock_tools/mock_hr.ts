import { formatTime, timeToMinutes } from "./utils";

/**
 * Generates a heart rate signal based on time of day, exercise periods, and high-frequency variations.
 *
 * @param {number} interval - The time interval in minutes for generating data points.
 * @param {string} startTime - The start time in "hh:mm" format.
 * @param {string} endTime - The end time in "hh:mm" format.
 * @param {Object} [exercise] - Optional exercise period with start and stop times in "hh:mm" format.
 * @param {string} exercise.start - The start time of the exercise period.
 * @param {string} exercise.stop - The end time of the exercise period.
 * @returns {HR[]} - An array of heart rate data points with timestamps.
 */
export function generateHeartRateSignal(
    interval = 5,
    startTime: string = "00:00",
    endTime: string = "23:59",
    exercise?: {
        start: string,
        stop: string
    }): HR[] {
    const baseHeartRate = 75;

    const startMinute = timeToMinutes(startTime);
    const endMinute = timeToMinutes(endTime);
    const exerciseStart = exercise ? timeToMinutes(exercise.start) : null;
    const exerciseEnd = exercise ? timeToMinutes(exercise.stop) : null;

    // Computes a circadian rhythm-based heart rate variation
    const timeOfDayFactor = (minuteOfDay: number) => {
        const peakTime = 12 * 60;
        const rhythmAmplitude = 10;
        const timeDifference = Math.abs(minuteOfDay - peakTime);
        return rhythmAmplitude * Math.cos((timeDifference / 1440) * 2 * Math.PI);
    };

    // Computes a high-frequency oscillation component for smoother transitions
    const highFrequencyVariation = (minuteOfDay: number) => {
        const frequency = 0.1;
        const amplitude = 3;
        return amplitude * Math.cos(frequency * minuteOfDay * 2 * Math.PI);
    };

    // Models heart rate increase due to exercise, if applicable
    const exerciseFactor = (minuteOfDay: number) => {
        if (exerciseStart !== null && exerciseEnd !== null && minuteOfDay >= exerciseStart && minuteOfDay <= exerciseEnd) {
            return 30 * (1 - Math.exp(-0.1 * (minuteOfDay - exerciseStart)));
        }
        return 0;
    };

    const signal: HR[] = [];
    for (let minute = startMinute; minute <= endMinute; minute += interval) {
        const heartRateVariation = timeOfDayFactor(minute);
        const exerciseVariation = exerciseFactor(minute);
        const highFreqVariation = highFrequencyVariation(minute);

        const heartRate = baseHeartRate + heartRateVariation + exerciseVariation + highFreqVariation;
        const time = formatTime(minute);

        signal.push({ time, HR: heartRate });
    }

    return signal;
}

/**
 * Generates a randomized heart rate signal with an optional exercise period.
 * @param {number} start - 
 * @param {number} stop - 
 * @param {number} interval - The time interval in minutes for generating data points.
 * @returns {HR[]} - An array of heart rate data points with timestamps.
 */
export function randomizeHR(start: string = "00:00", stop: string = "24:00", interval: number = 5): HR[] {
    const exerciseStartPossibilities = ["05:00", "06:40", "08:20", "09:00", "10:00"];
    const exerciseDurationPossibilities = [30, 60, 80, 120, 180];

    const exerciseStart = exerciseStartPossibilities[Math.floor(Math.random() * exerciseStartPossibilities.length)];
    const exerciseEnd = (() => {
        const startMinutes = timeToMinutes(exerciseStart);
        const duration = exerciseDurationPossibilities[Math.floor(Math.random() * exerciseDurationPossibilities.length)];
        return formatTime(startMinutes + duration);
    })();

    return generateHeartRateSignal(interval, start, stop, { start: exerciseStart, stop: exerciseEnd });
}

export interface HR {
    time: string,
    HR: number
}

