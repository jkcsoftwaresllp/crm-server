// lib/validation/validateSubdomain.js

const RESERVED_SUBDOMAINS = [
  'admin',
  'api',
  'www',
  'root',
  'support',
  'help',
  'dashboard'
];

function validateSubdomain(subdomain) {
  if (!subdomain) return true;
  if (typeof subdomain !== 'string') return false;
  subdomain = subdomain.trim();
  if (subdomain.length < 3 || subdomain.length > 63) return false;
  if (RESERVED_SUBDOMAINS.includes(subdomain)) return false;
  const regex = /^(?!-)[a-z0-9-]+(?<!-)$/;
  if (!regex.test(subdomain)) return false;
  return true;
}

export default validateSubdomain;
