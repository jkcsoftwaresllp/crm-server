import BaseSeeder from './BaseSeeder.js';

class ActionSeeder extends BaseSeeder {
  async run(connection) {
    const actions = [
      ['create', 'Create new records'],
      ['read', 'View and read records'],
      ['update', 'Modify existing records'], 
      ['delete', 'Remove records'],
      ['export', 'Export data to external formats']
    ];
    
    for (const [name, description] of actions) {
      await connection.execute(
        'INSERT IGNORE INTO actions (name, description) VALUES (?, ?)',
        [name, description]
      );
    }
  }

  async clear(connection) {
    await connection.execute('DELETE FROM actions');
  }
}

export default ActionSeeder;
