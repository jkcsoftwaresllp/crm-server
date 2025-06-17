import db from '../../../../common/configs/db.js';

export const approveOrganizationById = async (req, res) => {
  const { orgId } = req.params;
  try {
    const [result] = await db.execute("UPDATE organizations SET is_active = true WHERE id = ?", [orgId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Organization not found" });
    }
    res.status(200).json({ message: "Organization approved successfully" });
  } catch (error) {
    console.error('Approval Error:', error);
    res.status(500).json({ error: 'Error approving organization.' });
  }
};


export const getPendingOrganizations = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT id, name, domain FROM organizations WHERE is_active = false");
    res.status(200).json({ pendingOrgs: rows });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching pending organizations.' });
  }
};