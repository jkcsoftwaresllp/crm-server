import BaseSeeder from './BaseSeeder.js';

class RoleSeeder extends BaseSeeder {
  async run(connection) {
    // Get user type IDs
    const [userTypes] = await connection.execute('SELECT id, name FROM user_types');
    const userTypeMap = {};
    userTypes.forEach(ut => {
      userTypeMap[ut.name] = ut.id;
    });
    
    const roles = [
      ['platform_admin', 'Platform Administrator with full system access', '#DC2626', null, userTypeMap['platform_user'], 1, 1],
      ['organization_admin', 'Organization Administrator with full org access', '#059669', null, userTypeMap['organization_user'], 1, 1],
      ['organization_member', 'Organization Member with limited access', '#2563EB', null, userTypeMap['organization_user'], 1, 1],
      ['organization_viewer', 'Organization Viewer with read-only access', '#7C3AED', null, userTypeMap['organization_user'], 1, 1]
    ];
    
    for (const [name, description, color, orgId, userTypeId, isSystem, isActive] of roles) {
      await connection.execute(
        'INSERT IGNORE INTO roles (name, description, color, organization_id, user_type_id, is_system_role, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, description, color, orgId, userTypeId, isSystem, isActive]
      );
    }
  }

  async clear(connection) {
    await connection.execute('DELETE FROM roles');
  }
}

export default RoleSeeder;
