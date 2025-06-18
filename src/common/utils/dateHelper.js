import { DateTime } from "luxon";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  subMonths,
} from "date-fns";

export function formatDate(date, formatStr = "yyyy-MM-dd HH:mm:ss") {
  return format(new Date(date), formatStr);
}

export function isValidTimezone(timezone) {
  try {
    return !!DateTime.now().setZone(timezone).isValid;
  } catch {
    return false;
  }
}

export function convertToTimezone(date, timezone) {
  return DateTime.fromJSDate(new Date(date)).setZone(timezone).toISO();
}

export function getDateRange(period) {
  const now = new Date();

  switch (period) {
    case "last_week": {
      const start = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
      const end = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
      return { start, end };
    }
    case "this_week": {
      const start = startOfWeek(now, { weekStartsOn: 1 });
      const end = endOfWeek(now, { weekStartsOn: 1 });
      return { start, end };
    }
    case "this_month": {
      return { start: startOfMonth(now), end: endOfMonth(now) };
    }
    case "last_month": {
      const lastMonth = subMonths(now, 1);
      return {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth),
      };
    }
    default:
      throw new Error(`Unsupported period: ${period}`);
  }
}
