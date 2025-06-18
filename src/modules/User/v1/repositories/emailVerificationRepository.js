import db from "../../../../common/configs/db.js";

export async function findUserByVerificationToken(token) {
  const [rows] = await db.query(
    `SELECT * FROM users WHERE email_verification_token = ? AND email_verified = false`,
    [token]
  );
  return rows[0];
}

export async function markUserEmailVerified(userId) {
  await db.query(
    `UPDATE users 
     SET email_verified = true,
         email_verification_token = NULL,
         email_verification_expires = NULL
     WHERE id = ?`,
    [userId]
  );
}
