import { randomUUID } from "node:crypto";

import type { ActorLike } from "@/lib/auth/rbac";
import { describeError, logger } from "@/lib/logger";
import { authorizeOrderAccess } from "@/lib/orders/queries";
import {
  MAX_CLIENT_FRAME_BYTES,
  REALTIME_PROTOCOL_VERSION,
  encodeServerFrame,
  parseClientFrame,
  type ServerFrame,
} from "@/lib/realtime/events";
import { getRealtimeHub } from "@/lib/realtime/hub";
import { loadBackfill } from "@/lib/realtime/payloads";

/**
 * Transport-independent realtime connection controller.
 *
 * The same logic drives the Vercel WebSocket endpoint and the standalone `ws`
 * gateway used for local development and self-hosting, so authorization,
 * heartbeats, limits and backfill exist in exactly one place.
 */
export type RealtimeTransport = {
  send: (data: string) => void;
  close: (code: number, reason: string) => void;
};

export type RealtimeConnection = {
  readonly connectionId: string;
  start: () => Promise<void>;
  handleRawFrame: (raw: string) => Promise<void>;
  dispose: () => void;
};

const HEARTBEAT_INTERVAL_MS = 30_000;
/** Two missed heartbeats plus slack before the socket is considered dead. */
const HEARTBEAT_TIMEOUT_MS = 75_000;
const MAX_SUBSCRIPTIONS = 20;
const FRAME_WINDOW_MS = 10_000;
const FRAME_BUDGET_PER_WINDOW = 40;

const CLOSE_HEARTBEAT_TIMEOUT = 4008;
const CLOSE_POLICY_VIOLATION = 4003;

