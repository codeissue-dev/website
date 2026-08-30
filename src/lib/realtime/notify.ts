import { sql, type SQL } from "drizzle-orm";

import {
  MAX_NOTIFY_PAYLOAD_BYTES,
  REALTIME_CHANNEL,
  type OrderNotification,
} from "@/lib/realtime/events";

/**
 * Anything that can run SQL: the Drizzle database instance from `getDb()` or a
 * transaction handle. Declared structurally so this module never creates a
 * second client.
 */
export type SqlRunner = {
  execute: (query: SQL) => Promise<unknown>;
};

/**
 * Publishes a fan-out signal.
 *
 * Called *inside* the same transaction that persisted the row, so the signal is
 * delivered by Postgres only if the write committed. Never used as storage.
 */
export async function publishOrderNotification(
  runner: SqlRunner,
  notification: OrderNotification,
): Promise<void> {
  const payload = JSON.stringify(notification);
  if (Buffer.byteLength(payload, "utf8") > MAX_NOTIFY_PAYLOAD_BYTES) {
    throw new Error("Realtime notification payload exceeds the Postgres limit");
  }
  await runner.execute(sql`select pg_notify(${REALTIME_CHANNEL}, ${payload})`);
}
