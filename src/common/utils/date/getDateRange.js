import { formatDate } from './formatDate.js';

export const getDateRange = (startDate, endDate) => {
  const formattedStart = formatDate(startDate, 'dd-MM-yyyy');
  const formattedEnd = formatDate(endDate, 'dd-MM-yyyy');

  return {
    start: formattedStart,
    end: formattedEnd
  };
};
