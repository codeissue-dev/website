import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { orders, users } from "@/lib/db/schema";
import { USER_ROLES, type UserRole } from "@/lib/auth/roles";
import type { UserListParams } from "@/lib/validation/users";

/** Never contains `passwordHash`: this shape is safe to render. */
export type PublicUser = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: Date;
};

export type CredentialsUser = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  passwordHash: string | null;
};

/**
 * Credentials lookup. The password hash never leaves the authentication code
 * path: `authorize()` uses it to verify and then discards it.
 */
export async function findUserByEmailForCredentials(
  email: string,
): Promise<CredentialsUser | null> {
  const rows = await getDb()
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return rows[0] ?? null;
}

/** Authoritative actor lookup: role always comes from Postgres, not a token. */
export async function loadUserById(id: string): Promise<PublicUser | null> {
  const rows = await getDb()
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return rows[0] ?? null;
}

export async function loadUserWithPasswordHash(
  id: string,
): Promise<CredentialsUser | null> {
  const rows = await getDb()
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      passwordHash: users.passwordHash,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return rows[0] ?? null;
}

export async function listExecutors(): Promise<PublicUser[]> {
  return getDb()
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.role, "EXECUTOR"))
    .orderBy(asc(users.name), asc(users.email));
}

export type UserListRow = PublicUser & {
  orderCount: number;
  assignedCount: number;
};

export type UserListResult = {
  rows: UserListRow[];
  total: number;
  page: number;
  perPage: number;
  pageCount: number;
};

export async function listUsers(params: UserListParams): Promise<UserListResult> {
  const db = getDb();
  const filters = [];

  if (params.q.length > 0) {
    const pattern = `%${params.q}%`;
    filters.push(or(ilike(users.email, pattern), ilike(users.name, pattern)));
  }
  if (params.role !== "ALL") {
    filters.push(eq(users.role, params.role));
  }

  const where = filters.length > 0 ? and(...filters) : undefined;
  const offset = (params.page - 1) * params.perPage;

  const [rows, totals] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        orderCount: sql<number>`(
          select count(*) from ${orders} where ${orders.customerId} = ${users.id}
        )`.mapWith(Number),
        assignedCount: sql<number>`(
          select count(*) from ${orders} where ${orders.assignedExecutorId} = ${users.id}
        )`.mapWith(Number),
      })
      .from(users)
      .where(where)
      .orderBy(desc(users.createdAt))
      .limit(params.perPage)
      .offset(offset),
    db.select({ total: count() }).from(users).where(where),
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

export async function countUsersByRole(): Promise<Record<UserRole, number>> {
  const rows = await getDb()
    .select({ role: users.role, total: count() })
    .from(users)
    .groupBy(users.role);

  const result: Record<UserRole, number> = { CUSTOMER: 0, EXECUTOR: 0, ADMIN: 0 };
  for (const row of rows) {
    result[row.role] = row.total;
  }
  return result;
}

export async function countAdmins(): Promise<number> {
  const rows = await getDb()
    .select({ total: count() })
    .from(users)
    .where(eq(users.role, "ADMIN"));
  return rows[0]?.total ?? 0;
}

export const ASSIGNABLE_ROLES: readonly UserRole[] = USER_ROLES;
