import { BACKFILL_PAGE_SIZE } from "@/lib/realtime/events";
import type { ChatMessagePayload, StatusEventPayload } from "@/lib/realtime/events";
import {
  firstMessageCreatedAt,
  listOrderMessages,
  loadOrderMessage,
  type OrderMessageWithSender,
} from "@/lib/chat/queries";
import { listStatusEvents, type StatusEventWithActor } from "@/lib/orders/queries";

/**
 * Mapping between database rows and the wire format.
 *
 * Kept in one place so page rendering, socket delivery and reconnect backfill
 * always produce byte-identical shapes.
 */
export function toChatMessagePayload(row: OrderMessageWithSender): ChatMessagePayload {
  return {
    id: row.id,
    orderId: row.orderId,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    sender: { id: row.senderId, name: row.senderName, role: row.senderRole },
  };
}

export function toStatusEventPayload(row: StatusEventWithActor): StatusEventPayload {
  return {
    id: row.id,
    orderId: row.orderId,
    fromStatus: row.fromStatus,
    toStatus: row.toStatus,
    note: row.note,
    createdAt: row.createdAt.toISOString(),
    actor: { id: row.actorId, name: row.actorName, role: row.actorRole },
  };
}

/**
 * Re-reads a message from Postgres before delivery. The NOTIFY payload only
 * carries identifiers, so the authoritative row is always fetched, and a
 * notification for a different order can never leak content.
 */
export async function loadMessagePayload(
  orderId: string,
  messageId: string,
): Promise<ChatMessagePayload | null> {
  const row = await loadOrderMessage(messageId);
  if (!row || row.orderId !== orderId) return null;
  return toChatMessagePayload(row);
}

export async function loadStatusEventPayload(
  orderId: string,
  eventId: string,
): Promise<StatusEventPayload | null> {
  const events = await listStatusEvents(orderId, { limit: BACKFILL_PAGE_SIZE });
  const row = events.find((event) => event.id === eventId);
  return row ? toStatusEventPayload(row) : null;
}

export type BackfillResult = {
  messages: ChatMessagePayload[];
  events: StatusEventPayload[];
  complete: boolean;
};

/**
 * Everything the client missed while it was disconnected.
 * `since` is the cursor of the newest event the client already holds.
 */
export async function loadBackfill(
  orderId: string,
  since: Date | null,
): Promise<BackfillResult> {
  const [messageRows, eventRows, oldestMessageAt] = await Promise.all([
    listOrderMessages(orderId, { since, limit: BACKFILL_PAGE_SIZE }),
    listStatusEvents(orderId, { since, limit: BACKFILL_PAGE_SIZE }),
    since === null ? firstMessageCreatedAt(orderId) : Promise.resolve(null),
  ]);

  const oldestReturned = messageRows[0]?.createdAt ?? null;
  const truncated =
    messageRows.length >= BACKFILL_PAGE_SIZE ||
    (since === null &&
      oldestMessageAt !== null &&
      oldestReturned !== null &&
      oldestMessageAt.getTime() < oldestReturned.getTime());

  return {
    messages: messageRows.map(toChatMessagePayload),
    events: eventRows.map(toStatusEventPayload),
    complete: !truncated,
  };
}
