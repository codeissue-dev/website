import '@/lib/env/load-local-env';

import { spawn } from 'node:child_process';

function sqlIdentifier(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function sqlLiteral(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) throw new Error('DATABASE_URL is required.');

const parsed = new URL(databaseUrl);
const user = process.env.POSTGRES_USER ?? decodeURIComponent(parsed.username);
const password =
  process.env.POSTGRES_PASSWORD ?? decodeURIComponent(parsed.password);
const database =
  (process.env.POSTGRES_DB ?? parsed.pathname.replace(/^\//, '')) || 'postgres';

if (!user || !password || !database) {
  throw new Error(
    'POSTGRES_USER, POSTGRES_PASSWORD, and POSTGRES_DB must be configured.',
  );
}

const child = spawn(
  'docker',
  [
    'compose',
    'exec',
    '-T',
    'postgres',
    'psql',
    '-v',
    'ON_ERROR_STOP=1',
    '-U',
    user,
    '-d',
    database,
  ],
  { stdio: ['pipe', 'inherit', 'inherit'] },
);

child.stdin.end(
  `ALTER ROLE ${sqlIdentifier(user)} WITH PASSWORD ${sqlLiteral(password)};
`,
);

child.on('error', (error) => {
  console.error(`Could not run Docker Compose: ${error.message}`);
  process.exitCode = 1;
});

child.on('exit', (code) => {
  if (code === 0) {
    console.log('PostgreSQL role password now matches .env.');
    return;
  }

  console.error(
    'Password synchronization failed. Is the postgres service running?',
  );
  process.exitCode = code ?? 1;
});
