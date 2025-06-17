import db from '../../configs/db.js';

class SeederRunner {
  constructor(seeders = []) {
    this.seeders = seeders;
    this.connection = null;
  }

  addSeeder(seeder) {
    this.seeders.push(seeder);
    return this;
  }

  async run() {
    console.log('🌱 Starting database seeding...');
    
    try {
      this.connection = await db.getConnection();
      await this.connection.query('START TRANSACTION');
      
      for (const seeder of this.seeders) {
        console.log(`📦 Running ${seeder.getName()}...`);
        await seeder.run(this.connection);
      }
      
      await this.connection.query('COMMIT');
      console.log('✅ Database seeding completed successfully!');
      
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

  async clear() {
    console.log('🔄 Clearing seeded data...');
    
    try {
      this.connection = await db.getConnection();
      await this.connection.query('SET FOREIGN_KEY_CHECKS = 0');
      
      // Run clearers in reverse order
      for (let i = this.seeders.length - 1; i >= 0; i--) {
        const seeder = this.seeders[i];
        console.log(`🗑️ Clearing ${seeder.getName()}...`);
        await seeder.clear(this.connection);
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

export default SeederRunner;
