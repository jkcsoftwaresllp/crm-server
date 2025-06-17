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
<<<<<<< HEAD
=======
}

export async function login(email, password) {
  const user = await findByEmail(email);
  if (!user) {
    return { success: false, message: 'Invalid email or password' };
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return { success: false, message: 'Invalid email or password' };
  }

  const payload = { id: user.id, email: user.email };
  const accessToken = jwt.sign(payload, accessSecret, { expiresIn: accessExpiry });
  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: refreshExpiry });

  await updateRefreshToken(user.id, refreshToken);

  return {
    success: true,
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name }
  };
}

export async function refresh(refreshToken) {
  if (!refreshToken) {
    return { success: false, message: 'Refresh token missing' };
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshSecret);

    const storedToken = await getRefreshToken(decoded.id);
    if (!storedToken || storedToken !== refreshToken) {
      return { success: false, message: 'Invalid refresh token' };
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      accessSecret,
      { expiresIn: accessExpiry }
    );

    return { success: true, accessToken: newAccessToken };
  } catch (err) {
    return { success: false, message: 'Invalid or expired refresh token' };
  }
>>>>>>> b59c22acd91338fa980fc476b00cf542e2544736
}