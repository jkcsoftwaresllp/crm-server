export default function validateEmail(email) {
  const trimmedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!trimmedEmail) {
    return { valid: false, message: 'Email cannot be empty.' };
  }

  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, message: 'Invalid email format.' };
  }

  return { valid: true, message: 'Valid email address.' };
}

