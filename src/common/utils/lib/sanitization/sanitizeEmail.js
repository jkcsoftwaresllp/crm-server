export default function sanitizeEmail(email) {
  if (typeof email !== 'string') return null;
  const trimmed = email.trim();
  if (!trimmed) return null;
  return trimmed.toLowerCase();
}
