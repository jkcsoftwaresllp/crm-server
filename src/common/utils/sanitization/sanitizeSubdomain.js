export function sanitizeSubdomain(subdomain) {
  if (typeof subdomain !== 'string') return '';

  return subdomain
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
