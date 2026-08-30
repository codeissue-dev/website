/**
 * Applies the committed SQL migrations in `drizzle/` to the configured database.
 *
 * Run with `pnpm db:migrate`. Nothing in the application imports this file, so
 * importing an application module never triggers a migration.
 *
 * Each file is applied once, inside a transaction, and recorded with a checksum
 * in `codeissue_migrations`. A file that changed after being applied stops the
 * run instead of silently drifting from the database.
 */
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { closeDb, getPool } from "../src/lib/db/client";

const MIGRATIONS_DIR = path.join(process.cwd(), "drizzle");

/** Separator written by drizzle-kit between statements of one migration. */
const STATEMENT_BREAKPOINT = "--> statement-breakpoint";

const CREATE_TRACKING_TABLE = `
  CREATE TABLE IF NOT EXISTS "codeissue_migrations" (
    "name" text PRIMARY KEY,
    "checksum" text NOT NULL,
    "applied_at" timestamp with time zone NOT NULL DEFAULT now()
  )
`;

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function splitStatements(sql: string): string[] {
  return sql
    .split(STATEMENT_BREAKPOINT)
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0);
}

async function main(): Promise<void> {
  const entries = await readdir(MIGRATIONS_DIR);
  const files = entries.filter((name) => name.endsWith(".sql")).sort();

  if (files.length === 0) {
    console.info(`No .sql migrations found in ${MIGRATIONS_DIR}.`);
    return;
  }

  const client = await getPool().connect();
  try {
    await client.query(CREATE_TRACKING_TABLE);

    const previous = await client.query<{ name: string; checksum: string }>(
      'SELECT "name", "checksum" FROM "codeissue_migrations"',
    );
    const appliedChecksums = new Map(
      previous.rows.map((row) => [row.name, row.checksum] as const),
    );

    let appliedCount = 0;

    for (const file of files) {
      const sql = await readFile(path.join(MIGRATIONS_DIR, file), "utf8");
      const checksum = createHash("sha256").update(sql).digest("hex");
      const knownChecksum = appliedChecksums.get(file);

      if (knownChecksum !== undefined) {
        if (knownChecksum !== checksum) {
          throw new Error(
            `${file} was already applied but its contents changed. Add a new migration instead of editing an applied one.`,
          );
        }
        continue;
      }

      const statements = splitStatements(sql);
      await client.query("BEGIN");
      try {
        for (const statement of statements) {
          await client.query(statement);
        }
        await client.query(
          'INSERT INTO "codeissue_migrations" ("name", "checksum") VALUES ($1, $2)',
          [file, checksum],
        );
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw new Error(`${file} failed: ${errorMessage(error)}`);
      }

      appliedCount += 1;
      console.info(`Applied ${file} (${statements.length} statements).`);
    }

    console.info(
      appliedCount === 0
        ? `Database is up to date (${files.length} migrations already applied).`
        : `Applied ${appliedCount} of ${files.length} migrations.`,
    );
  } finally {
    client.release();
    await closeDb();
  }
}

main().catch((error: unknown) => {
  console.error(`Migration failed: ${errorMessage(error)}`);
  process.exitCode = 1;
});
