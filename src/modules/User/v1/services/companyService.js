import db from '../../../../common/configs/db.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {
  insertOrganization,
  insertUser,
  getRoleIdByName,
  insertRole,
  linkUserRole
} from '../repositories/companyRepository.js';

const generateToken = () => crypto.randomBytes(32).toString('hex');

export const registerCompanyWithAdmin = async (payload) => {
  const { organization, adminUser } = payload;

  /* Basic validation (keep it here or shift to a validator) */
  if (!organization?.name || !adminUser?.email || !adminUser?.password || !adminUser?.name) {
    throw new Error('Required fields are missing');
  }

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    
    const orgId = await insertOrganization(conn, {
      ...organization,
      subdomain: organization.subdomain
        || organization.name.toLowerCase().replace(/\s+/g, '')
    });

    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    const token = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 h
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    const userId = await insertUser(conn, {
      email: adminUser.email,
      password: hashedPassword,
      name: adminUser.name,
      job_title: adminUser.job_title,
      user_type_id: 2,                        // or 'organization_user'
      organization_id: orgId,
      email_verification_token: token,
      email_verification_expires: expires
    });

    let roleId = await getRoleIdByName(conn, {
      organization_id: orgId,
      role_name: 'organization_admin'
    });

    if (!roleId) {
      roleId = await insertRole(conn, {
        organization_id: orgId,
        role_name: 'organization_admin'
      });
    }

    await linkUserRole(conn, { user_id: userId, role_id: roleId });

    await conn.commit();

    return {
      organization_id: orgId,
      admin_user_id: userId,
      verification_token: token
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
