import type { PoolClient } from "pg";

import type { ActorLike } from "@/lib/auth/rbac";
import { resolveOrderRole } from "@/lib/auth/rbac";
import { getPool } from "@/lib/db/client";
import { describeError, logger } from "@/lib/logger";
import {
  REALTIME_CHANNEL,
  parseOrderNotification,
  type OrderNotification,
  type ServerFrame,
} from "@/lib/realtime/events";
import { loadMessagePayload, loadStatusEventPayload } from "@/lib/realtime/payloads";

/**
 * Per-instance fan-out.
 *
 * This registry is explicitly *not* the delivery guarantee: it only knows the
 * sockets attached to the current runtime instance. Durability lives in
 * Postgres, and cross-instance delivery is a `LISTEN/NOTIFY` signal, so a
 * horizontally scaled deployment behaves correctly: every instance listens,
 * every instance forwards to its own sockets, and clients that miss a signal
 * recover through cursor backfill on reconnect.
 */
export type RealtimeSubscriber = {
  connectionId: string;
  actor: ActorLike;
  orderIds: Set<string>;
  send: (frame: ServerFrame) => void;
};

const LISTEN_RETRY_BASE_MS = 1_000;
const LISTEN_RETRY_MAX_MS = 30_000;

class RealtimeHub {
  private readonly subscribers = new Map<string, RealtimeSubscriber>();
  private client: PoolClient | null = null;
  private connecting: Promise<void> | null = null;
  private retryDelay = LISTEN_RETRY_BASE_MS;
  private retryTimer: NodeJS.Timeout | null = null;

  register(subscriber: RealtimeSubscriber): void {
    this.subscribers.set(subscriber.connectionId, subscriber);
  }

  unregister(connectionId: string): void {
    this.subscribers.delete(connectionId);
    if (this.subscribers.size === 0) {
      void this.stopListening();
    }
  }

  get connectionCount(): number {
    return this.subscribers.size;
  }

  /**
   * Acquires the dedicated LISTEN connection. Called only when a socket is
   * actually connected: importing this module never touches Postgres.
   */
  async ensureListening(): Promise<void> {
    if (this.client) return;
    this.connecting ??= this.startListening().finally(() => {
      this.connecting = null;
    });
    await this.connecting;
  }

  private async startListening(): Promise<void> {
    // `LISTEN` occupies a session, so it needs its own client checked out of
    // the shared pool rather than a pooled query.
    const client = await getPool().connect();

    client.on("notification", (message) => {
      if (message.channel !== REALTIME_CHANNEL) return;
      if (!message.payload) return;
      const notification = parseOrderNotification(message.payload);
      if (!notification) {
        logger.warn("discarded malformed realtime notification");
        return;
      }
      void this.fanOut(notification);
    });

    client.on("error", (error) => {
      logger.error("realtime listener connection error", describeError(error));
      this.handleListenerLoss();
    });

    client.on("end", () => {
      this.handleListenerLoss();
    });

    await client.query(`LISTEN ${REALTIME_CHANNEL}`);
    this.client = client;
    this.retryDelay = LISTEN_RETRY_BASE_MS;
    logger.info("realtime listener ready", { channel: REALTIME_CHANNEL });
  }

  private handleListenerLoss(): void {
    const lost = this.client;
    this.client = null;
    if (lost) lost.release();
    if (this.subscribers.size === 0) return;
    this.scheduleReconnect();
  }

  private scheduleReconnect(): void {
    if (this.retryTimer) return;
    const delay = this.retryDelay;
    this.retryDelay = Math.min(this.retryDelay * 2, LISTEN_RETRY_MAX_MS);
    this.retryTimer = setTimeout(() => {
      this.retryTimer = null;
      if (this.subscribers.size === 0) return;
      void this.ensureListening().catch((error: unknown) => {
        logger.error("realtime listener reconnect failed", describeError(error));
        this.scheduleReconnect();
      });
    }, delay);
    this.retryTimer.unref?.();
  }

  private async stopListening(): Promise<void> {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    const client = this.client;
    if (!client) return;
    this.client = null;
    try {
      await client.query(`UNLISTEN ${REALTIME_CHANNEL}`);
    } catch (error) {
      logger.warn("failed to unlisten cleanly", describeError(error));
    } finally {
      client.release();
    }
  }

  /**
   * Forwards one notification to the local sockets that are both subscribed to
   * the order and authorized to observe it. The authoritative row is read once
   * and only after at least one recipient passed the authorization check.
   */
  private async fanOut(notification: OrderNotification): Promise<void> {
    const recipients = [...this.subscribers.values()].filter((subscriber) => {
      if (!subscriber.orderIds.has(notification.orderId)) return false;
      return (
        resolveOrderRole(subscriber.actor, {
          customerId: notification.customerId,
          assignedExecutorId: notification.assignedExecutorId,
        }) !== null
      );
    });

    if (recipients.length === 0) return;

    try {
      const frame = await this.buildFrame(notification);
      if (!frame) return;
      for (const recipient of recipients) {
        recipient.send(frame);
      }
    } catch (error) {
      logger.error("realtime fan-out failed", describeError(error));
    }
  }

  private async buildFrame(
    notification: OrderNotification,
  ): Promise<ServerFrame | null> {
    if (notification.kind === "message") {
      const message = await loadMessagePayload(
        notification.orderId,
        notification.eventId,
      );
      if (!message) return null;
      return { type: "message", orderId: notification.orderId, message };
    }

    const event = await loadStatusEventPayload(
      notification.orderId,
      notification.eventId,
    );
    if (!event) return null;
    return {
      type: "status",
      orderId: notification.orderId,
      status: event.toStatus,
      event,
    };
  }
}

type HubSingleton = { hub: RealtimeHub };

declare global {
  var __codeissueRealtimeHub: HubSingleton | undefined;
}

/** One hub per runtime instance, cached across module re-evaluation. */
export function getRealtimeHub(): RealtimeHub {
  globalThis.__codeissueRealtimeHub ??= { hub: new RealtimeHub() };
  return globalThis.__codeissueRealtimeHub.hub;
}

export type { RealtimeHub };
