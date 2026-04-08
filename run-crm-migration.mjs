import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.SUPABASE_DB_URL;

  if (!databaseUrl) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('Connecting to PostgreSQL database...');

  // Use max: 1 for migration runs; prepare: false for Supabase PgBouncer compatibility
  const sql = postgres(databaseUrl, { max: 1, prepare: false });
  const db = drizzle(sql);

  const migrationsFolder = path.join(__dirname, 'drizzle');

  try {
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder });
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigration();
