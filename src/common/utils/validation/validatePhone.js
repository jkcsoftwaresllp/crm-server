export const validatePhoneNumber = (phone, countryCode = 'IN') => {
  // Remove spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-()]/g, '');

  let formatted = '';
  let isValid = false;

  if (countryCode === 'IN') {
    // Case 1: Starts with +91
    if (/^\+91\d{10}$/.test(cleaned)) {
      formatted = cleaned;
      isValid = true;
    }
    // Case 2: Starts with 91
    else if (/^91\d{10}$/.test(cleaned)) {
      formatted = `+${cleaned}`;
      isValid = true;
    }
    // Case 3: Starts with 0
    else if (/^0\d{10}$/.test(cleaned)) {
      formatted = `+91${cleaned.slice(1)}`;
      isValid = true;
    }
    // Case 4: Just 10 digits
    else if (/^\d{10}$/.test(cleaned)) {
      formatted = `+91${cleaned}`;
      isValid = true;
    }
  }

  return {
    isValid,
    formatted: isValid ? formatted : null,
  };
};
