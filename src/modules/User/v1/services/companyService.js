import db from '../../../../common/configs/db.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const generateToken = () => crypto.randomBytes(32).toString('hex');

export const registerCompanyWithAdmin = async (payload) => {
  const { organization, adminUser } = payload;
  if (!organization?.name || !adminUser?.email || !adminUser?.password || !adminUser?.name) {
    throw new Error('Required fields are missing');
  }

  const conn = await db.getConnection();
  await conn.beginTransaction();

  try {
    const [orgRes] = await conn.query(
      `INSERT INTO organizations
         (name, domain, subdomain, timezone, logo_url, settings)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        organization.name,
        organization.domain || null,
        organization.subdomain || organization.name.toLowerCase().replace(/\s+/g, ''),
        organization.timezone || 'UTC',
        organization.logo_url || null,
        organization.settings ? JSON.stringify(organization.settings) : null,
      ]
    );
    const orgId = orgRes.insertId;

    const hashedPassword = await bcrypt.hash(adminUser.password, 10);
    const token = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 19)
  .replace('T', ' ');


    const insertUserQuery = `
      INSERT INTO users (
        email,
        password,
        name,
        user_type_id,
        organization_id,
        job_title,
        email_verification_token,
        email_verification_expires,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const insertValues = [
      adminUser.email,
      hashedPassword,
      adminUser.name,
      2,     // <-- **Ensures user_type_id is included**
      orgId,
      adminUser.job_title || 'Owner',
      token,
      expires
    ];

   console.log('➡️ Running query:', insertUserQuery);
   console.log('➡️ With values:', insertValues);

   insertValues.forEach((val, i) => {
   console.log(`🔎 insertValues[${i}] | Type: ${typeof val} | Value:`, val);
   }); 


    const [usrRes] = await conn.query(insertUserQuery, insertValues);
    const userId = usrRes.insertId;

    const [roleRows] = await conn.query(
      `SELECT id FROM roles WHERE organization_id = ? AND name = 'organization_admin'`,
      [orgId]
    );

    let roleId = roleRows.length ? roleRows[0].id : (
      (await conn.query(
        `INSERT INTO roles (organization_id, name, description) VALUES (?, ?, ?)`,
        [orgId, 'organization_admin', 'Auto-created']
      ))[0].insertId
    );

    await conn.query(
      `INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`,
      [userId, roleId]
    );

    await conn.commit();
    return { organization_id: orgId, admin_user_id: userId, verification_token: token };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
