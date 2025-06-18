import db from '../../config/db.js';

const auditLogger = async (
  action,
  userId,
  resourceType,
  resourceId,
  changes = {},
  meta = {}
) => {
  const { oldData = null, newData = null } = changes;
  const { ipAddress = null, userAgent = null } = meta;

  const query = `
    INSERT INTO activity_logs 
    (action, user_id, resource_type, resource_id, old_value, new_value, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    action,
    userId,
    resourceType,
    resourceId,
    oldData ? JSON.stringify(oldData) : null,
    newData ? JSON.stringify(newData) : null,
    ipAddress,
    userAgent
  ];

  try {
    await db.execute(query, values);
  } catch (error) {
    console.error('Audit Log Error:', error.message);
  }
};

export default auditLogger;
