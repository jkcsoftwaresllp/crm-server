/**
 * Validates the format of an email address.
 *
 * @param {string} email - The email to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validateEmail(email) {
  if (typeof email !== 'string') return false;

  const cleanedEmail = email.trim().toLowerCase();

  // Basic email format regex
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(cleanedEmail);
}

export default validateEmail;
