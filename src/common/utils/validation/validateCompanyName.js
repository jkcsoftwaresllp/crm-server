/**
 * Validates a company name string.
 
 * - Must be a non-empty string
 * - 3 to 100 characters
 * - Only letters, numbers, spaces, and hyphens
 */


export function validateCompanyName(name) {
  if (typeof name !== 'string' || !name.trim()) {
    return {
      valid: false,
      message: 'Company name must be a non-empty string',
    };
  }

  const trimmed = name.trim();
  if (trimmed.length < 3 || trimmed.length > 100) {
    return {
        valid: false,
        message: 'Company name must be between 3 and 100 characters',
    };
  }

  const isValidFormat = /^[a-zA-Z0-9 -]+$/;

  if (!isValidFormat.test(trimmed)) {
    return {
      valid: false,
      message: 'Company name can only contain letters, numbers, spaces, and hyphens',
    };
  }

  return { valid: true };
}



