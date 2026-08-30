import { ForbiddenError } from "@/lib/errors";
import type { UserRole } from "@/lib/auth/roles";
import {
  listAllowedTransitions,
  type OrderTransition,
  type TransitionContext,
} from "@/lib/orders/status";

/**
 * Centralized role logic.
 *
 * Deliberately dependency-free (no database, no framework) so it can be unit
 * tested and reused by server actions, route handlers, pages and the realtime
 * gateway without duplicating authorization rules.
 */
export type ActorLike = {
  id: string;
  role: UserRole;
};

export type OrderAccessContext = TransitionContext & {
  customerId: string;
};

/**
 * The role the actor holds *for this specific order*, or null when the actor
 * has no legitimate relationship with it.
 *
 * Administrators are global. A customer only matches their own orders. An
 * executor only matches orders explicitly assigned to them.
 */
export function resolveOrderRole(
  actor: ActorLike,
  order: Pick<OrderAccessContext, "customerId" | "assignedExecutorId">,
): UserRole | null {
  if (actor.role === "ADMIN") return "ADMIN";
  if (actor.role === "CUSTOMER" && actor.id === order.customerId) return "CUSTOMER";
  if (actor.role === "EXECUTOR" && actor.id === order.assignedExecutorId) {
    return "EXECUTOR";
  }
  return null;
}

export function canReadOrder(
  actor: ActorLike,
  order: Pick<OrderAccessContext, "customerId" | "assignedExecutorId">,
): boolean {
  return resolveOrderRole(actor, order) !== null;
}

/** Participation in the order conversation follows read access exactly. */
export function canParticipateInOrderChat(
  actor: ActorLike,
  order: Pick<OrderAccessContext, "customerId" | "assignedExecutorId">,
): boolean {
  return resolveOrderRole(actor, order) !== null;
}

export function canViewAllOrders(actor: ActorLike): boolean {
  return actor.role === "ADMIN";
}

export function canAssignExecutors(actor: ActorLike): boolean {
  return actor.role === "ADMIN";
}

export function canManageUsers(actor: ActorLike): boolean {
  return actor.role === "ADMIN";
}

export function canManagePublicContent(actor: ActorLike): boolean {
  return actor.role === "ADMIN";
}

export function transitionsAvailableTo(
  actor: ActorLike,
  order: OrderAccessContext,
): readonly OrderTransition[] {
  const orderRole = resolveOrderRole(actor, order);
  if (!orderRole) return [];
  return listAllowedTransitions(order, orderRole);
}

/* -------------------------------------------------------------------------- */
/* Assertions (throw ForbiddenError, which callers surface safely)            */
/* -------------------------------------------------------------------------- */

export function assertCanAssignExecutors(actor: ActorLike): void {
  if (!canAssignExecutors(actor)) {
    throw new ForbiddenError("Only administrators can assign executors.");
  }
}

export function assertCanManageUsers(actor: ActorLike): void {
  if (!canManageUsers(actor)) {
    throw new ForbiddenError("Only administrators can manage users.");
  }
}

export function assertCanManagePublicContent(actor: ActorLike): void {
  if (!canManagePublicContent(actor)) {
    throw new ForbiddenError("Only administrators can manage published content.");
  }
}
