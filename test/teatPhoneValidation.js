import { validatePhoneNumber } from './src/common/utils/validation/validatePhone.js';

const numbers = [
  '9876543210',
  '09876543210',
  '+919876543210',
  '91-9876543210',
  '98765-43210',
  '123456789',
];

for (const phone of numbers) {
  const result = validatePhoneNumber(phone);
  console.log(`Input: ${phone} -> Valid: ${result.isValid}, Formatted: ${result.formatted}`);
}
