import BaseSeeder from './BaseSeeder.js';

class OrganizationSeeder extends BaseSeeder {
  async run(connection) {
    const orgs = [
      ['Tech Startup Inc', 'premium', 'techstartup.com', 'techstartup'],
      ['Small Business LLC', 'basic', 'smallbiz.com', 'smallbiz'], 
      ['Enterprise Corp', 'enterprise', 'enterprise.com', 'enterprise']
    ];
    
    for (const [name, plan, domain, subdomain] of orgs) {
      await connection.execute(
        'INSERT IGNORE INTO organizations (name, subscription_plan, domain, subdomain, max_users, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [name, plan, domain, subdomain, plan === 'enterprise' ? 100 : (plan === 'premium' ? 50 : 10), 1]
      );
    }
  }

  async clear(connection) {
    await connection.execute('DELETE FROM organizations');
  }
}

export default OrganizationSeeder;
