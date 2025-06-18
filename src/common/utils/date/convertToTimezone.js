export const convertToTimezone = (date, timezone) => {
  return new Date(date).toLocaleString('en-US', { timeZone: timezone });
};
