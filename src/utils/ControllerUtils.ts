export class ControllerUtils {
  static success(data: any) {
    return {
      ok: true,
      data
    };
  }

  static error(message: string) {
    return {
      ok: false,
      error: message
    };
  }

  static isUndefined(value: any) {
    return typeof value === 'undefined';
  }

  static getSeconds(date: Date) {
    return Math.floor(date.getTime() / 1000);
  }

  static convertMinutesToMMSS(minutes: number) {
    if (isNaN(minutes)) return '';

    // Convert the decimal minutes to total seconds
    let totalSeconds = Math.floor(minutes * 60);

    // Calculate minutes and seconds
    let mm = Math.floor(totalSeconds / 60); // Extract the minutes
    let ss = totalSeconds % 60; // Extract the remaining seconds

    // Ensure two-digit format for seconds
    const seconds = ss.toString().padStart(2, '0');

    // Return the formatted mm:ss string
    return `${mm}:${seconds}`;
}
}
