import { eq } from "drizzle-orm";

import type { ActorLike } from "@/lib/auth/rbac";
import { assertCanAssignExecutors, resolveOrderRole } from "@/lib/auth/rbac";
import { getDb } from "@/lib/db/client";
import { orderStatusEvents, orders, users } from "@/lib/db/schema";
import {
  ConflictError,
  InvalidInputError,
  InvalidTransitionError,
  NotFoundError,
  isUniqueViolation,
} from "@/lib/errors";
import { generateOrderReference } from "@/lib/orders/reference";
import { validateTransition, type OrderStatus } from "@/lib/orders/status";
import { REALTIME_PROTOCOL_VERSION } from "@/lib/realtime/events";
import { publishOrderNotification } from "@/lib/realtime/notify";
import type { CreateOrderInput } from "@/lib/validation/orders";

const REFERENCE_ATTEMPTS = 5;

export type CreatedOrder = {
  id: string;
  reference: string;
};

/**
 * Creates a project request.
 *
 * The customer is taken from the trusted session, never from the payload. The
 * order row and its first status-history event are written in one transaction,
 * so history can never be missing for an existing order.
 */
export async function createOrder(input: {
  actor: ActorLike;
  data: CreateOrderInput;
}): Promise<CreatedOrder> {
  const db = getDb();

  for (let attempt = 1; attempt <= REFERENCE_ATTEMPTS; attempt += 1) {
    const reference = generateOrderReference();

    try {
      return await db.transaction(async (tx) => {
        const insertedOrders = await tx
          .insert(orders)
          .values({
            reference,
            customerId: input.actor.id,
            title: input.data.title,
            detailedDescription: input.data.detailedDescription,
            problemStatement: input.data.problemStatement,
            keyFeatures: input.data.keyFeatures,
            technicalPreferences: input.data.technicalPreferences,
            referenceLinks: input.data.referenceLinks,
            desiredDeadline: input.data.desiredDeadline,
            status: "SUBMITTED",
          })
          .returning({ id: orders.id, reference: orders.reference });

        const order = insertedOrders[0];
        if (!order) throw new ConflictError("The request could not be saved.");

        const insertedEvents = await tx
          .insert(orderStatusEvents)
          .values({
            orderId: order.id,
            fromStatus: null,
            toStatus: "SUBMITTED",
            changedById: input.actor.id,
            note: null,
          })
          .returning({
            id: orderStatusEvents.id,
            createdAt: orderStatusEvents.createdAt,
          });

        const event = insertedEvents[0];
        if (!event) throw new ConflictError("The request could not be saved.");

        await publishOrderNotification(tx, {
          v: REALTIME_PROTOCOL_VERSION,
          kind: "status",
          orderId: order.id,
          eventId: event.id,
          createdAt: event.createdAt.toISOString(),
          customerId: input.actor.id,
          assignedExecutorId: null,
        });

        return { id: order.id, reference: order.reference };
      });
    } catch (error) {
      // Reference collisions are the only retryable failure here.
      if (isUniqueViolation(error) && attempt < REFERENCE_ATTEMPTS) continue;
      throw error;
    }
  }

  throw new ConflictError("Could not allocate a project reference. Please try again.");
}

export type StatusChangeResult = {
  orderId: string;
  reference: string;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  eventId: string;
};

/**
 * Atomic status change.
 *
 * `SELECT ... FOR UPDATE` serializes concurrent transitions, so two actors
 * cannot both move the same order out of the same state. Authorization, the
 * state-machine check, the row update, the history event and the realtime
 * signal all live in a single transaction: nothing can be applied partially.
 */
