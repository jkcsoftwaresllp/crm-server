import db from '../configs/db.js';

export const generateUniqueSubdomain = async (companyName) => {
  // Step 1: sanitize company name (e.g., "Test Org Pvt Ltd" -> "testorg")
  let baseSubdomain = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '') // remove special chars and spaces
    .substring(0, 20);          // keep it short and clean

  let subdomain = baseSubdomain;
  let counter = 1;

  // Step 2: Check for uniqueness in DB
  while (true) {
    const [rows] = await db.execute(
      'SELECT id FROM organizations WHERE subdomain = ?',
      [subdomain]
    );

    if (rows.length === 0) break; // unique, exit loop

    subdomain = `${baseSubdomain}${counter}`; // try next
    counter++;
  }

  return subdomain;
};