import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../../../../common/configs/db.js'; // ✅ You missed this import
import { getUniqueSubdomain } from '../../../../common/utils/subdomain.js';
import {
  findByEmail,
  insertUser,
  updateRefreshToken,
  getRefreshToken,
} from '../repositories/authRepository.js';

const saltRounds = 10;
const accessSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshSecret = process.env.REFRESH_TOKEN_SECRET;
const accessExpiry = '15m';
const refreshExpiry = '7d';

// ✨ UPDATED FUNCTION SIGNATURE to accept organization
export async function signup({ email, password, name, organization }) {
  const existing = await findByEmail(email);
  if (existing) {
    return { success: false, message: 'Email already in use' };
  }

  // ✅ Step 1: Generate unique subdomain
  const subdomain = await getUniqueSubdomain(organization?.name || "company");

  // ✅ Step 2: Insert into organizations table
  const [orgResult] = await db.execute(
    'INSERT INTO organizations (name, domain, subdomain, is_active) VALUES (?, ?, ?, ?)',
    [organization.name, organization.domain, subdomain, false]
  );

  const orgId = orgResult.insertId;

  // ✅ Step 3: Create user with organization_id
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const userId = await insertUser({
    email,
    password: hashedPassword,
    name,
    organizationId: orgId
  });

  return { success: true, userId };
}