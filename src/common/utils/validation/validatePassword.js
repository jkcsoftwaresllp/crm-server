export function validatePassword(password) {
  const errors = [];

  if (typeof password !== 'string' || password.trim().length === 0) {
    errors.push("Password must be a non-empty string.");
    return { valid: false, errors };
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number.");
  }

  if (!/[!@#$%^&*()]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*()).");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
