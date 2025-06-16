import db from '../../../../common/configs/db.js';

export async function findByEmail(email) {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0]; // or undefined if not found
}

export async function insertUser({ email, password, name }) {
  const [result] = await db.query(
    'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
    [email, password, name]
  );
  return result.insertId;
}

export async function updateRefreshToken(userId, token) {
  await db.query('UPDATE users SET refresh_token = ? WHERE id = ?', [token, userId]);
}

export async function getRefreshToken(userId) {
  const [rows] = await db.query('SELECT refresh_token FROM users WHERE id = ?', [userId]);
  return rows[0]?.refresh_token;
}
