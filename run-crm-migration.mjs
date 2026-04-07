import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  let connection;
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('DATABASE_URL environment variable is not set');
      process.exit(1);
    }

    // Parse DATABASE_URL
    const url = new URL(databaseUrl);
    const config = {
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      port: url.port || 3306,
      waitForConnections: true,
      connectionLimit: 1,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: false,
      },
      enableKeepAlive: true,
    };

    console.log(`Connecting to database at ${config.host}:${config.port}/${config.database}...`);
    connection = await mysql.createConnection(config);

    // Read the migration file
    const migrationFile = path.join(__dirname, 'drizzle', '0001_crm_tables.sql');
    const migrationSql = fs.readFileSync(migrationFile, 'utf-8');

    // Split by statement-breakpoint and execute
    const statements = migrationSql.split('--> statement-breakpoint').filter(s => s.trim());

    console.log(`Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        try {
          console.log(`[${i + 1}/${statements.length}] Executing statement...`);
          await connection.execute(statement);
        } catch (error) {
          if (error.code === 'ER_TABLE_EXISTS_ERROR') {
            console.log(`[${i + 1}/${statements.length}] Table already exists, skipping...`);
          } else {
            console.error(`Error executing statement ${i + 1}:`, error.message);
            throw error;
          }
        }
      }
    }

    console.log('✅ Migration completed successfully!');
    await connection.end();
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
