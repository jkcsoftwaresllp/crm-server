import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../configs/db.js';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await db.query(sql);
    console.log(`Executed migration: ${file}`);
  }

  console.log("\n🚀 All migrations completed.");
  console.log("ℹ️  Press Ctrl+C to exit.\n");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigrations().catch(err => {
    console.error('🔴 Migration failed:', err);
    process.exit(1);
  });
}

