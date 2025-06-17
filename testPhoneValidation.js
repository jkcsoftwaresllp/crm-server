import { validatePhoneNumber } from './src/common/utils/validation/validatePhone.js';

const testCases = [
  { phone: '9876543210', countryCode: 'IN' },
  { phone: '+919876543210' },
  { phone: '09876543210', countryCode: 'IN' },
  { phone: '12345', countryCode: 'IN' },
  { phone: '442071838750', countryCode: 'GB' }, // London number
];

testCases.forEach(({ phone, countryCode }, index) => {
  const result = validatePhoneNumber(phone, countryCode);
  console.log(`Test ${index + 1}:`);
  console.log(`  Input: ${phone} (Country: ${countryCode || 'Default'})`);
  console.log(`  Result:`, result);
  console.log('-----------------------------------');
});
