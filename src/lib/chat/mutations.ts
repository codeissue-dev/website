import { eq, sql } from "drizzle-orm";

import type { ActorLike } from "@/lib/auth/rbac";
import { resolveOrderRole } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { orderMessages, orderReadReceipts, orders } from "@/lib/db/schema";
import { ConflictError, NotFoundError } from "@/lib/errors";
import { REALTIME_PROTOCOL_VERSION } from "@/lib/realtime/events";
import { publishOrderNotification } from "@/lib/realtime/notify";

export type SentMessage = {
  id: string;
  orderId: string;
  createdAt: Date;
};

/**
 * Persists a chat message and then signals listeners.
 *
 * Postgres is the source of truth: the row is committed before any socket is
 * told about it, so a dropped connection only ever means "fetch the history
 * again", never "the message is lost".
 */
export async function sendOrderMessage(input: {
  actor: ActorLike;
  orderId: string;
  body: string;
}): Promise<SentMessage> {
  return getDb().transaction(async (tx) => {
    const rows = await tx
      .select({
        id: orders.id,
        customerId: orders.customerId,
        assignedExecutorId: orders.assignedExecutorId,
      })
      .from(orders)
      .where(eq(orders.id, input.orderId))
      .limit(1);

    const order = rows[0];
    if (!order) throw new NotFoundError("That project does not exist.");

    // Same authorization rule as reading the order: no participation without
    // access, and no existence disclosure for anybody else.
    if (!resolveOrderRole(input.actor, order)) {
      throw new NotFoundError("That project does not exist.");
    }

    const inserted = await tx
      .insert(orderMessages)
      .values({
        orderId: order.id,
        senderId: input.actor.id,
        body: input.body,
      })
      .returning({
        id: orderMessages.id,
        orderId: orderMessages.orderId,
        createdAt: orderMessages.createdAt,
      });

    const message = inserted[0];
    if (!message) throw new ConflictError("The message could not be saved.");

    // The sender has, by definition, read their own message.
    await tx
      .insert(orderReadReceipts)
      .values({
        orderId: order.id,
        userId: input.actor.id,
        lastReadAt: message.createdAt,
      })
      .onConflictDoUpdate({
        target: [orderReadReceipts.orderId, orderReadReceipts.userId],
        set: { lastReadAt: message.createdAt },
      });

    await publishOrderNotification(tx, {
      v: REALTIME_PROTOCOL_VERSION,
      kind: "message",
      orderId: order.id,
      eventId: message.id,
      createdAt: message.createdAt.toISOString(),
      customerId: order.customerId,
      assignedExecutorId: order.assignedExecutorId,
    });

    return message;
  });
}

/**
 * Marks the conversation as read up to now for one participant. One row per
 * (order, user); no message rows are touched.
 */
export async function markOrderRead(input: {
  actor: ActorLike;
  orderId: string;
}): Promise<void> {
  const db = getDb();
  const rows = await db
    .select({
      id: orders.id,
      customerId: orders.customerId,
      assignedExecutorId: orders.assignedExecutorId,
    })
    .from(orders)
    .where(eq(orders.id, input.orderId))
    .limit(1);

  const order = rows[0];
  if (!order) throw new NotFoundError("That project does not exist.");
  if (!resolveOrderRole(input.actor, order)) {
    throw new NotFoundError("That project does not exist.");
  }

  await db
    .insert(orderReadReceipts)
    .values({ orderId: order.id, userId: input.actor.id })
    .onConflictDoUpdate({
      target: [orderReadReceipts.orderId, orderReadReceipts.userId],
      set: { lastReadAt: sql`now()` },
    });
}
