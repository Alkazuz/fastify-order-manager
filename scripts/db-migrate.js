require('dotenv/config');

const { readFile } = require('node:fs/promises');
const path = require('node:path');
const { Pool } = require('pg');

function getConnectionString() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const user = process.env.POSTGRES_USER ?? 'postgres';
  const password = process.env.POSTGRES_PASSWORD ?? 'postgres';
  const host = process.env.POSTGRES_HOST ?? 'localhost';
  const port = process.env.POSTGRES_PORT ?? '5432';
  const db = process.env.POSTGRES_DB ?? 'order_manager';

  return `postgresql://${user}:${password}@${host}:${port}/${db}`;
}

async function main() {
  const sqlPath = path.resolve(
    process.cwd(),
    'database',
    'init',
    '001_create_tables.sql',
  );

  const pool = new Pool({ connectionString: getConnectionString() });

  try {
    const sql = await readFile(sqlPath, 'utf8');
    await pool.query(sql);
    console.log(`[db:migrate] Schema aplicado com sucesso: ${sqlPath}`);
  } catch (error) {
    console.error('[db:migrate] Falha ao aplicar schema.');
    console.error(error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

void main();
