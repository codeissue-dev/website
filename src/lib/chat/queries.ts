import { and, asc, count, desc, eq, gt, ne, or, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import type { ActorLike } from "@/lib/auth/rbac";
import type { UserRole } from "@/lib/auth/roles";
import { getDb } from "@/lib/db/client";
import { orderMessages, orderReadReceipts, orders, users } from "@/lib/db/schema";

const senderUser = alias(users, "sender_user");

export type OrderMessageWithSender = {
  id: string;
  orderId: string;
  body: string;
  createdAt: Date;
  senderId: string;
  senderName: string | null;
  senderRole: UserRole;
};

/**
 * Message history for one order.
 *
 * Callers must have authorized access to `orderId` first (see
 * `authorizeOrderAccess`): this function is deliberately unaware of actors so
 * it can serve both page rendering and realtime backfill.
 */
export async function listOrderMessages(
  orderId: string,
  options: { since?: Date | null; limit?: number } = {},
): Promise<OrderMessageWithSender[]> {
  const limit = options.limit ?? 200;
  const filters = [eq(orderMessages.orderId, orderId)];
  if (options.since) filters.push(gt(orderMessages.createdAt, options.since));

  const rows = await getDb()
    .select({
      id: orderMessages.id,
      orderId: orderMessages.orderId,
      body: orderMessages.body,
      createdAt: orderMessages.createdAt,
      senderId: senderUser.id,
      senderName: senderUser.name,
      senderRole: senderUser.role,
    })
    .from(orderMessages)
    .innerJoin(senderUser, eq(senderUser.id, orderMessages.senderId))
    .where(and(...filters))
    // Newest first so a long conversation returns the most recent window,
    // then reversed for chronological display.
    .orderBy(desc(orderMessages.createdAt))
    .limit(limit);

  return rows.reverse();
}

export async function loadOrderMessage(
  messageId: string,
): Promise<OrderMessageWithSender | null> {
  const rows = await getDb()
    .select({
      id: orderMessages.id,
      orderId: orderMessages.orderId,
      body: orderMessages.body,
      createdAt: orderMessages.createdAt,
      senderId: senderUser.id,
      senderName: senderUser.name,
      senderRole: senderUser.role,
    })
    .from(orderMessages)
    .innerJoin(senderUser, eq(senderUser.id, orderMessages.senderId))
    .where(eq(orderMessages.id, messageId))
    .limit(1);

  return rows[0] ?? null;
}

export async function countOrderMessages(orderId: string): Promise<number> {
  const rows = await getDb()
    .select({ total: count() })
    .from(orderMessages)
    .where(eq(orderMessages.orderId, orderId));
  return rows[0]?.total ?? 0;
}

/** Oldest message in the returned window, used to detect truncated history. */
export async function firstMessageCreatedAt(orderId: string): Promise<Date | null> {
  const rows = await getDb()
    .select({ createdAt: orderMessages.createdAt })
    .from(orderMessages)
    .where(eq(orderMessages.orderId, orderId))
    .orderBy(asc(orderMessages.createdAt))
    .limit(1);
  return rows[0]?.createdAt ?? null;
}

export async function loadLastReadAt(
  orderId: string,
  userId: string,
): Promise<Date | null> {
  const rows = await getDb()
    .select({ lastReadAt: orderReadReceipts.lastReadAt })
    .from(orderReadReceipts)
    .where(
      and(eq(orderReadReceipts.orderId, orderId), eq(orderReadReceipts.userId, userId)),
    )
    .limit(1);
  return rows[0]?.lastReadAt ?? null;
}

/**
 * Total unread messages across every order the actor may see. Uses the read
 * receipt table, so historical messages are never rewritten.
 */
export async function countUnreadMessagesForActor(actor: ActorLike): Promise<number> {
  const visibility =
    actor.role === "ADMIN"
      ? undefined
      : actor.role === "EXECUTOR"
        ? eq(orders.assignedExecutorId, actor.id)
        : eq(orders.customerId, actor.id);

  const filters = [ne(orderMessages.senderId, actor.id)];
  if (visibility) filters.push(visibility);

  const rows = await getDb()
    .select({ total: count() })
    .from(orderMessages)
    .innerJoin(orders, eq(orders.id, orderMessages.orderId))
    .leftJoin(
      orderReadReceipts,
      and(
        eq(orderReadReceipts.orderId, orderMessages.orderId),
        eq(orderReadReceipts.userId, actor.id),
      ),
    )
    .where(
      and(
        ...filters,
        or(
          sql`${orderReadReceipts.lastReadAt} is null`,
          gt(orderMessages.createdAt, orderReadReceipts.lastReadAt),
        ),
      ),
    );

  return rows[0]?.total ?? 0;
}
