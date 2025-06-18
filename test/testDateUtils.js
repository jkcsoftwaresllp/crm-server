
import { formatDate } from '../src/common/utils/date/formatDate.js';
import { getDateRange } from '../src/common/utils/date/getDateRange.js';
import { isValidTimezone } from '../src/common/utils/date/isValidTimeZone.js';
import { convertToTimezone } from '../src/common/utils/date/convertToTimezone.js';

console.log('\n--- ✅ Testing formatDate ---');
const dateSample = '2025-06-18T12:30:45';
console.log('Expected: 18-06-2025, Got:', formatDate(dateSample, 'dd-MM-yyyy'));
console.log('Expected: 12:30:45, Got:', formatDate(dateSample, 'HH:mm:ss'));
console.log('Expected Default: 2025-06-18 12:30:45, Got:', formatDate(dateSample));

console.log('\n--- ✅ Testing getDateRange ---');
const range = getDateRange('2025-06-01', '2025-06-18');
console.log('Expected Start: 01-06-2025, Got:', range.start);
console.log('Expected End: 18-06-2025, Got:', range.end);

console.log('\n--- ✅ Testing isValidTimezone ---');
console.log('Valid (Asia/Kolkata):', isValidTimezone('Asia/Kolkata')); // true
console.log('Invalid (Fake/Zone):', isValidTimezone('Fake/Zone'));     // false

console.log('\n--- ✅ Testing convertToTimezone ---');
const converted = convertToTimezone('2025-06-18T06:00:00Z', 'Asia/Kolkata');
console.log('Asia/Kolkata Time:', converted);
