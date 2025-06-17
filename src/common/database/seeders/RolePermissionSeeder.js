import BaseSeeder from './BaseSeeder.js';

class RolePermissionSeeder extends BaseSeeder {
  async run(connection) {
    // Platform admin gets all permissions
    const [platformRole] = await connection.execute('SELECT id FROM roles WHERE name = ?', ['platform_admin']);
    const [allPermissions] = await connection.execute('SELECT id FROM permissions WHERE is_system = 1');
    
    if (platformRole.length > 0) {
      for (const permission of allPermissions) {
        await connection.execute(
          'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
          [platformRole[0].id, permission.id]
        );
      }
    }
    
    // Organization admin gets organization-specific permissions
    const [orgAdminRole] = await connection.execute('SELECT id FROM roles WHERE name = ?', ['organization_admin']);
    const [orgPermissions] = await connection.execute(
      'SELECT id FROM permissions WHERE applies_to IN ("organization", "both") AND name NOT LIKE "organizations_%"'
    );
    
    if (orgAdminRole.length > 0) {
      for (const permission of orgPermissions) {
        await connection.execute(
          'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
          [orgAdminRole[0].id, permission.id]
        );
      }
    }
    
    // Organization member gets limited permissions
    const [memberRole] = await connection.execute('SELECT id FROM roles WHERE name = ?', ['organization_member']);
    const [memberPermissions] = await connection.execute(
      'SELECT id FROM permissions WHERE name IN ("customers_create", "customers_read", "customers_update", "support_tickets_create", "support_tickets_read", "support_tickets_update")'
    );
    
    if (memberRole.length > 0) {
      for (const permission of memberPermissions) {
        await connection.execute(
          'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
          [memberRole[0].id, permission.id]
        );
      }
    }
    
    // Organization viewer gets read-only permissions
    const [viewerRole] = await connection.execute('SELECT id FROM roles WHERE name = ?', ['organization_viewer']);
    const [viewerPermissions] = await connection.execute(
      'SELECT id FROM permissions WHERE name IN ("customers_read", "support_tickets_read")'
    );
    
    if (viewerRole.length > 0) {
      for (const permission of viewerPermissions) {
        await connection.execute(
          'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
          [viewerRole[0].id, permission.id]
        );
      }
    }
  }

  async clear(connection) {
    await connection.execute('DELETE FROM role_permissions');
  }
}

export default RolePermissionSeeder;
