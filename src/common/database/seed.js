import bcrypt from 'bcrypt';
import db from '../configs/db.js';

class DatabaseSeeder {
  constructor() {
    this.connection = null;
  }

  async run() {
    console.log('🌱 Starting database seeding...');
    
    try {
      this.connection = await db.getConnection();
      await this.connection.query('START TRANSACTION');
      
      await this.seedUserTypes();
      await this.seedOrganizations();
      await this.seedResources();
      await this.seedActions();
      await this.seedPermissions();
      await this.seedRoles();
      await this.seedUsers();
      await this.seedRolePermissions();
      await this.seedUserRoles();
      
      await this.connection.query('COMMIT');
      console.log('✅ Database seeding completed successfully!');
      console.log('📖 Check credentials below for testing');
      this.displayCredentials();
      
    } catch (error) {
      if (this.connection) {
        await this.connection.query('ROLLBACK');
      }
      console.error('❌ Seeding failed:', error.message);
      throw error;
    } finally {
      if (this.connection) {
        this.connection.release();
      }
    }
  }

  async seedUserTypes() {
    console.log('📝 Seeding user types...');
    
    const userTypes = [
      ['platform_user', 'Platform administrator with system-wide access'],
      ['organization_user', 'Organization member with limited access']
    ];
    
    for (const [name, description] of userTypes) {
      await this.connection.execute(
        'INSERT IGNORE INTO user_types (name, description) VALUES (?, ?)',
        [name, description]
      );
    }
  }

  async seedOrganizations() {
    console.log('🏢 Seeding organizations...');
    
    const orgs = [
      ['Tech Startup Inc', 'premium', 'techstartup.com', 'techstartup'],
      ['Small Business LLC', 'basic', 'smallbiz.com', 'smallbiz'], 
      ['Enterprise Corp', 'enterprise', 'enterprise.com', 'enterprise']
    ];
    
    for (const [name, plan, domain, subdomain] of orgs) {
      await this.connection.execute(
        'INSERT IGNORE INTO organizations (name, subscription_plan, domain, subdomain, max_users, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [name, plan, domain, subdomain, plan === 'enterprise' ? 100 : (plan === 'premium' ? 50 : 10), 1]
      );
    }
  }

  async seedResources() {
    console.log('📋 Seeding resources...');
    
    const resources = [
      ['users', 'User management and administration'],
      ['organizations', 'Organization management and settings'],
      ['customers', 'Customer relationship management'],
      ['support_tickets', 'Support ticket management and tracking']
    ];
    
    for (const [name, description] of resources) {
      await this.connection.execute(
        'INSERT IGNORE INTO resources (name, description, is_active) VALUES (?, ?, ?)',
        [name, description, 1]
      );
    }
  }

  async seedActions() {
    console.log('⚡ Seeding actions...');
    
    const actions = [
      ['create', 'Create new records'],
      ['read', 'View and read records'],
      ['update', 'Modify existing records'], 
      ['delete', 'Remove records'],
      ['export', 'Export data to external formats']
    ];
    
    for (const [name, description] of actions) {
      await this.connection.execute(
        'INSERT IGNORE INTO actions (name, description) VALUES (?, ?)',
        [name, description]
      );
    }
  }

  async seedPermissions() {
    console.log('🔐 Seeding permissions...');
    
    const [resources] = await this.connection.execute('SELECT id, name FROM resources WHERE is_active = 1');
    const [actions] = await this.connection.execute('SELECT id, name FROM actions');
    
    for (const resource of resources) {
      for (const action of actions) {
        const permissionName = `${resource.name}_${action.name}`;
        const description = `${action.name} access for ${resource.name}`;
        const appliesTo = resource.name === 'organizations' ? 'platform' : 'both';
        
        await this.connection.execute(
          'INSERT IGNORE INTO permissions (resource_id, action_id, name, description, applies_to, is_system) VALUES (?, ?, ?, ?, ?, ?)',
          [resource.id, action.id, permissionName, description, appliesTo, 1]
        );
      }
    }
  }

