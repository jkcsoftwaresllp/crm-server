/**
 * Sanitizes a file name to prevent security issues like path traversal
 * and ensure it only contains safe characters.
 *
 * @param {string} fileName - The original file name
 * @returns {string} - The sanitized file name
 */
function sanitizeFileName(fileName) {
  // Remove path traversal sequences like ../ or .\
  fileName = fileName.replace(/(\.\.[\/\\])/g, '');

  // Remove all characters except alphanumeric, dash, underscore, and dot
  fileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '');

  // Trim filename length to max 100 characters
  if (fileName.length > 100) {
    const extIndex = fileName.lastIndexOf('.');
    const base = extIndex !== -1 ? fileName.slice(0, extIndex) : fileName;
    const ext = extIndex !== -1 ? fileName.slice(extIndex) : '';
    fileName = base.slice(0, 100 - ext.length) + ext;
  }

  return fileName;
}

export default sanitizeFileName;
