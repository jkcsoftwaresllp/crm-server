import { parsePhoneNumberFromString } from 'libphonenumber-js';

/**
 * Validates and formats a phone number.
 * @param {string} phone - Phone number input (e.g., '9876543210', '+919876543210')
 * @param {string} [countryCode='IN'] - Optional country code (default is 'IN' for India)
 * @returns {{ isValid: boolean, formatted?: string, error?: string }}
 */
export function validatePhoneNumber(phone, countryCode = 'IN') {
  try {
    const phoneNumber = parsePhoneNumberFromString(phone, countryCode);

    if (phoneNumber && phoneNumber.isValid()) {
      return {
        isValid: true,
        formatted: phoneNumber.formatInternational()
      };
    } else {
      return {
        isValid: false,
        error: 'Invalid phone number'
      };
    }
  } catch (err) {
    return {
      isValid: false,
      error: 'Error parsing phone number'
    };
  }
}
