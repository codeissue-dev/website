import "dotenv/config";

import { z } from "zod";

/**
 * Server environment.
 *
 * Parsing is lazy and cached: importing this module never touches the network,
 * never connects to Postgres and never throws during `next build`. The first
 * request (or CLI script) that actually needs a value validates the process
 * environment once.
 */
const serverEnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .refine(
      (value) => value.startsWith("postgres://") || value.startsWith("postgresql://"),
      "DATABASE_URL must be a postgres:// or postgresql:// connection string",
    ),
  DATABASE_SSL: z.enum(["require", "disable"]).default("disable"),
  DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(50).default(3),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters long"),
  REALTIME_PORT: z.coerce.number().int().min(1).max(65535).default(8787),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedServerEnv: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) return cachedServerEnv;

  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    // Names only, never values: this message can reach server logs.
    throw new Error(`Invalid server environment (${details})`);
  }

  cachedServerEnv = parsed.data;
  return cachedServerEnv;
}

/**
 * Canonical public origin used for metadata, sitemap and robots.
 * Falls back to the Vercel-provided production URL, then to localhost.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return stripTrailingSlash(explicit);

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProduction) return stripTrailingSlash("https://" + vercelProduction);

  return "http://localhost:3000";
}

/** Optional path to a custom logo inside `public/`. Empty means text wordmark. */
export function getBrandLogoPath(): string | null {
  const configured = process.env.NEXT_PUBLIC_BRAND_LOGO_PATH?.trim();
  if (!configured) return null;
  return configured.startsWith("/") ? configured : `/${configured}`;
}

function stripTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}
