import bcrypt from 'bcrypt';
import BaseSeeder from './BaseSeeder.js';

class UserSeeder extends BaseSeeder {
  async run(connection) {
    const users = [
      ['platform.admin@crm.com', 'PlatformAdmin123!', 'Platform Administrator', 1, null, 'System Admin', 'IT', 1, 1],
      ['admin@techstartup.com', 'OrgAdmin123!', 'John Smith', 2, 1, 'CEO', 'Executive', 1, 1],
      ['member@smallbiz.com', 'Member123!', 'Jane Doe', 2, 2, 'Sales Manager', 'Sales', 1, 1],
      ['viewer@enterprise.com', 'Viewer123!', 'Bob Wilson', 2, 3, 'Support Agent', 'Customer Service', 1, 1]
    ];
    
    for (const [email, password, name, userTypeId, orgId, jobTitle, department, isActive, emailVerified] of users) {
      const hashedPassword = await bcrypt.hash(password, 12);
      await connection.execute(
        'INSERT IGNORE INTO users (email, password, name, user_type_id, organization_id, job_title, department, is_active, email_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [email, hashedPassword, name, userTypeId, orgId, jobTitle, department, isActive, emailVerified]
      );
    }
  }

  async clear(connection) {
    await connection.execute('DELETE FROM users');
  }

  displayCredentials() {
    console.log('\n🔐 TEST CREDENTIALS:');
    console.log('==========================================');
    console.log('Platform Admin:');
    console.log('  Email: platform.admin@crm.com');
    console.log('  Password: PlatformAdmin123!');
    console.log('  Access: Full system access');
    console.log('');
    console.log('Organization Admin (Tech Startup Inc):');
    console.log('  Email: admin@techstartup.com');
    console.log('  Password: OrgAdmin123!');
    console.log('  Access: Full organization management');
    console.log('');
    console.log('Organization Member (Small Business LLC):');
    console.log('  Email: member@smallbiz.com');
    console.log('  Password: Member123!');
    console.log('  Access: Customer and ticket management');
    console.log('');
    console.log('Organization Viewer (Enterprise Corp):');
    console.log('  Email: viewer@enterprise.com');
    console.log('  Password: Viewer123!');
    console.log('  Access: Read-only access');
    console.log('==========================================\n');
  }
}

export default UserSeeder;
