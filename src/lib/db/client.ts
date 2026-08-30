import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { getServerEnv } from "@/lib/env";
import { describeError, logger } from "@/lib/logger";
import * as schema from "@/lib/db/schema";

export type Database = NodePgDatabase<typeof schema>;

type DatabaseSingleton = {
  pool: Pool;
  db: Database;
};

declare global {
  /**
   * Cached across module re-evaluation (Next.js HMR, route isolation) so a dev
   * server does not leak one Postgres pool per edit.
   */
  var __codeissueDatabase: DatabaseSingleton | undefined;
}

function createDatabaseSingleton(): DatabaseSingleton {
  const env = getServerEnv();

  // `new Pool()` does not open a connection: node-postgres connects lazily on
  // the first query. Nothing here runs at import time.
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: env.DATABASE_POOL_MAX,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    // Serverless instances are frozen between requests; releasing idle sockets
    // keeps the Postgres connection count bounded.
    allowExitOnIdle: true,
    ...(env.DATABASE_SSL === "require" ? { ssl: { rejectUnauthorized: true } } : {}),
  });

  pool.on("error", (error) => {
    // Idle client errors are emitted on the pool; swallowing them would hide
    // real connectivity problems, throwing here would crash the runtime.
    logger.error("postgres pool error", describeError(error));
  });

  return { pool, db: drizzle({ client: pool, schema }) };
}

function getDatabaseSingleton(): DatabaseSingleton {
  globalThis.__codeissueDatabase ??= createDatabaseSingleton();
  return globalThis.__codeissueDatabase;
}

/**
 * The canonical, lazy database accessor. Every application query, every
 * Auth.js adapter call and every script goes through this function, so there is
 * exactly one Drizzle client and one pool per runtime instance.
 */
export function getDb(): Database {
  return getDatabaseSingleton().db;
}

/**
 * The pool behind `getDb()`. Needed for operations that require a raw client
 * (for example `LISTEN`, which must own a dedicated connection).
 */
export function getPool(): Pool {
  return getDatabaseSingleton().pool;
}

/** Closes the pool. Used by CLI scripts and the standalone realtime gateway. */
export async function closeDb(): Promise<void> {
  const existing = globalThis.__codeissueDatabase;
  if (!existing) return;
  globalThis.__codeissueDatabase = undefined;
  await existing.pool.end();
}
