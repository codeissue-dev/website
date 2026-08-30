import assert from "node:assert/strict";
import { test } from "node:test";

import {
  ACTIVE_ORDER_STATUSES,
  findAllowedTransition,
  listAllowedTransitions,
  ORDER_STATUS_LABELS,
  ORDER_STATUSES,
  ORDER_TRANSITIONS,
  TERMINAL_ORDER_STATUSES,
  validateTransition,
} from "../src/lib/orders/status";

void test("every status has a label, a transition list and a lifecycle group", () => {
  for (const status of ORDER_STATUSES) {
    assert.equal(typeof ORDER_STATUS_LABELS[status], "string");
    assert.ok(Array.isArray(ORDER_TRANSITIONS[status]));
    const grouped =
      ACTIVE_ORDER_STATUSES.includes(status) ||
      TERMINAL_ORDER_STATUSES.includes(status);
    assert.ok(grouped, `${status} belongs to no lifecycle group`);
  }
});

void test("transition targets are real statuses and never self-referential", () => {
  for (const status of ORDER_STATUSES) {
    for (const transition of ORDER_TRANSITIONS[status]) {
      assert.ok(
        ORDER_STATUSES.includes(transition.to),
        `${status} -> ${transition.to} is not a known status`,
      );
      assert.notEqual(transition.to, status);
      assert.ok(
        transition.roles.length > 0,
        `${status} -> ${transition.to} has no roles`,
      );
    }
  }
});

void test("a customer cannot move their own request into development", () => {
  const result = validateTransition({
    order: { status: "SUBMITTED", assignedExecutorId: null },
    orderRole: "CUSTOMER",
    toStatus: "IN_PROGRESS",
    note: null,
  });
  assert.equal(result.ok, false);
});

void test("an executor cannot mark a project as delivered", () => {
  const result = validateTransition({
    order: { status: "QUALITY_ASSURANCE", assignedExecutorId: "executor-1" },
    orderRole: "EXECUTOR",
    toStatus: "COMPLETED",
    note: null,
  });
  assert.equal(result.ok, false);
});

void test("an administrator marks a project as delivered from QA", () => {
  const result = validateTransition({
    order: { status: "QUALITY_ASSURANCE", assignedExecutorId: "executor-1" },
    orderRole: "ADMIN",
    toStatus: "COMPLETED",
    note: null,
  });
  assert.equal(result.ok, true);
});

void test("development requires an assigned executor", () => {
  const unassigned = validateTransition({
    order: { status: "ACCEPTED", assignedExecutorId: null },
    orderRole: "ADMIN",
    toStatus: "IN_PROGRESS",
    note: null,
  });
  assert.equal(unassigned.ok, false);

  const assigned = validateTransition({
    order: { status: "ACCEPTED", assignedExecutorId: "executor-1" },
    orderRole: "ADMIN",
    toStatus: "IN_PROGRESS",
    note: null,
  });
  assert.equal(assigned.ok, true);
});

void test("transitions that require a note reject an empty note", () => {
  const withoutNote = validateTransition({
    order: { status: "IN_PROGRESS", assignedExecutorId: "executor-1" },
    orderRole: "EXECUTOR",
    toStatus: "WAITING_FOR_CUSTOMER",
    note: "",
  });
  assert.equal(withoutNote.ok, false);

  const withNote = validateTransition({
    order: { status: "IN_PROGRESS", assignedExecutorId: "executor-1" },
    orderRole: "EXECUTOR",
    toStatus: "WAITING_FOR_CUSTOMER",
    note: "Waiting for the payment provider credentials.",
  });
  assert.equal(withNote.ok, true);
});

void test("a status cannot transition to itself", () => {
  const result = validateTransition({
    order: { status: "IN_PROGRESS", assignedExecutorId: "executor-1" },
    orderRole: "ADMIN",
    toStatus: "IN_PROGRESS",
    note: null,
  });
  assert.equal(result.ok, false);
});

void test("COMPLETED is terminal and offers no transitions to anybody", () => {
  assert.equal(ORDER_TRANSITIONS.COMPLETED.length, 0);
  for (const role of ["ADMIN", "EXECUTOR", "CUSTOMER"] as const) {
    assert.equal(
      listAllowedTransitions({ status: "COMPLETED", assignedExecutorId: null }, role)
        .length,
      0,
    );
  }
});

void test("findAllowedTransition mirrors listAllowedTransitions", () => {
  const order = { status: "SUBMITTED", assignedExecutorId: null } as const;
  const allowed = listAllowedTransitions(order, "ADMIN");
  for (const transition of allowed) {
    assert.equal(findAllowedTransition(order, "ADMIN", transition.to), transition);
  }
  assert.equal(findAllowedTransition(order, "ADMIN", "COMPLETED"), null);
});
