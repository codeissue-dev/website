import '@/lib/env/load-local-env';

import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  console.error('DATABASE_URL is missing. Copy .env.example to .env.');
  process.exit(1);
}

function decode(value: string | null) {
  return value ? decodeURIComponent(value) : '';
}

function errorCode(error: unknown) {
  return error && typeof error === 'object' && 'code' in error
    ? String(error.code)
    : '';
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

let parsed: URL;
try {
  parsed = new URL(databaseUrl);
} catch {
  console.error('DATABASE_URL is not a valid PostgreSQL URL.');
  process.exit(1);
}

const urlUser = decode(parsed.username);
const urlPassword = decode(parsed.password);
const urlDatabase = parsed.pathname.replace(/^\//, '');
const urlPort = parsed.port || '5432';
const warnings: string[] = [];

if (process.env.POSTGRES_USER && process.env.POSTGRES_USER !== urlUser) {
  warnings.push('POSTGRES_USER does not match DATABASE_URL.');
}
if (
  process.env.POSTGRES_PASSWORD &&
  process.env.POSTGRES_PASSWORD !== urlPassword
) {
  warnings.push('POSTGRES_PASSWORD does not match DATABASE_URL.');
}
if (process.env.POSTGRES_DB && process.env.POSTGRES_DB !== urlDatabase) {
  warnings.push('POSTGRES_DB does not match DATABASE_URL.');
}
if (process.env.POSTGRES_PORT && process.env.POSTGRES_PORT !== urlPort) {
  warnings.push('POSTGRES_PORT does not match DATABASE_URL.');
}

for (const warning of warnings) console.warn(`Warning: ${warning}`);

const pool = new Pool({
  connectionString: databaseUrl,
  max: 1,
  connectionTimeoutMillis: 4_000,
});

try {
  const connection = await pool.query<{
    current_database: string;
    current_user: string;
    server_version: string;
  }>(
    "select current_database(), current_user, current_setting('server_version') as server_version",
  );
  const current = connection.rows[0];

  console.log(
    `Connected to PostgreSQL ${current?.server_version ?? 'unknown'} as ${current?.current_user ?? 'unknown'} on ${parsed.hostname}:${urlPort}/${current?.current_database ?? urlDatabase}.`,
  );

  const relation = await pool.query<{ workspaces: string | null }>(
    "select to_regclass('public.workspaces')::text as workspaces",
  );

  if (!relation.rows[0]?.workspaces) {
    console.warn(
      'Database is reachable, but migrations have not been applied.',
    );
    console.warn('Run: npm run db:migrate');
    process.exitCode = 1;
  } else {
    const workspace = await pool.query<{ count: string }>(
      "select count(*)::text as count from workspaces where slug = 'codeissue'",
    );
    if (workspace.rows[0]?.count === '0') {
      console.warn('Default workspace is missing. Run: npm run db:migrate');
    } else {
      console.log('Default workspace is initialized.');
    }
  }
} catch (error) {
  const code = errorCode(error);
  console.error(`Database connection failed: ${errorMessage(error)}`);

  if (code === '28P01') {
    console.error(
      'PostgreSQL rejected the password. Docker keeps the password from the first volume initialization.',
    );
    console.error('Run: npm run db:password:sync');
    console.error(
      'Or, if local data can be deleted: docker compose down -v && docker compose up -d postgres',
    );
  } else if (code === 'ECONNREFUSED') {
    console.error('Start PostgreSQL first: docker compose up -d postgres');
  }

  process.exitCode = 1;
} finally {
  await pool.end();
}
