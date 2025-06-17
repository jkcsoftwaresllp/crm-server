import BaseSeeder from './BaseSeeder.js';

class ResourceSeeder extends BaseSeeder {
  async run(connection) {
    const resources = [
      ['users', 'User management and administration'],
      ['organizations', 'Organization management and settings'],
      ['customers', 'Customer relationship management'],
      ['support_tickets', 'Support ticket management and tracking']
    ];
    
    for (const [name, description] of resources) {
      await connection.execute(
        'INSERT IGNORE INTO resources (name, description, is_active) VALUES (?, ?, ?)',
        [name, description, 1]
      );
    }
  }

  async clear(connection) {
    await connection.execute('DELETE FROM resources');
  }
}

export default ResourceSeeder;
