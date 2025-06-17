import BaseSeeder from './BaseSeeder.js';

class PermissionSeeder extends BaseSeeder {
  async run(connection) {
    const [resources] = await connection.execute('SELECT id, name FROM resources WHERE is_active = 1');
    const [actions] = await connection.execute('SELECT id, name FROM actions');
    
    for (const resource of resources) {
      for (const action of actions) {
        const permissionName = `${resource.name}_${action.name}`;
        const description = `${action.name} access for ${resource.name}`;
        const appliesTo = resource.name === 'organizations' ? 'platform' : 'both';
        
        await connection.execute(
          'INSERT IGNORE INTO permissions (resource_id, action_id, name, description, applies_to, is_system) VALUES (?, ?, ?, ?, ?, ?)',
          [resource.id, action.id, permissionName, description, appliesTo, 1]
        );
      }
    }
  }

  async clear(connection) {
    await connection.execute('DELETE FROM permissions');
  }
}

export default PermissionSeeder;
