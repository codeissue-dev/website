import { describeError, logger } from "@/lib/logger";

/**
 * Reads that a public page can survive without.
 *
 * The marketing pages are rendered on every request against live PostgreSQL.
 * If the database is briefly unreachable, the visitor should still get the
 * page (with the database-backed sections empty) instead of a 500, so these
 * reads resolve to a fallback and log loudly on the server.
 */
export async function readWithFallback<T>(
  label: string,
  read: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await read();
  } catch (error) {
    logger.error(`public read failed: ${label}`, describeError(error));
    return fallback;
  }
}
