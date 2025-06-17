import db from '../../../../common/configs/db.js';

export const insertCom = async (comData) => {
  const {
    name,
    domain,
    subdomain,
    logo_url,
    email,
    phone,
    is_active = false
  } = comData;

  const [result] = await db.execute(
    `INSERT INTO organizations 
     (name, domain, subdomain, logo_url, email, phone, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, domain, subdomain, logo_url, email, phone, is_active]
  );

  return result.insertId;
};