import { z } from "zod";

import { ORDER_STATUSES } from "@/lib/orders/status";
import { USER_ROLES } from "@/lib/auth/roles";

/**
 * Realtime protocol.
 *
 * One typed envelope for both directions, validated with Zod on the server
 * (hostile input) and on the client (defensive: a proxy or a stale deployment
 * must never crash the UI).
 */
export const REALTIME_PROTOCOL_VERSION = 1;

/** Postgres LISTEN/NOTIFY channel used for cross-instance fan-out. */
export const REALTIME_CHANNEL = "codeissue_order_events";

/** Inbound frames are hard-capped well below the transport limit. */
export const MAX_CLIENT_FRAME_BYTES = 8 * 1024;

/** WebSocket receive limit configured on the server side. */
export const MAX_SOCKET_PAYLOAD_BYTES = 256 * 1024;

/** Postgres truncates NOTIFY payloads at 8000 bytes; identifiers only. */
export const MAX_NOTIFY_PAYLOAD_BYTES = 6_000;

export const BACKFILL_PAGE_SIZE = 200;

const isoDateTime = z
  .string()
  .min(20)
  .max(40)
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid timestamp");

const orderStatus = z.enum(ORDER_STATUSES);
const userRole = z.enum(USER_ROLES);

/* -------------------------------------------------------------------------- */
/* Payloads                                                                   */
/* -------------------------------------------------------------------------- */

export const chatMessagePayloadSchema = z.object({
  id: z.uuid(),
  orderId: z.uuid(),
  body: z.string().min(1).max(4000),
  createdAt: isoDateTime,
  sender: z.object({
    id: z.uuid(),
    name: z.string().max(200).nullable(),
    role: userRole,
  }),
});

export type ChatMessagePayload = z.infer<typeof chatMessagePayloadSchema>;

export const statusEventPayloadSchema = z.object({
  id: z.uuid(),
  orderId: z.uuid(),
  fromStatus: orderStatus.nullable(),
  toStatus: orderStatus,
  note: z.string().max(1000).nullable(),
  createdAt: isoDateTime,
  actor: z.object({
    id: z.uuid(),
    name: z.string().max(200).nullable(),
    role: userRole,
  }),
});

export type StatusEventPayload = z.infer<typeof statusEventPayloadSchema>;

/* -------------------------------------------------------------------------- */
/* Client -> server                                                           */
/* -------------------------------------------------------------------------- */

export const clientFrameSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("subscribe"),
    orderId: z.uuid(),
    /** Cursor of the newest event the client already has, if any. */
    since: isoDateTime.nullable().default(null),
  }),
  z.object({ type: z.literal("unsubscribe"), orderId: z.uuid() }),
  z.object({
    type: z.literal("backfill"),
    orderId: z.uuid(),
    since: isoDateTime.nullable().default(null),
  }),
  z.object({ type: z.literal("pong") }),
]);

export type ClientFrame = z.infer<typeof clientFrameSchema>;

/* -------------------------------------------------------------------------- */
/* Server -> client                                                           */
/* -------------------------------------------------------------------------- */

export const serverFrameSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("ready"),
    v: z.literal(REALTIME_PROTOCOL_VERSION),
    userId: z.uuid(),
    role: userRole,
    serverTime: isoDateTime,
  }),
  z.object({
    type: z.literal("subscribed"),
    orderId: z.uuid(),
    status: orderStatus,
  }),
  z.object({ type: z.literal("unsubscribed"), orderId: z.uuid() }),
  z.object({
    type: z.literal("message"),
    orderId: z.uuid(),
    message: chatMessagePayloadSchema,
  }),
  z.object({
    type: z.literal("status"),
    orderId: z.uuid(),
    status: orderStatus,
    event: statusEventPayloadSchema,
  }),
  z.object({
    type: z.literal("backfill"),
    orderId: z.uuid(),
    status: orderStatus,
    messages: z.array(chatMessagePayloadSchema).max(BACKFILL_PAGE_SIZE),
    events: z.array(statusEventPayloadSchema).max(BACKFILL_PAGE_SIZE),
    /** False when more history exists before the returned window. */
    complete: z.boolean(),
  }),
  z.object({ type: z.literal("ping"), at: isoDateTime }),
  z.object({
    type: z.literal("error"),
    code: z.enum([
      "INVALID_FRAME",
      "FRAME_TOO_LARGE",
      "UNAUTHORIZED",
      "NOT_FOUND",
      "RATE_LIMITED",
      "INTERNAL",
    ]),
    message: z.string().max(200),
  }),
]);

export type ServerFrame = z.infer<typeof serverFrameSchema>;

/* -------------------------------------------------------------------------- */
/* Postgres notification envelope                                             */
/* -------------------------------------------------------------------------- */

/**
 * NOTIFY carries identifiers only: it is a wake-up signal, not storage. The
 * receiving instance reads the authoritative row from Postgres before sending
 * anything to a socket.
 */
export const orderNotificationSchema = z.object({
  v: z.literal(REALTIME_PROTOCOL_VERSION),
  kind: z.enum(["message", "status"]),
  orderId: z.uuid(),
  eventId: z.uuid(),
  createdAt: isoDateTime,
  /** Denormalized participants so fan-out needs no extra query. */
  customerId: z.uuid(),
  assignedExecutorId: z.uuid().nullable(),
});

export type OrderNotification = z.infer<typeof orderNotificationSchema>;

/* -------------------------------------------------------------------------- */
/* Encoding helpers                                                           */
/* -------------------------------------------------------------------------- */

export function encodeServerFrame(frame: ServerFrame): string {
  return JSON.stringify(frame);
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function parseClientFrame(raw: string): ClientFrame | null {
  const parsed = clientFrameSchema.safeParse(parseJson(raw));
  return parsed.success ? parsed.data : null;
}

export function parseServerFrame(raw: string): ServerFrame | null {
  const parsed = serverFrameSchema.safeParse(parseJson(raw));
  return parsed.success ? parsed.data : null;
}

export function parseOrderNotification(raw: string): OrderNotification | null {
  const parsed = orderNotificationSchema.safeParse(parseJson(raw));
  return parsed.success ? parsed.data : null;
}

/** Stable identity used by the client to drop duplicates after a reconnect. */
export function serverFrameEventId(frame: ServerFrame): string | null {
  if (frame.type === "message") return `message:${frame.message.id}`;
  if (frame.type === "status") return `status:${frame.event.id}`;
  return null;
}
