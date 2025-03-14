/**
 * Utility functions for date handling
 */

/**
 * Calculate the time difference in milliseconds between a target date and now
 * @param targetDateStr - ISO date string for the target date
 * @returns Time difference in milliseconds
 */
export const getTimeDifference = (targetDateStr: string): number => {
  try {
    // @ts-ignore - Ignore TypeScript errors for Date operations
    const targetTime = new Date(targetDateStr).getTime();
    // @ts-ignore - Ignore TypeScript errors for Date operations
    const currentTime = new Date().getTime();
    return targetTime - currentTime;
  } catch (err) {
    console.error('Error calculating date difference:', err);
    return 0;
  }
};

/**
 * Calculate days, hours, minutes, and seconds from a time difference
 * @param difference - Time difference in milliseconds
 * @returns Object with days, hours, minutes, seconds
 */
export const calculateTimeUnits = (difference: number) => {
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
}; 