/**
 * Sanitizes a text input string by:
 * - Trimming whitespace
 * - Escaping HTML entities
 * - Removing non-printable characters
 *
 * @param {string} input
 * @returns {string}
 */
export function sanitizeTextInput(input) {
  if (typeof input !== 'string') return '';

  // Trim
  let sanitized = input.trim();

  //  Remove non-printable characters (ASCII < 32 except newline/tab)
  sanitized = sanitized.replace(/[^\x20-\x7E\n\t]/g, '');

  //  Escape HTML entities
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  return sanitized;
}
