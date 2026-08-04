import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema';

const globalForDatabase = globalThis as unknown as {
  codeissuePool?: Pool;
};

const pool =
  globalForDatabase.codeissuePool ??
  new Pool({
    connectionString:
      process.env.DATABASE_URL ??
      'postgresql://codeissue:codeissue@localhost:5432/codeissue',
    max: process.env.NODE_ENV === 'production' ? 10 : 4,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDatabase.codeissuePool = pool;
}

export const db = drizzle({ client: pool, schema });
export { pool };
