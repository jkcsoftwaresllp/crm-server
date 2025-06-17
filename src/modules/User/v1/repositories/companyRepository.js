import db from '../../../../common/configs/db.js';

/* ----------  ORGANIZATION  ---------- */
export const insertOrganization = async (conn, {
  name,
  domain,
  subdomain,
  timezone,
  logo_url,
  settings = {}
}) => {
  const [res] = await conn.query(
    `INSERT INTO organizations
       (name, domain, subdomain, timezone, logo_url, settings)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      name,
      domain || null,
      subdomain,
      timezone || 'UTC',
      logo_url || null,
      JSON.stringify(settings) || null
    ]
  );
  return res.insertId;              // org_id
};

/* ----------  USER (ADMIN)  ---------- */
export const insertUser = async (conn, {
  email,
  password,
  name,
  job_title,
  user_type_id,
  organization_id,
  email_verification_token,
  email_verification_expires
}) => {
  const [res] = await conn.query(
    `INSERT INTO users
       (email, password, name, job_title,
        user_type_id, organization_id,
        email_verification_token, email_verification_expires,
        created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      email,
      password,
      name,
      job_title || 'Owner',
      user_type_id,
      organization_id,
      email_verification_token,
      email_verification_expires
    ]
  );
  return res.insertId;              // user_id
};

/* ----------  ROLES  ---------- */
export const getRoleIdByName = async (conn, { organization_id, role_name }) => {
  const [rows] = await conn.query(
    `SELECT id FROM roles
      WHERE organization_id = ? AND name = ? LIMIT 1`,
    [organization_id, role_name]
  );
  return rows.length ? rows[0].id : null;
};

export const insertRole = async (conn, {
  organization_id,
  role_name,
  description = 'Auto‑created'
}) => {
  const [res] = await conn.query(
    `INSERT INTO roles
       (organization_id, name, description)
     VALUES (?, ?, ?)`,
    [organization_id, role_name, description]
  );
  return res.insertId;              // role_id
};

export const linkUserRole = async (conn, { user_id, role_id }) => {
  await conn.query(
    `INSERT INTO user_roles (user_id, role_id)
     VALUES (?, ?)`,
    [user_id, role_id]
  );
};
