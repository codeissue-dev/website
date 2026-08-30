"use client";

import "dotenv/config";

import { useEffect, useRef, useState } from "react";

import type { OrderStatus } from "@/lib/orders/status";
import {
  parseServerFrame,
  type ChatMessagePayload,
  type StatusEventPayload,
} from "@/lib/realtime/events";

export type ConnectionState = "connecting" | "open" | "reconnecting" | "offline";

const BASE_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 30_000;
const MAX_JITTER_MS = 250;

type Timestamped = { id: string; createdAt: string };

function compareTimestamped(left: Timestamped, right: Timestamped): number {
  if (left.createdAt !== right.createdAt) {
    return left.createdAt < right.createdAt ? -1 : 1;
  }
  if (left.id === right.id) return 0;
  return left.id < right.id ? -1 : 1;
}

/**
 * Merges incoming items into the current list, keyed by database id.
 *
 * This is the deduplication guarantee: the same row can arrive from the initial
 * server render, from a live notification and from a reconnect backfill, and it
 * is still shown once.
 */
function mergeById<T extends Timestamped>(current: T[], incoming: T[]): T[] {
  if (incoming.length === 0) return current;

  const known = new Map(current.map((item) => [item.id, item]));
  let added = false;
  for (const item of incoming) {
    if (known.has(item.id)) continue;
    known.set(item.id, item);
    added = true;
  }
  if (!added) return current;

  return Array.from(known.values()).sort(compareTimestamped);
}

function newestCursor(items: Timestamped[][]): string | null {
  let newest: string | null = null;
  for (const list of items) {
    for (const item of list) {
      if (newest === null || item.createdAt > newest) newest = item.createdAt;
    }
  }
  return newest;
}

function readTicket(value: unknown): string | null {
  if (typeof value !== "object" || value === null) return null;
  if (!("ticket" in value)) return null;
  const ticket = value.ticket;
  return typeof ticket === "string" && ticket.length > 0 ? ticket : null;
}

/**
 * Resolves the socket endpoint.
 *
 * `NEXT_PUBLIC_REALTIME_URL` points at a dedicated gateway (used in local
 * development and wherever the app is not hosted on a runtime that upgrades
 * connections itself). Without it the app's own `/api/realtime` route is used
 * on the current origin.
 */
