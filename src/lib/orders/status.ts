import type { UserRole } from "@/lib/auth/roles";

/**
 * The order lifecycle.
 *
 * This module is the single source of truth: the Postgres enum is generated
 * from `ORDER_STATUSES`, the UI renders `ORDER_STATUS_LABELS`, and every status
 * change is validated against `ORDER_TRANSITIONS`. Arbitrary status strings can
 * never enter the system.
 */
export const ORDER_STATUSES = [
  "SUBMITTED",
  "REVIEWING",
  "ACCEPTED",
  "IN_PROGRESS",
  "WAITING_FOR_CUSTOMER",
  "QUALITY_ASSURANCE",
  "COMPLETED",
  "CANCELED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && ORDER_STATUSES.some((status) => status === value);
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  SUBMITTED: "Submitted",
  REVIEWING: "In review",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In progress",
  WAITING_FOR_CUSTOMER: "Waiting for you",
  QUALITY_ASSURANCE: "Quality assurance",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
};

export const ORDER_STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  SUBMITTED: "The request has been received and is queued for review.",
  REVIEWING: "We are scoping the work and preparing questions.",
  ACCEPTED: "Scope agreed. The project is queued for an executor.",
  IN_PROGRESS: "An executor is actively building the project.",
  WAITING_FOR_CUSTOMER: "We need a decision or missing information from you.",
  QUALITY_ASSURANCE: "The build is being reviewed and tested before handover.",
  COMPLETED: "Delivered and closed.",
  CANCELED: "Closed without delivery.",
};

/** Statuses that represent an open engagement. */
export const ACTIVE_ORDER_STATUSES: readonly OrderStatus[] = [
  "SUBMITTED",
  "REVIEWING",
  "ACCEPTED",
  "IN_PROGRESS",
  "WAITING_FOR_CUSTOMER",
  "QUALITY_ASSURANCE",
];

export const TERMINAL_ORDER_STATUSES: readonly OrderStatus[] = [
  "COMPLETED",
  "CANCELED",
];

export function isTerminalStatus(status: OrderStatus): boolean {
  return TERMINAL_ORDER_STATUSES.includes(status);
}

export type OrderTransition = {
  to: OrderStatus;
  /** Roles allowed to perform the transition, evaluated against the order. */
  roles: readonly UserRole[];
  /** Label used on the action control. */
  actionLabel: string;
  /** The transition is rejected unless an executor is assigned. */
  requiresAssignedExecutor?: boolean;
  /** The transition is rejected unless the actor supplies a note. */
  requiresNote?: boolean;
  /** The control is treated as destructive in the UI (needs confirmation). */
  destructive?: boolean;
};

/**
 * Allowed transitions per status.
 *
 * `roles` are roles *relative to the order* (see `resolveOrderRole`): the
 * customer who owns it, the executor assigned to it, or an administrator.
 */
