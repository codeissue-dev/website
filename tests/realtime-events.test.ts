import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";

import {
  encodeServerFrame,
  MAX_CLIENT_FRAME_BYTES,
  parseClientFrame,
  parseOrderNotification,
  parseServerFrame,
  REALTIME_PROTOCOL_VERSION,
  serverFrameEventId,
  type ChatMessagePayload,
  type StatusEventPayload,
} from "../src/lib/realtime/events";

const orderId = randomUUID();
const createdAt = new Date("2026-05-04T10:11:12.000Z").toISOString();

function chatMessage(): ChatMessagePayload {
  return {
    id: randomUUID(),
    orderId,
    body: "The staging environment is ready for review.",
    createdAt,
    sender: { id: randomUUID(), name: "Dana", role: "EXECUTOR" },
  };
}

function statusEvent(): StatusEventPayload {
  return {
    id: randomUUID(),
    orderId,
    fromStatus: "ACCEPTED",
    toStatus: "IN_PROGRESS",
    note: null,
    createdAt,
    actor: { id: randomUUID(), name: null, role: "ADMIN" },
  };
}

void test("subscribe frames parse and default the cursor to null", () => {
  const frame = parseClientFrame(JSON.stringify({ type: "subscribe", orderId }));
  assert.ok(frame);
  assert.equal(frame.type, "subscribe");
  if (frame.type === "subscribe") {
    assert.equal(frame.orderId, orderId);
    assert.equal(frame.since, null);
  }
});

void test("backfill frames keep an explicit cursor", () => {
  const frame = parseClientFrame(
    JSON.stringify({ type: "backfill", orderId, since: createdAt }),
  );
  assert.ok(frame);
  if (frame.type === "backfill") {
    assert.equal(frame.since, createdAt);
  }
});

void test("malformed, unknown and non-uuid client frames are rejected", () => {
  assert.equal(parseClientFrame("not json"), null);
  assert.equal(parseClientFrame(JSON.stringify({ type: "drop-table" })), null);
  assert.equal(
    parseClientFrame(
      JSON.stringify({ type: "subscribe", orderId: "../../etc/passwd" }),
    ),
    null,
  );
  assert.equal(
    parseClientFrame(
      JSON.stringify({ type: "subscribe", orderId, since: "yesterday" }),
    ),
    null,
  );
});

void test("server frames survive an encode/parse round trip", () => {
  const message = chatMessage();
  const encoded = encodeServerFrame({ type: "message", orderId, message });
  assert.ok(encoded.length < MAX_CLIENT_FRAME_BYTES);

  const parsed = parseServerFrame(encoded);
  assert.ok(parsed);
  assert.deepEqual(parsed, { type: "message", orderId, message });
});

void test("ready frames pin the protocol version", () => {
  const parsed = parseServerFrame(
    encodeServerFrame({
      type: "ready",
      v: REALTIME_PROTOCOL_VERSION,
      userId: randomUUID(),
      role: "CUSTOMER",
      serverTime: createdAt,
    }),
  );
  assert.ok(parsed);

  const wrongVersion = parseServerFrame(
    JSON.stringify({
      type: "ready",
      v: REALTIME_PROTOCOL_VERSION + 1,
      userId: randomUUID(),
      role: "CUSTOMER",
      serverTime: createdAt,
    }),
  );
  assert.equal(wrongVersion, null);
});

void test("event ids identify replayable frames only", () => {
  const message = chatMessage();
  const event = statusEvent();
  assert.equal(
    serverFrameEventId({ type: "message", orderId, message }),
    `message:${message.id}`,
  );
  assert.equal(
    serverFrameEventId({ type: "status", orderId, status: "IN_PROGRESS", event }),
    `status:${event.id}`,
  );
  assert.equal(serverFrameEventId({ type: "ping", at: createdAt }), null);
});

void test("notifications carry identifiers and participants, not content", () => {
  const payload = {
    v: REALTIME_PROTOCOL_VERSION,
    kind: "message",
    orderId,
    eventId: randomUUID(),
    createdAt,
    customerId: randomUUID(),
    assignedExecutorId: null,
  };
  const parsed = parseOrderNotification(JSON.stringify(payload));
  assert.ok(parsed);
  assert.equal(parsed.kind, "message");
  assert.ok(!Object.hasOwn(parsed, "body"));

  assert.equal(parseOrderNotification(JSON.stringify({ ...payload, v: 99 })), null);
  assert.equal(
    parseOrderNotification(JSON.stringify({ ...payload, kind: "other" })),
    null,
  );
});