function buildSocketUrl(ticket: string): string | null {
  const configured = process.env.NEXT_PUBLIC_REALTIME_URL;

  if (typeof configured === "string" && configured.length > 0) {
    try {
      const url = new URL(configured);
      if (url.protocol === "http:") url.protocol = "ws:";
      if (url.protocol === "https:") url.protocol = "wss:";
      if (url.pathname === "" || url.pathname === "/") url.pathname = "/api/realtime";
      url.searchParams.set("ticket", ticket);
      return url.toString();
    } catch {
      return null;
    }
  }

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${window.location.host}/api/realtime?ticket=${encodeURIComponent(ticket)}`;
}

export type OrderStreamInput = {
  orderId: string;
  initialStatus: OrderStatus;
  initialMessages: ChatMessagePayload[];
  initialEvents: StatusEventPayload[];
  initialHistoryComplete: boolean;
};

export type OrderStream = {
  connection: ConnectionState;
  status: OrderStatus;
  messages: ChatMessagePayload[];
  events: StatusEventPayload[];
  historyComplete: boolean;
  notice: string | null;
};

/**
 * Live view of one order.
 *
 * The socket is a delivery optimisation, never the source of truth: the page is
 * rendered from Postgres on the server, every frame is validated against the
 * shared protocol schema, and after any disconnect the client asks for what it
 * missed using the newest timestamp it already holds.
 */
export function useOrderStream(input: OrderStreamInput): OrderStream {
  const {
    orderId,
    initialStatus,
    initialMessages,
    initialEvents,
    initialHistoryComplete,
  } = input;

  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [messages, setMessages] = useState<ChatMessagePayload[]>(() =>
    [...initialMessages].sort(compareTimestamped),
  );
  const [events, setEvents] = useState<StatusEventPayload[]>(() =>
    [...initialEvents].sort(compareTimestamped),
  );
  const [historyComplete, setHistoryComplete] = useState(initialHistoryComplete);
  const [notice, setNotice] = useState<string | null>(null);

  const cursorRef = useRef<string | null>(
    newestCursor([initialMessages, initialEvents]),
  );

  // Keep the reconnect cursor in step with what is actually rendered.
  useEffect(() => {
    cursorRef.current = newestCursor([messages, events]);
  }, [messages, events]);

  useEffect(() => {
    let disposed = false;
    let fatal = false;
    let socket: WebSocket | null = null;
    let attempt = 0;
    let retryTimer: number | null = null;

    const clearRetry = () => {
      if (retryTimer !== null) {
        window.clearTimeout(retryTimer);
        retryTimer = null;
      }
    };

    const scheduleRetry = () => {
      if (disposed || fatal) return;
      const delay = Math.min(BASE_BACKOFF_MS * 2 ** attempt, MAX_BACKOFF_MS);
      attempt += 1;
      setConnection(window.navigator.onLine ? "reconnecting" : "offline");
      clearRetry();
      retryTimer = window.setTimeout(
        () => {
          void connect();
        },
        delay + Math.random() * MAX_JITTER_MS,
      );
    };

    const send = (target: WebSocket, frame: unknown) => {
      if (target.readyState !== WebSocket.OPEN) return;
      target.send(JSON.stringify(frame));
    };

    const handleFrame = (raw: string, target: WebSocket) => {
      const frame = parseServerFrame(raw);
      if (frame === null) return;

      switch (frame.type) {
        case "ready":
          setNotice(null);
          return;
        case "subscribed":
          if (frame.orderId === orderId) setStatus(frame.status);
          return;
        case "unsubscribed":
          return;
        case "message":
          if (frame.orderId !== orderId) return;
          setMessages((current) => mergeById(current, [frame.message]));
          return;
        case "status":
          if (frame.orderId !== orderId) return;
          setStatus(frame.status);
          setEvents((current) => mergeById(current, [frame.event]));
          return;
        case "backfill":
          if (frame.orderId !== orderId) return;
          setStatus(frame.status);
          setMessages((current) => mergeById(current, frame.messages));
          setEvents((current) => mergeById(current, frame.events));
          if (frame.complete) setHistoryComplete(true);
          return;
        case "ping":
          send(target, { type: "pong" });
          return;
        case "error":
          if (frame.code === "UNAUTHORIZED" || frame.code === "NOT_FOUND") {
            // Retrying cannot fix either case; stop and tell the reader.
            fatal = true;
            clearRetry();
            setNotice("The live connection was refused. Reload the page to continue.");
            setConnection("offline");
            target.close(1000, "refused");
            return;
          }
          if (frame.code === "RATE_LIMITED") {
            setNotice("Slow down for a moment: too many live requests.");
            return;
          }
          setNotice(null);
          return;
      }
    };

    const connect = async () => {
      if (disposed || fatal) return;
      if (socket !== null) return;
      if (!window.navigator.onLine) {
        setConnection("offline");
        return;
      }

      setConnection((current) => (current === "open" ? "reconnecting" : current));

      let ticket: string | null = null;
      try {
        const response = await fetch("/api/realtime/ticket", {
          method: "POST",
          cache: "no-store",
        });
        if (response.status === 401) {
          fatal = true;
          setNotice("Your session expired. Sign in again to reconnect.");
          setConnection("offline");
          return;
        }
        if (!response.ok) {
          scheduleRetry();
          return;
        }
        ticket = readTicket(await response.json());
      } catch {
        scheduleRetry();
        return;
      }

      if (disposed || fatal) return;
      if (ticket === null) {
        scheduleRetry();
        return;
      }

      const url = buildSocketUrl(ticket);
      if (url === null) {
        fatal = true;
        setNotice("The live connection is not configured for this deployment.");
        setConnection("offline");
        return;
      }

      const next = new WebSocket(url);
      socket = next;

      next.onopen = () => {
        if (disposed) {
          next.close(1000, "unmounted");
          return;
        }
        attempt = 0;
        setConnection("open");
        send(next, { type: "subscribe", orderId, since: cursorRef.current });
      };

      next.onmessage = (event: MessageEvent<unknown>) => {
        if (typeof event.data !== "string") return;
        handleFrame(event.data, next);
      };

      next.onerror = () => {
        // `onclose` always follows, and owns the retry decision.
        next.close();
      };

      next.onclose = () => {
        if (socket === next) socket = null;
        if (disposed || fatal) return;
        scheduleRetry();
      };
    };

    const retryNow = () => {
      if (disposed || fatal || socket !== null) return;
      clearRetry();
      attempt = 0;
      void connect();
    };

    const handleOnline = () => {
      retryNow();
    };

    const handleOffline = () => {
      setConnection("offline");
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") retryNow();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("visibilitychange", handleVisibility);

    void connect();

    return () => {
      disposed = true;
      clearRetry();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (socket !== null) {
        socket.onclose = null;
        socket.close(1000, "unmounted");
        socket = null;
      }
    };
  }, [orderId]);

  return { connection, status, messages, events, historyComplete, notice };
}
