
/**
 * Convert to ISO datetime string
 * 
 * @param date - YYYY-MM-DD
 * @param timeStr - HH:MM
 * @param ss -ss
 * @returns void
 */
export function convertTimeToISO(date: string, timeStr: string, ss="00") {

    // Split the time string into hours and minutes
    const [hours, minutes] = timeStr.split(':').map(Number);

    // Extract the year, month, and day from the current date

    // Manually build the ISO string
    const isoString = `${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${ss}Z`;

    return isoString;
}


/**
 * Converts a time string in "hh:mm" format to minutes since midnight.
 * @param {string} time - Time string in "hh:mm" format.
 * @returns {number} - Minutes since midnight.
 */
export const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};

/**
 * Formats a given number of minutes into "hh:mm" time format.
 * @param {number} minutes - Minutes since midnight.
 * @returns {string} - Formatted time string in "hh:mm" format.
 */
export const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};