export async function changeOrderStatus(input: {
  actor: ActorLike;
  orderId: string;
  toStatus: OrderStatus;
  note: string | null;
}): Promise<StatusChangeResult> {
  return getDb().transaction(async (tx) => {
    const rows = await tx
      .select({
        id: orders.id,
        reference: orders.reference,
        status: orders.status,
        customerId: orders.customerId,
        assignedExecutorId: orders.assignedExecutorId,
      })
      .from(orders)
      .where(eq(orders.id, input.orderId))
      .limit(1)
      .for("update");

    const order = rows[0];
    // An unauthorized actor gets the same answer as for a nonexistent order.
    if (!order) throw new NotFoundError("That project does not exist.");

    const orderRole = resolveOrderRole(input.actor, order);
    if (!orderRole) throw new NotFoundError("That project does not exist.");

    const decision = validateTransition({
      order,
      orderRole,
      toStatus: input.toStatus,
      note: input.note,
    });
    if (!decision.ok) throw new InvalidTransitionError(decision.reason);

    const now = new Date();
    await tx
      .update(orders)
      .set({
        status: input.toStatus,
        // Mirrors the `orders_completed_at_matches_status` check constraint.
        completedAt: input.toStatus === "COMPLETED" ? now : null,
        updatedAt: now,
      })
      .where(eq(orders.id, order.id));

    const insertedEvents = await tx
      .insert(orderStatusEvents)
      .values({
        orderId: order.id,
        fromStatus: order.status,
        toStatus: input.toStatus,
        changedById: input.actor.id,
        note: input.note,
      })
      .returning({
        id: orderStatusEvents.id,
        createdAt: orderStatusEvents.createdAt,
      });

    const event = insertedEvents[0];
    if (!event) throw new ConflictError("The status change could not be saved.");

    await publishOrderNotification(tx, {
      v: REALTIME_PROTOCOL_VERSION,
      kind: "status",
      orderId: order.id,
      eventId: event.id,
      createdAt: event.createdAt.toISOString(),
      customerId: order.customerId,
      assignedExecutorId: order.assignedExecutorId,
    });

    return {
      orderId: order.id,
      reference: order.reference,
      fromStatus: order.status,
      toStatus: input.toStatus,
      eventId: event.id,
    };
  });
}

export type AssignmentResult = {
  orderId: string;
  reference: string;
  assignedExecutorId: string | null;
};

/**
 * Assigns or clears the executor. Administrators only, and the target must
 * actually hold the executor role, so assignment cannot be used to widen a
 * customer's access to another customer's project.
 */
export async function assignExecutor(input: {
  actor: ActorLike;
  orderId: string;
  executorId: string | null;
  note: string | null;
}): Promise<AssignmentResult> {
  assertCanAssignExecutors(input.actor);

  return getDb().transaction(async (tx) => {
    const rows = await tx
      .select({
        id: orders.id,
        reference: orders.reference,
        status: orders.status,
        customerId: orders.customerId,
        assignedExecutorId: orders.assignedExecutorId,
      })
      .from(orders)
      .where(eq(orders.id, input.orderId))
      .limit(1)
      .for("update");

    const order = rows[0];
    if (!order) throw new NotFoundError("That project does not exist.");

    if (input.executorId !== null) {
      const executorRows = await tx
        .select({ id: users.id, role: users.role })
        .from(users)
        .where(eq(users.id, input.executorId))
        .limit(1);

      const executor = executorRows[0];
      if (!executor) throw new NotFoundError("That user no longer exists.");
      if (executor.role !== "EXECUTOR") {
        throw new InvalidInputError(
          "Only users with the executor role can be assigned.",
        );
      }
      if (executor.id === order.customerId) {
        throw new InvalidInputError(
          "The customer of a project cannot be assigned as its executor.",
        );
      }
    }

    if (order.assignedExecutorId === input.executorId) {
      return {
        orderId: order.id,
        reference: order.reference,
        assignedExecutorId: order.assignedExecutorId,
      };
    }

    const now = new Date();
    await tx
      .update(orders)
      .set({ assignedExecutorId: input.executorId, updatedAt: now })
      .where(eq(orders.id, order.id));

    // Assignment is part of the project history, recorded as a same-status
    // event so the timeline explains who was put on the project and why.
    const insertedEvents = await tx
      .insert(orderStatusEvents)
      .values({
        orderId: order.id,
        fromStatus: order.status,
        toStatus: order.status,
        changedById: input.actor.id,
        note:
          input.note ??
          (input.executorId === null ? "Executor unassigned" : "Executor assigned"),
      })
      .returning({
        id: orderStatusEvents.id,
        createdAt: orderStatusEvents.createdAt,
      });

    const event = insertedEvents[0];
    if (!event) throw new ConflictError("The assignment could not be saved.");

    await publishOrderNotification(tx, {
      v: REALTIME_PROTOCOL_VERSION,
      kind: "status",
      orderId: order.id,
      eventId: event.id,
      createdAt: event.createdAt.toISOString(),
      customerId: order.customerId,
      assignedExecutorId: input.executorId,
    });

    return {
      orderId: order.id,
      reference: order.reference,
      assignedExecutorId: input.executorId,
    };
  });
}
