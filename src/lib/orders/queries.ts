import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  ilike,
  isNull,
  isNotNull,
  ne,
  or,
  sql,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import type { Actor } from "@/lib/auth/actor";
import type { ActorLike } from "@/lib/auth/rbac";
import { resolveOrderRole } from "@/lib/auth/rbac";
import type { UserRole } from "@/lib/auth/roles";
import { getDb } from "@/lib/db/client";
import {
  orderMessages,
  orderReadReceipts,
  orderStatusEvents,
  orders,
  users,
} from "@/lib/db/schema";
import type { OrderStatus } from "@/lib/orders/status";
import { ORDER_STATUS_FILTER_ALL, type OrderListParams } from "@/lib/validation/orders";

const customerUser = alias(users, "customer_user");
const executorUser = alias(users, "executor_user");
const actorUser = alias(users, "actor_user");

/**
 * Row-level visibility, expressed in SQL.
 *
 * Every order read goes through this predicate, so an unauthorized reference is
 * indistinguishable from a nonexistent one (no IDOR, no existence oracle).
 */
function visibilityFilter(actor: ActorLike) {
  if (actor.role === "ADMIN") return undefined;
  if (actor.role === "EXECUTOR") return eq(orders.assignedExecutorId, actor.id);
  return eq(orders.customerId, actor.id);
}

export type OrderListItem = {
  id: string;
  reference: string;
  title: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  desiredDeadline: string | null;
  customerName: string | null;
  customerEmail: string;
  executorName: string | null;
  executorEmail: string | null;
  unreadCount: number;
};

export type OrderListResult = {
  rows: OrderListItem[];
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
};

/** Unread messages for the actor: everything newer than their read receipt. */
function unreadCountExpression(actorId: string) {
  return sql<number>`(
    select count(*)
    from ${orderMessages}
    where ${orderMessages.orderId} = ${orders.id}
      and ${orderMessages.senderId} <> ${actorId}
      and ${orderMessages.createdAt} > coalesce(
        (
          select ${orderReadReceipts.lastReadAt}
          from ${orderReadReceipts}
          where ${orderReadReceipts.orderId} = ${orders.id}
            and ${orderReadReceipts.userId} = ${actorId}
        ),
        to_timestamp(0)
      )
  )`.mapWith(Number);
}

export async function listOrdersForActor(
  actor: Actor,
  params: OrderListParams,
): Promise<OrderListResult> {
  const db = getDb();
  const filters = [visibilityFilter(actor)];

  if (params.status !== ORDER_STATUS_FILTER_ALL) {
    filters.push(eq(orders.status, params.status));
  }
  if (params.assignment === "unassigned") {
    filters.push(isNull(orders.assignedExecutorId));
  }
  if (params.assignment === "assigned") {
    filters.push(isNotNull(orders.assignedExecutorId));
  }
  if (params.q.length > 0) {
    const pattern = `%${params.q}%`;
    filters.push(
      or(
        ilike(orders.reference, pattern),
        ilike(orders.title, pattern),
        ilike(customerUser.email, pattern),
        ilike(customerUser.name, pattern),
      ),
    );
  }

  const where = and(...filters.filter((filter) => filter !== undefined));
  const offset = (params.page - 1) * params.perPage;

  const [rows, totals] = await Promise.all([
    db
      .select({
        id: orders.id,
        reference: orders.reference,
        title: orders.title,
        status: orders.status,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        desiredDeadline: orders.desiredDeadline,
        customerName: customerUser.name,
        customerEmail: customerUser.email,
        executorName: executorUser.name,
        executorEmail: executorUser.email,
        unreadCount: unreadCountExpression(actor.id),
      })
      .from(orders)
      .innerJoin(customerUser, eq(customerUser.id, orders.customerId))
      .leftJoin(executorUser, eq(executorUser.id, orders.assignedExecutorId))
      .where(where)
      .orderBy(desc(orders.updatedAt))
      .limit(params.perPage)
      .offset(offset),
    db
      .select({ total: count() })
      .from(orders)
      .innerJoin(customerUser, eq(customerUser.id, orders.customerId))
      .where(where),
  ]);

  const total = totals[0]?.total ?? 0;

  return {
    rows,
    total,
    page: params.page,
    perPage: params.perPage,
    pageCount: Math.max(1, Math.ceil(total / params.perPage)),
  };
}

