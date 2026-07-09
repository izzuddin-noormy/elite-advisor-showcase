/**
 * Runs a SQL migration file against the database.
 * Usage: PGURL="postgres://...:5432/postgres" node scripts/run-migration.mjs supabase/migrations/xxx.sql
 */
import fs from 'node:fs';
import pg from 'pg';

const file = process.argv[2];
if (!file) { console.error('Usage: node scripts/run-migration.mjs <path-to-sql>'); process.exit(1); }
if (!process.env.PGURL) { console.error('Missing PGURL'); process.exit(1); }

const sql = fs.readFileSync(file, 'utf8');
const client = new pg.Client({ connectionString: process.env.PGURL, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 15000 });

(async () => {
  try {
    await client.connect();
    await client.query(sql);
    console.log('MIGRATION_OK:', file);
    await client.end();
  } catch (e) {
    console.error('MIGRATION_ERR:', e.message);
    process.exit(1);
  }
})();