export const ORDER_TRANSITIONS: Record<OrderStatus, readonly OrderTransition[]> = {
  SUBMITTED: [
    { to: "REVIEWING", roles: ["ADMIN"], actionLabel: "Start review" },
    {
      to: "CANCELED",
      roles: ["ADMIN", "CUSTOMER"],
      actionLabel: "Cancel request",
      requiresNote: true,
      destructive: true,
    },
  ],
  REVIEWING: [
    { to: "ACCEPTED", roles: ["ADMIN"], actionLabel: "Accept project" },
    {
      to: "WAITING_FOR_CUSTOMER",
      roles: ["ADMIN"],
      actionLabel: "Ask the customer",
      requiresNote: true,
    },
    {
      to: "CANCELED",
      roles: ["ADMIN", "CUSTOMER"],
      actionLabel: "Cancel request",
      requiresNote: true,
      destructive: true,
    },
  ],
  ACCEPTED: [
    {
      to: "IN_PROGRESS",
      roles: ["ADMIN", "EXECUTOR"],
      actionLabel: "Start development",
      requiresAssignedExecutor: true,
    },
    {
      to: "CANCELED",
      roles: ["ADMIN"],
      actionLabel: "Cancel project",
      requiresNote: true,
      destructive: true,
    },
  ],
  IN_PROGRESS: [
    {
      to: "WAITING_FOR_CUSTOMER",
      roles: ["ADMIN", "EXECUTOR"],
      actionLabel: "Request customer input",
      requiresNote: true,
    },
    {
      to: "QUALITY_ASSURANCE",
      roles: ["ADMIN", "EXECUTOR"],
      actionLabel: "Send to QA",
    },
    {
      to: "CANCELED",
      roles: ["ADMIN"],
      actionLabel: "Cancel project",
      requiresNote: true,
      destructive: true,
    },
  ],
  WAITING_FOR_CUSTOMER: [
    {
      to: "IN_PROGRESS",
      roles: ["ADMIN", "EXECUTOR", "CUSTOMER"],
      actionLabel: "Resume development",
      requiresAssignedExecutor: true,
    },
    {
      to: "CANCELED",
      roles: ["ADMIN"],
      actionLabel: "Cancel project",
      requiresNote: true,
      destructive: true,
    },
  ],
  QUALITY_ASSURANCE: [
    {
      to: "IN_PROGRESS",
      roles: ["ADMIN", "EXECUTOR"],
      actionLabel: "Send back to development",
      requiresNote: true,
      requiresAssignedExecutor: true,
    },
    { to: "COMPLETED", roles: ["ADMIN"], actionLabel: "Mark as delivered" },
  ],
  COMPLETED: [],
  CANCELED: [
    {
      to: "REVIEWING",
      roles: ["ADMIN"],
      actionLabel: "Reopen for review",
      requiresNote: true,
    },
  ],
};

export type TransitionContext = {
  status: OrderStatus;
  assignedExecutorId: string | null;
};

/** Transitions the given order-role may perform on the given order right now. */
export function listAllowedTransitions(
  order: TransitionContext,
  orderRole: UserRole,
): readonly OrderTransition[] {
  return ORDER_TRANSITIONS[order.status].filter((transition) => {
    if (!transition.roles.includes(orderRole)) return false;
    if (transition.requiresAssignedExecutor && order.assignedExecutorId === null) {
      return false;
    }
    return true;
  });
}

export function findAllowedTransition(
  order: TransitionContext,
  orderRole: UserRole,
  toStatus: OrderStatus,
): OrderTransition | null {
  return (
    listAllowedTransitions(order, orderRole).find(
      (transition) => transition.to === toStatus,
    ) ?? null
  );
}

export type TransitionRejection =
  { ok: true; transition: OrderTransition } | { ok: false; reason: string };

/**
 * Pure validation of a status change. The database mutation layer calls this
 * inside the transaction that also appends the history event.
 */
export function validateTransition(input: {
  order: TransitionContext;
  orderRole: UserRole;
  toStatus: OrderStatus;
  note: string | null;
}): TransitionRejection {
  if (input.order.status === input.toStatus) {
    return { ok: false, reason: "This project already has that status." };
  }

  const candidate = ORDER_TRANSITIONS[input.order.status].find(
    (transition) => transition.to === input.toStatus,
  );
  if (!candidate) {
    return {
      ok: false,
      reason: `${ORDER_STATUS_LABELS[input.order.status]} cannot move to ${ORDER_STATUS_LABELS[input.toStatus]}.`,
    };
  }

  if (!candidate.roles.includes(input.orderRole)) {
    return { ok: false, reason: "Your role cannot perform this transition." };
  }

  if (candidate.requiresAssignedExecutor && input.order.assignedExecutorId === null) {
    return {
      ok: false,
      reason: "Assign an executor before moving the project into development.",
    };
  }

  if (candidate.requiresNote && (input.note === null || input.note.length === 0)) {
    return { ok: false, reason: "A short note is required for this transition." };
  }

  return { ok: true, transition: candidate };
}
