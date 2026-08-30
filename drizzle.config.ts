import "dotenv/config";

import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit configuration.
 *
 * `DATABASE_URL` is read lazily by the CLI only; nothing here runs during
 * `next build` or when application modules are imported.
 */
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required to run drizzle-kit. Load your .env.local first, e.g. `set -a && . ./.env.local && set +a`.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  strict: true,
  verbose: true,
  dbCredentials: {
    url: databaseUrl,
    ssl: process.env.DATABASE_SSL === "require" ? { rejectUnauthorized: true } : false,
  },
});
