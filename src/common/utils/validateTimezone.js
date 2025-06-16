import moment from "moment-timezone";


export default function validateTimezone(tz) {
  if (!tz || typeof tz !== 'string') return false;
  return moment.tz.zone(tz) !== null;
}
