import db from '../../../../common/configs/db.js';

export const createUser = async (userData) => {
  const {
    name,
    email,
    password,
    user_type_id,
    organization_id,
    is_active = false,
    email_verification_token = null
  } = userData;

  const [result] = await db.execute(
    `INSERT INTO users 
     (name, email, password, user_type_id, organization_id, is_active, email_verification_token)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, password, user_type_id, organization_id, is_active, email_verification_token]
  );

  return result.insertId;
};