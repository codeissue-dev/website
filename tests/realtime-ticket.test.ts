// The ticket helpers derive their key from AUTH_SECRET, and the shared env
// loader validates the whole server environment, so both variables are set for
// this unit test before any helper runs. They are test fixtures, not secrets.
process.env.AUTH_SECRET = "unit-test-secret-value-with-enough-length";
process.env.DATABASE_URL ??=
  "postgresql://codeissue:codeissue@127.0.0.1:5432/codeissue";

import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";

import type { ActorLike } from "../src/lib/auth/rbac";
import {
  issueRealtimeTicket,
  REALTIME_TICKET_TTL_SECONDS,
  verifyRealtimeTicket,
} from "../src/lib/realtime/ticket";

const actor: ActorLike = { id: randomUUID(), role: "EXECUTOR" };
const now = new Date("2026-03-01T12:00:00.000Z");

void test("a freshly issued ticket verifies to the same identity", () => {
  const { ticket, expiresAt } = issueRealtimeTicket(actor, now);
  const verified = verifyRealtimeTicket(ticket, now);

  assert.deepEqual(verified, actor);
  assert.equal(
    new Date(expiresAt).getTime(),
    now.getTime() + REALTIME_TICKET_TTL_SECONDS * 1000,
  );
});

void test("tickets expire", () => {
  const { ticket } = issueRealtimeTicket(actor, now);
  const justBefore = new Date(now.getTime() + (REALTIME_TICKET_TTL_SECONDS - 1) * 1000);
  const justAfter = new Date(now.getTime() + REALTIME_TICKET_TTL_SECONDS * 1000);

  assert.ok(verifyRealtimeTicket(ticket, justBefore));
  assert.equal(verifyRealtimeTicket(ticket, justAfter), null);
});

void test("a tampered payload fails the signature check", () => {
  const { ticket } = issueRealtimeTicket(actor, now);
  const [body, signature] = ticket.split(".");
  assert.ok(body);
  assert.ok(signature);

  const forgedBody = Buffer.from(
    JSON.stringify({
      v: "v1",
      sub: randomUUID(),
      role: "ADMIN",
      exp: Math.floor(now.getTime() / 1000) + 60,
    }),
    "utf8",
  ).toString("base64url");

  assert.equal(verifyRealtimeTicket(`${forgedBody}.${signature}`, now), null);
});

void test("an escalated role cannot be self-signed without the secret", () => {
  const forged = Buffer.from(
    JSON.stringify({ v: "v1", sub: actor.id, role: "ADMIN", exp: 4102444800 }),
    "utf8",
  ).toString("base64url");

  assert.equal(verifyRealtimeTicket(`${forged}.signature`, now), null);
});

void test("empty, malformed and unsigned tickets are rejected", () => {
  assert.equal(verifyRealtimeTicket(null, now), null);
  assert.equal(verifyRealtimeTicket("", now), null);
  assert.equal(verifyRealtimeTicket("no-separator", now), null);
  assert.equal(verifyRealtimeTicket(".onlysignature", now), null);
  assert.equal(verifyRealtimeTicket("not-base64url.also-not", now), null);
});
