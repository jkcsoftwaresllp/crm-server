/**
 * Sanitize file name to:
 * - Remove special characters
 * - Prevent path traversal
 * - Limit filename length
 * - Allow only alphanumerics, hyphen (-), underscore (_), and dot (.)
 */

export function sanitizeFileName(fileName) {
  if (typeof fileName !== 'string') return '';

  // 1. Remove path traversal patterns (../ or ..\ or absolute slashes)
  let baseName = fileName.replace(/(\.\.[\/\\])+/, '').replace(/[\/\\]/g, '');

  // 2. Allow only alphanumerics, -, _, and .
  baseName = baseName.replace(/[^a-zA-Z0-9._-]/g, '');

  // 3. Limit the file name length (100 characters max)
  const MAX_LENGTH = 100;
  if (baseName.length > MAX_LENGTH) {
    baseName = baseName.slice(0, MAX_LENGTH);
  }

  return baseName;
}


