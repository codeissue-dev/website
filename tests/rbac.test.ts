import assert from "node:assert/strict";
import { test } from "node:test";

import {
  assertCanAssignExecutors,
  assertCanManagePublicContent,
  assertCanManageUsers,
  canAssignExecutors,
  canManagePublicContent,
  canManageUsers,
  canParticipateInOrderChat,
  canReadOrder,
  canViewAllOrders,
  resolveOrderRole,
  transitionsAvailableTo,
  type ActorLike,
  type OrderAccessContext,
} from "../src/lib/auth/rbac";
import { ForbiddenError } from "../src/lib/errors";

const customer: ActorLike = { id: "customer-1", role: "CUSTOMER" };
const otherCustomer: ActorLike = { id: "customer-2", role: "CUSTOMER" };
const executor: ActorLike = { id: "executor-1", role: "EXECUTOR" };
const otherExecutor: ActorLike = { id: "executor-2", role: "EXECUTOR" };
const admin: ActorLike = { id: "admin-1", role: "ADMIN" };

const order: OrderAccessContext = {
  status: "IN_PROGRESS",
  customerId: customer.id,
  assignedExecutorId: executor.id,
};

void test("order roles are resolved from the relationship, not from the global role", () => {
  assert.equal(resolveOrderRole(customer, order), "CUSTOMER");
  assert.equal(resolveOrderRole(executor, order), "EXECUTOR");
  assert.equal(resolveOrderRole(admin, order), "ADMIN");
  assert.equal(resolveOrderRole(otherCustomer, order), null);
  assert.equal(resolveOrderRole(otherExecutor, order), null);
});

void test("an unrelated customer can neither read nor talk in someone else's project", () => {
  assert.equal(canReadOrder(otherCustomer, order), false);
  assert.equal(canParticipateInOrderChat(otherCustomer, order), false);
  assert.deepEqual([...transitionsAvailableTo(otherCustomer, order)], []);
});

void test("an executor loses access when the assignment is removed", () => {
  const unassigned: OrderAccessContext = { ...order, assignedExecutorId: null };

  assert.equal(canReadOrder(executor, order), true);
  assert.equal(canReadOrder(executor, unassigned), false);
  assert.equal(canParticipateInOrderChat(executor, unassigned), false);
  assert.deepEqual([...transitionsAvailableTo(executor, unassigned)], []);
});

void test("a customer is never offered a staff-only transition", () => {
  const offered = transitionsAvailableTo(customer, order).map(
    (transition) => transition.to,
  );

  assert.ok(!offered.includes("QUALITY_ASSURANCE"));
  assert.ok(!offered.includes("COMPLETED"));
});

void test("an assigned executor may move work forward but not deliver it", () => {
  const offered = transitionsAvailableTo(executor, order).map(
    (transition) => transition.to,
  );

  assert.ok(offered.includes("QUALITY_ASSURANCE"));
  assert.ok(!offered.includes("COMPLETED"));
});

void test("administration is limited to administrators", () => {
  for (const actor of [customer, executor]) {
    assert.equal(canViewAllOrders(actor), false);
    assert.equal(canAssignExecutors(actor), false);
    assert.equal(canManageUsers(actor), false);
    assert.equal(canManagePublicContent(actor), false);
  }

  assert.equal(canViewAllOrders(admin), true);
  assert.equal(canAssignExecutors(admin), true);
  assert.equal(canManageUsers(admin), true);
  assert.equal(canManagePublicContent(admin), true);
});

void test("assertions throw ForbiddenError for non-administrators", () => {
  assert.throws(() => assertCanAssignExecutors(executor), ForbiddenError);
  assert.throws(() => assertCanManageUsers(customer), ForbiddenError);
  assert.throws(() => assertCanManagePublicContent(executor), ForbiddenError);

  assertCanAssignExecutors(admin);
  assertCanManageUsers(admin);
  assertCanManagePublicContent(admin);
});

void test("a customer cannot reach another project by guessing identifiers", () => {
  const foreign: OrderAccessContext = {
    status: "SUBMITTED",
    customerId: otherCustomer.id,
    assignedExecutorId: null,
  };

  assert.equal(resolveOrderRole(customer, foreign), null);
  assert.equal(canReadOrder(customer, foreign), false);
});
