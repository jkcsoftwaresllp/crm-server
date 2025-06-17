import SeederRunner from './SeederRunner.js';
import UserTypeSeeder from './UserTypeSeeder.js';
import OrganizationSeeder from './OrganizationSeeder.js';
import ResourceSeeder from './ResourceSeeder.js';
import ActionSeeder from './ActionSeeder.js';
import PermissionSeeder from './PermissionSeeder.js';
import RoleSeeder from './RoleSeeder.js';
import UserSeeder from './UserSeeder.js';
import RolePermissionSeeder from './RolePermissionSeeder.js';
import UserRoleSeeder from './UserRoleSeeder.js';

// Create seeder instances
const seeders = [
  new UserTypeSeeder(),
  new OrganizationSeeder(),
  new ResourceSeeder(),
  new ActionSeeder(),
  new PermissionSeeder(),
  new RoleSeeder(),
  new UserSeeder(),
  new RolePermissionSeeder(),
  new UserRoleSeeder()
];

const seederRunner = new SeederRunner(seeders);

// Run seeder if called directly
if (process.argv[1].includes('masterSeeders.js')) {
  if (process.argv.includes('--clear')) {
    seederRunner.clear()
      .then(() => process.exit(0))
      .catch(console.error);
  } else {
    seederRunner.run()
      .then(() => {
        // Display credentials after successful seeding
        const userSeeder = seeders.find(s => s instanceof UserSeeder);
        if (userSeeder) {
          userSeeder.displayCredentials();
        }
        process.exit(0);
      })
      .catch(console.error);
  }
}

export { seederRunner, seeders };
