export const convertToTimezone = (date, timezone) => {
  const localDate = new Date(date).toLocaleString('en-US', { timeZone: timezone });
  const d = new Date(localDate);

  const day = `${d.getDate()}`.padStart(2, '0');
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const year = d.getFullYear();
  const hours = `${d.getHours()}`.padStart(2, '0');
  const minutes = `${d.getMinutes()}`.padStart(2, '0');
  const seconds = `${d.getSeconds()}`.padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};