export function createRealtimeConnection(input: {
  actor: ActorLike;
  transport: RealtimeTransport;
}): RealtimeConnection {
  const connectionId = randomUUID();
  const orderIds = new Set<string>();
  const hub = getRealtimeHub();

  let disposed = false;
  let lastSeenAt = Date.now();
  let windowStartedAt = Date.now();
  let framesInWindow = 0;
  let heartbeat: NodeJS.Timeout | null = null;

  const send = (frame: ServerFrame): void => {
    if (disposed) return;
    try {
      input.transport.send(encodeServerFrame(frame));
    } catch (error) {
      logger.warn("realtime send failed", describeError(error));
    }
  };

  const fail = (
    code:
      | "INVALID_FRAME"
      | "FRAME_TOO_LARGE"
      | "UNAUTHORIZED"
      | "NOT_FOUND"
      | "RATE_LIMITED"
      | "INTERNAL",
    message: string,
  ): void => {
    send({ type: "error", code, message });
  };

  const withinRateLimit = (): boolean => {
    const now = Date.now();
    if (now - windowStartedAt > FRAME_WINDOW_MS) {
      windowStartedAt = now;
      framesInWindow = 0;
    }
    framesInWindow += 1;
    return framesInWindow <= FRAME_BUDGET_PER_WINDOW;
  };

  /**
   * Re-checks every active subscription against Postgres. Roles and assignments
   * change while a socket is open, and a long-lived connection must lose access
   * as soon as the database says so.
   */
  const revalidateSubscriptions = async (): Promise<void> => {
    for (const orderId of [...orderIds]) {
      const access = await authorizeOrderAccess(input.actor, orderId);
      if (!access) {
        orderIds.delete(orderId);
        send({ type: "unsubscribed", orderId });
      }
    }
  };

  const startHeartbeat = (): void => {
    heartbeat = setInterval(() => {
      if (disposed) return;
      if (Date.now() - lastSeenAt > HEARTBEAT_TIMEOUT_MS) {
        input.transport.close(CLOSE_HEARTBEAT_TIMEOUT, "heartbeat timeout");
        dispose();
        return;
      }
      send({ type: "ping", at: new Date().toISOString() });
      void revalidateSubscriptions().catch((error: unknown) => {
        logger.error("subscription revalidation failed", describeError(error));
      });
    }, HEARTBEAT_INTERVAL_MS);
    heartbeat.unref?.();
  };

  function dispose(): void {
    if (disposed) return;
    disposed = true;
    if (heartbeat) {
      clearInterval(heartbeat);
      heartbeat = null;
    }
    orderIds.clear();
    hub.unregister(connectionId);
  }

  const subscribe = async (orderId: string, since: string | null): Promise<void> => {
    if (orderIds.size >= MAX_SUBSCRIPTIONS && !orderIds.has(orderId)) {
      fail("RATE_LIMITED", "Too many active subscriptions on this connection.");
      return;
    }

    // Authorization always comes from the database, never from the client.
    const access = await authorizeOrderAccess(input.actor, orderId);
    if (!access) {
      fail("NOT_FOUND", "That project is not available.");
      return;
    }

    orderIds.add(orderId);
    send({ type: "subscribed", orderId, status: access.status });
    await sendBackfill(orderId, since, access.status);
  };

  const sendBackfill = async (
    orderId: string,
    since: string | null,
    status: Awaited<ReturnType<typeof authorizeOrderAccess>> extends null
      ? never
      : NonNullable<Awaited<ReturnType<typeof authorizeOrderAccess>>>["status"],
  ): Promise<void> => {
    const cursor = since === null ? null : new Date(since);
    const backfill = await loadBackfill(
      orderId,
      cursor && !Number.isNaN(cursor.getTime()) ? cursor : null,
    );

    send({
      type: "backfill",
      orderId,
      status,
      messages: backfill.messages,
      events: backfill.events,
      complete: backfill.complete,
    });
  };

  const handleRawFrame = async (raw: string): Promise<void> => {
    if (disposed) return;
    lastSeenAt = Date.now();

    if (Buffer.byteLength(raw, "utf8") > MAX_CLIENT_FRAME_BYTES) {
      fail("FRAME_TOO_LARGE", "Message exceeds the allowed size.");
      return;
    }

    if (!withinRateLimit()) {
      fail("RATE_LIMITED", "Slow down and try again shortly.");
      return;
    }

    const frame = parseClientFrame(raw);
    if (!frame) {
      fail("INVALID_FRAME", "Unrecognized message.");
      return;
    }

    try {
      switch (frame.type) {
        case "pong":
          return;
        case "subscribe":
          await subscribe(frame.orderId, frame.since);
          return;
        case "unsubscribe":
          orderIds.delete(frame.orderId);
          send({ type: "unsubscribed", orderId: frame.orderId });
          return;
        case "backfill": {
          if (!orderIds.has(frame.orderId)) {
            fail("UNAUTHORIZED", "Subscribe to the project first.");
            return;
          }
          const access = await authorizeOrderAccess(input.actor, frame.orderId);
          if (!access) {
            orderIds.delete(frame.orderId);
            fail("NOT_FOUND", "That project is not available.");
            return;
          }
          await sendBackfill(frame.orderId, frame.since, access.status);
          return;
        }
      }
    } catch (error) {
      // Never surface driver or SQL detail to a socket client.
      logger.error("realtime frame handling failed", describeError(error));
      fail("INTERNAL", "The request could not be completed.");
    }
  };

  const start = async (): Promise<void> => {
    try {
      await hub.ensureListening();
    } catch (error) {
      logger.error("realtime listener unavailable", describeError(error));
      fail("INTERNAL", "Realtime updates are temporarily unavailable.");
      input.transport.close(CLOSE_POLICY_VIOLATION, "listener unavailable");
      dispose();
      return;
    }

    hub.register({
      connectionId,
      actor: input.actor,
      orderIds,
      send,
    });

    send({
      type: "ready",
      v: REALTIME_PROTOCOL_VERSION,
      userId: input.actor.id,
      role: input.actor.role,
      serverTime: new Date().toISOString(),
    });

    startHeartbeat();
  };

  return { connectionId, start, handleRawFrame, dispose };
}
