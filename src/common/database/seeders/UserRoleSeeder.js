import BaseSeeder from './BaseSeeder.js';

class UserRoleSeeder extends BaseSeeder {
  async run(connection) {
    const assignments = [
      ['platform.admin@crm.com', 'platform_admin'],
      ['admin@techstartup.com', 'organization_admin'],
      ['member@smallbiz.com', 'organization_member'],
      ['viewer@enterprise.com', 'organization_viewer']
    ];
    
    for (const [email, roleName] of assignments) {
      const [user] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
      const [role] = await connection.execute('SELECT id FROM roles WHERE name = ?', [roleName]);
      
      if (user.length > 0 && role.length > 0) {
        await connection.execute(
          'INSERT IGNORE INTO user_roles (user_id, role_id, is_active) VALUES (?, ?, ?)',
          [user[0].id, role[0].id, 1]
        );
      }
    }
  }

  async clear(connection) {
    await connection.execute('DELETE FROM user_roles');
  }
}

export default UserRoleSeeder;