export type OrderDetail = {
  id: string;
  reference: string;
  title: string;
  detailedDescription: string;
  problemStatement: string;
  keyFeatures: string;
  technicalPreferences: string | null;
  referenceLinks: string | null;
  desiredDeadline: string | null;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  customerId: string;
  customerName: string | null;
  customerEmail: string;
  assignedExecutorId: string | null;
  executorName: string | null;
  executorEmail: string | null;
};

/**
 * Authorized detail lookup by human-readable reference.
 * Returns null both when the order does not exist and when the actor may not
 * see it: callers render the not-found view in both cases.
 */
export async function loadOrderForActor(
  actor: Actor,
  reference: string,
): Promise<OrderDetail | null> {
  const rows = await getDb()
    .select({
      id: orders.id,
      reference: orders.reference,
      title: orders.title,
      detailedDescription: orders.detailedDescription,
      problemStatement: orders.problemStatement,
      keyFeatures: orders.keyFeatures,
      technicalPreferences: orders.technicalPreferences,
      referenceLinks: orders.referenceLinks,
      desiredDeadline: orders.desiredDeadline,
      status: orders.status,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      completedAt: orders.completedAt,
      customerId: orders.customerId,
      customerName: customerUser.name,
      customerEmail: customerUser.email,
      assignedExecutorId: orders.assignedExecutorId,
      executorName: executorUser.name,
      executorEmail: executorUser.email,
    })
    .from(orders)
    .innerJoin(customerUser, eq(customerUser.id, orders.customerId))
    .leftJoin(executorUser, eq(executorUser.id, orders.assignedExecutorId))
    .where(
      and(
        eq(orders.reference, reference),
        ...[visibilityFilter(actor)].filter((filter) => filter !== undefined),
      ),
    )
    .limit(1);

  const order = rows[0];
  if (!order) return null;

  // Defence in depth: the SQL filter already applied, now assert in code too.
  if (!resolveOrderRole(actor, order)) return null;
  return order;
}

/**
 * Authorization for a single order id, used by mutations and by the realtime
 * gateway before a subscription is accepted.
 */
export type OrderAuthorization = {
  orderId: string;
  reference: string;
  status: OrderStatus;
  customerId: string;
  assignedExecutorId: string | null;
  orderRole: UserRole;
};

export async function authorizeOrderAccess(
  actor: ActorLike,
  orderId: string,
): Promise<OrderAuthorization | null> {
  const rows = await getDb()
    .select({
      orderId: orders.id,
      reference: orders.reference,
      status: orders.status,
      customerId: orders.customerId,
      assignedExecutorId: orders.assignedExecutorId,
    })
    .from(orders)
    .where(
      and(
        eq(orders.id, orderId),
        ...[visibilityFilter(actor)].filter((filter) => filter !== undefined),
      ),
    )
    .limit(1);

  const order = rows[0];
  if (!order) return null;

  const orderRole = resolveOrderRole(actor, order);
  if (!orderRole) return null;

  return { ...order, orderRole };
}

export type StatusEventWithActor = {
  id: string;
  orderId: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  note: string | null;
  createdAt: Date;
  actorId: string;
  actorName: string | null;
  actorRole: UserRole;
};

export async function listStatusEvents(
  orderId: string,
  options: { since?: Date | null; limit?: number } = {},
): Promise<StatusEventWithActor[]> {
  const limit = options.limit ?? 200;
  const filters = [eq(orderStatusEvents.orderId, orderId)];
  if (options.since) {
    filters.push(gt(orderStatusEvents.createdAt, options.since));
  }

  return getDb()
    .select({
      id: orderStatusEvents.id,
      orderId: orderStatusEvents.orderId,
      fromStatus: orderStatusEvents.fromStatus,
      toStatus: orderStatusEvents.toStatus,
      note: orderStatusEvents.note,
      createdAt: orderStatusEvents.createdAt,
      actorId: actorUser.id,
      actorName: actorUser.name,
      actorRole: actorUser.role,
    })
    .from(orderStatusEvents)
    .innerJoin(actorUser, eq(actorUser.id, orderStatusEvents.changedById))
    .where(and(...filters))
    .orderBy(asc(orderStatusEvents.createdAt))
    .limit(limit);
}

export async function countOpenOrdersForCustomer(customerId: string): Promise<number> {
  const rows = await getDb()
    .select({ total: count() })
    .from(orders)
    .where(
      and(
        eq(orders.customerId, customerId),
        ne(orders.status, "COMPLETED"),
        ne(orders.status, "CANCELED"),
      ),
    );
  return rows[0]?.total ?? 0;
}