  async seedRoles() {
    console.log('👑 Seeding roles...');
    
    // Get user type IDs
    const [userTypes] = await this.connection.execute('SELECT id, name FROM user_types');
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
      await this.connection.execute(
        'INSERT IGNORE INTO roles (name, description, color, organization_id, user_type_id, is_system_role, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, description, color, orgId, userTypeId, isSystem, isActive]
      );
    }
  }

  async seedUsers() {
    console.log('👥 Seeding users...');
    
    const users = [
      ['platform.admin@crm.com', 'PlatformAdmin123!', 'Platform Administrator', 1, null, 'System Admin', 'IT', 1, 1],
      ['admin@techstartup.com', 'OrgAdmin123!', 'John Smith', 2, 1, 'CEO', 'Executive', 1, 1],
      ['member@smallbiz.com', 'Member123!', 'Jane Doe', 2, 2, 'Sales Manager', 'Sales', 1, 1],
      ['viewer@enterprise.com', 'Viewer123!', 'Bob Wilson', 2, 3, 'Support Agent', 'Customer Service', 1, 1]
    ];
    
    for (const [email, password, name, userTypeId, orgId, jobTitle, department, isActive, emailVerified] of users) {
      const hashedPassword = await bcrypt.hash(password, 12);
      await this.connection.execute(
        'INSERT IGNORE INTO users (email, password, name, user_type_id, organization_id, job_title, department, is_active, email_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [email, hashedPassword, name, userTypeId, orgId, jobTitle, department, isActive, emailVerified]
      );
    }
  }

  async seedRolePermissions() {
    console.log('🔗 Seeding role permissions...');
    
    // Platform admin gets all permissions
    const [platformRole] = await this.connection.execute('SELECT id FROM roles WHERE name = ?', ['platform_admin']);
    const [allPermissions] = await this.connection.execute('SELECT id FROM permissions WHERE is_system = 1');
    
    if (platformRole.length > 0) {
      for (const permission of allPermissions) {
        await this.connection.execute(
          'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
          [platformRole[0].id, permission.id]
        );
      }
    }
    
    // Organization admin gets organization-specific permissions
    const [orgAdminRole] = await this.connection.execute('SELECT id FROM roles WHERE name = ?', ['organization_admin']);
    const [orgPermissions] = await this.connection.execute(
      'SELECT id FROM permissions WHERE applies_to IN ("organization", "both") AND name NOT LIKE "organizations_%"'
    );
    
    if (orgAdminRole.length > 0) {
      for (const permission of orgPermissions) {
        await this.connection.execute(
          'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
          [orgAdminRole[0].id, permission.id]
        );
      }
    }
    
    // Organization member gets limited permissions
    const [memberRole] = await this.connection.execute('SELECT id FROM roles WHERE name = ?', ['organization_member']);
    const [memberPermissions] = await this.connection.execute(
      'SELECT id FROM permissions WHERE name IN ("customers_create", "customers_read", "customers_update", "support_tickets_create", "support_tickets_read", "support_tickets_update")'
    );
    
    if (memberRole.length > 0) {
      for (const permission of memberPermissions) {
        await this.connection.execute(
          'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
          [memberRole[0].id, permission.id]
        );
      }
    }
    
    // Organization viewer gets read-only permissions
    const [viewerRole] = await this.connection.execute('SELECT id FROM roles WHERE name = ?', ['organization_viewer']);
    const [viewerPermissions] = await this.connection.execute(
      'SELECT id FROM permissions WHERE name IN ("customers_read", "support_tickets_read")'
    );
    
    if (viewerRole.length > 0) {
      for (const permission of viewerPermissions) {
        await this.connection.execute(
          'INSERT IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)',
          [viewerRole[0].id, permission.id]
        );
      }
    }
  }

  async seedUserRoles() {
    console.log('🎯 Assigning user roles...');
    
    const assignments = [
      ['platform.admin@crm.com', 'platform_admin'],
      ['admin@techstartup.com', 'organization_admin'],
      ['member@smallbiz.com', 'organization_member'],
      ['viewer@enterprise.com', 'organization_viewer']
    ];
    
    for (const [email, roleName] of assignments) {
      const [user] = await this.connection.execute('SELECT id FROM users WHERE email = ?', [email]);
      const [role] = await this.connection.execute('SELECT id FROM roles WHERE name = ?', [roleName]);
      
      if (user.length > 0 && role.length > 0) {
        await this.connection.execute(
          'INSERT IGNORE INTO user_roles (user_id, role_id, is_active) VALUES (?, ?, ?)',
          [user[0].id, role[0].id, 1]
        );
      }
    }
  }

  displayCredentials() {
    console.log('\n🔑 TEST CREDENTIALS:');
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

  async clear() {
    console.log('🔄 Clearing seeded data...');
    
    try {
      this.connection = await db.getConnection();
      
      const tables = [
        'user_roles', 'role_permissions', 'users', 'roles', 
        'permissions', 'actions', 'resources', 'organizations', 'user_types'
      ];
      
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 0');
      
      for (const table of tables) {
        await this.connection.execute(`DELETE FROM ${table}`);
        console.log(`↩️ Cleared ${table}`);
      }
      
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('✅ Data cleared successfully');
      
    } catch (error) {
      console.error('❌ Clear failed:', error.message);
      throw error;
    } finally {
      if (this.connection) {
        this.connection.release();
      }
    }
  }
}

// Run seeder if called directly
if (process.argv[1].includes('seed.js')) {
  const seeder = new DatabaseSeeder();
  
  if (process.argv.includes('--clear')) {
    seeder.clear().then(() => process.exit(0)).catch(console.error);
  } else {
    seeder.run().then(() => process.exit(0)).catch(console.error);
  }
}

export default DatabaseSeeder;
