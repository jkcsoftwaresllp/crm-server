import { formatDate } from './formatDate.js';

export const getDateRange = (startDate, endDate) => {
  const formattedStart = formatDate(startDate, 'DD-MM-YYYY');
  const formattedEnd = formatDate(endDate, 'DD-MM-YYYY');

  return {
    start: formattedStart,
    end: formattedEnd
  };
};
