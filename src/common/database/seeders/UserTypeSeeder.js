import BaseSeeder from './BaseSeeder.js';

class UserTypeSeeder extends BaseSeeder {
  async run(connection) {
    const userTypes = [
      ['platform_user', 'Platform administrator with system-wide access'],
      ['organization_user', 'Organization member with limited access']
    ];
    
    for (const [name, description] of userTypes) {
      await connection.execute(
        'INSERT IGNORE INTO user_types (name, description) VALUES (?, ?)',
        [name, description]
      );
    }
  }

  async clear(connection) {
    await connection.execute('DELETE FROM user_types');
  }
}

export default UserTypeSeeder;
