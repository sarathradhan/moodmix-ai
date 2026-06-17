import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './env.js';
import logger from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {pg.Pool | null} */
let pool = null;

export function getPool() {
  if (!pool) throw new Error('Database pool not initialized');
  return pool;
}

export function isDatabaseConnected() {
  return pool !== null;
}

async function needsAuthMigration(client) {
  const { rows } = await client.query(
    `SELECT column_name FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password_hash'`
  );
  return rows.length === 0;
}

/** PostgreSQL connection — schema + one-time auth migration */
export async function connectDatabase() {
  if (pool) return;

  pool = new pg.Pool({
    connectionString: env.DATABASE_URL,
    connectionTimeoutMillis: 3000,
  });

  try {
    const client = await pool.connect();

    if (await needsAuthMigration(client)) {
      const migratePath = path.join(__dirname, '../db/migrate-auth.sql');
      const migrate = fs.readFileSync(migratePath, 'utf8');
      await client.query(migrate);
      logger.info('Applied auth migration (session-based users)');
    } else {
      const schemaPath = path.join(__dirname, '../db/schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schema);
    }

    client.release();
    logger.info('PostgreSQL connected');
  } catch (err) {
    await pool.end().catch(() => {});
    pool = null;
    logger.warn('PostgreSQL unavailable — auth and history will not work until connected');
    if (env.NODE_ENV === 'production') throw err;
  }
}
