import db from '../../../../common/configs/db.js';

export const getPendingOrgs = async () => {
  const [rows] = await db.execute('SELECT * FROM organizations WHERE is_active = false');
  return rows;
};

export const approveOrg = async (orgId) => {
  const [result] = await db.execute('UPDATE organizations SET is_active = true WHERE id = ?', [orgId]);
  return result;
};