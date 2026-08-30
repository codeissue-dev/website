import { and, count, desc, eq, gte, isNull, ne, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { getDb } from "@/lib/db/client";
import {
  orderStatusEvents,
  orders,
  portfolioItems,
  testimonials,
  users,
} from "@/lib/db/schema";
import type { UserRole } from "@/lib/auth/roles";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/orders/status";

const actorUser = alias(users, "activity_actor");

function emptyStatusCounts(): Record<OrderStatus, number> {
  const counts: Record<string, number> = {};
  for (const status of ORDER_STATUSES) counts[status] = 0;
  return counts;
}

async function countOrdersByStatus(
  scope: { customerId?: string; executorId?: string } = {},
): Promise<Record<OrderStatus, number>> {
  const filters = [];
  if (scope.customerId) filters.push(eq(orders.customerId, scope.customerId));
  if (scope.executorId) filters.push(eq(orders.assignedExecutorId, scope.executorId));

  const rows = await getDb()
    .select({ status: orders.status, total: count() })
    .from(orders)
    .where(filters.length > 0 ? and(...filters) : undefined)
    .groupBy(orders.status);

  const counts = emptyStatusCounts();
  for (const row of rows) counts[row.status] = row.total;
  return counts;
}

export type ActivityEntry = {
  id: string;
  orderId: string;
  reference: string;
  title: string;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  note: string | null;
  createdAt: Date;
  actorName: string | null;
  actorEmail: string;
  actorRole: UserRole;
};

async function listRecentActivity(
  scope: { executorId?: string } = {},
  limit = 8,
): Promise<ActivityEntry[]> {
  const filters = [];
  if (scope.executorId) {
    filters.push(eq(orders.assignedExecutorId, scope.executorId));
  }

  return getDb()
    .select({
      id: orderStatusEvents.id,
      orderId: orders.id,
      reference: orders.reference,
      title: orders.title,
      fromStatus: orderStatusEvents.fromStatus,
      toStatus: orderStatusEvents.toStatus,
      note: orderStatusEvents.note,
      createdAt: orderStatusEvents.createdAt,
      actorName: actorUser.name,
      actorEmail: actorUser.email,
      actorRole: actorUser.role,
    })
    .from(orderStatusEvents)
    .innerJoin(orders, eq(orders.id, orderStatusEvents.orderId))
    .innerJoin(actorUser, eq(actorUser.id, orderStatusEvents.changedById))
    .where(filters.length > 0 ? and(...filters) : undefined)
    .orderBy(desc(orderStatusEvents.createdAt))
    .limit(limit);
}

/** Average delivery time over genuinely completed orders, or null if none. */
async function averageDeliveryDays(): Promise<number | null> {
  const rows = await getDb()
    .select({
      averageSeconds: sql<
        string | null
      >`avg(extract(epoch from (${orders.completedAt} - ${orders.createdAt})))`,
    })
    .from(orders)
    .where(eq(orders.status, "COMPLETED"));

  const raw = rows[0]?.averageSeconds ?? null;
  if (raw === null) return null;
  const seconds = Number.parseFloat(raw);
  if (!Number.isFinite(seconds)) return null;
  return Math.round((seconds / 86_400) * 10) / 10;
}

export type AdminStats = {
  totalOrders: number;
  openOrders: number;
  unassignedOrders: number;
  completedOrders: number;
  completedLast30Days: number;
  averageDeliveryDays: number | null;
  statusCounts: Record<OrderStatus, number>;
  usersByRole: Record<UserRole, number>;
  publishedPortfolioItems: number;
  draftPortfolioItems: number;
  publishedTestimonials: number;
  draftTestimonials: number;
  recentActivity: ActivityEntry[];
};

/** Every number below is read from Postgres at request time. */
export async function loadAdminStats(): Promise<AdminStats> {
  const db = getDb();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    statusCounts,
    unassigned,
    completedRecently,
    roleRows,
    portfolioRows,
    testimonialRows,
    recentActivity,
    deliveryDays,
  ] = await Promise.all([
    countOrdersByStatus(),
    db
      .select({ total: count() })
      .from(orders)
      .where(
        and(
          isNull(orders.assignedExecutorId),
          ne(orders.status, "COMPLETED"),
          ne(orders.status, "CANCELED"),
        ),
      ),
    db
      .select({ total: count() })
      .from(orders)
      .where(
        and(eq(orders.status, "COMPLETED"), gte(orders.completedAt, thirtyDaysAgo)),
      ),
    db.select({ role: users.role, total: count() }).from(users).groupBy(users.role),
    db
      .select({ published: portfolioItems.published, total: count() })
      .from(portfolioItems)
      .groupBy(portfolioItems.published),
    db
      .select({ published: testimonials.published, total: count() })
      .from(testimonials)
      .groupBy(testimonials.published),
    listRecentActivity(),
    averageDeliveryDays(),
  ]);

  const usersByRole: Record<UserRole, number> = { CUSTOMER: 0, EXECUTOR: 0, ADMIN: 0 };
  for (const row of roleRows) usersByRole[row.role] = row.total;

  const totalOrders = ORDER_STATUSES.reduce(
    (total, status) => total + statusCounts[status],
    0,
  );
  const openOrders = totalOrders - statusCounts.COMPLETED - statusCounts.CANCELED;

  const publishedPortfolio = portfolioRows.find((row) => row.published)?.total ?? 0;
  const draftPortfolio = portfolioRows.find((row) => !row.published)?.total ?? 0;
  const publishedTestimonials =
    testimonialRows.find((row) => row.published)?.total ?? 0;
  const draftTestimonials = testimonialRows.find((row) => !row.published)?.total ?? 0;

  return {
    totalOrders,
    openOrders,
    unassignedOrders: unassigned[0]?.total ?? 0,
    completedOrders: statusCounts.COMPLETED,
    completedLast30Days: completedRecently[0]?.total ?? 0,
    averageDeliveryDays: deliveryDays,
    statusCounts,
    usersByRole,
    publishedPortfolioItems: publishedPortfolio,
    draftPortfolioItems: draftPortfolio,
    publishedTestimonials,
    draftTestimonials,
    recentActivity,
  };
}

export type ScopedStats = {
  totalOrders: number;
  openOrders: number;
  completedOrders: number;
  statusCounts: Record<OrderStatus, number>;
  recentActivity: ActivityEntry[];
};

export async function loadCustomerStats(customerId: string): Promise<ScopedStats> {
  const statusCounts = await countOrdersByStatus({ customerId });
  const totalOrders = ORDER_STATUSES.reduce(
    (total, status) => total + statusCounts[status],
    0,
  );

  return {
    totalOrders,
    openOrders: totalOrders - statusCounts.COMPLETED - statusCounts.CANCELED,
    completedOrders: statusCounts.COMPLETED,
    statusCounts,
    recentActivity: [],
  };
}

export async function loadExecutorStats(executorId: string): Promise<ScopedStats> {
  const [statusCounts, recentActivity] = await Promise.all([
    countOrdersByStatus({ executorId }),
    listRecentActivity({ executorId }, 6),
  ]);

  const totalOrders = ORDER_STATUSES.reduce(
    (total, status) => total + statusCounts[status],
    0,
  );

  return {
    totalOrders,
    openOrders: totalOrders - statusCounts.COMPLETED - statusCounts.CANCELED,
    completedOrders: statusCounts.COMPLETED,
    statusCounts,
    recentActivity,
  };
}
