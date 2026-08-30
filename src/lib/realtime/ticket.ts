import { createHmac, timingSafeEqual } from "node:crypto";

import type { ActorLike } from "@/lib/auth/rbac";
import { toUserRoleOrDefault, type UserRole } from "@/lib/auth/roles";
import { getServerEnv } from "@/lib/env";

/**
 * Short-lived WebSocket tickets.
 *
 * The browser WebSocket API cannot send an Authorization header, and the
 * realtime gateway may run on a different origin than the app, so the session
 * cookie is not guaranteed to be attached. The page therefore exchanges its
 * server session for a signed, single-purpose, one-minute ticket that the
 * socket presents as a query parameter.
 *
 * The ticket only carries an identity claim; every order subscription is still
 * authorized against Postgres.
 */
const TICKET_VERSION = "v1";
const TICKET_TTL_SECONDS = 60;
const TICKET_KEY_INFO = "codeissue:realtime-ticket:v1";

type TicketPayload = {
  v: typeof TICKET_VERSION;
  sub: string;
  role: UserRole;
  exp: number;
};

function ticketKey(): Buffer {
  // Derived from AUTH_SECRET so tickets are useless for anything else.
  return createHmac("sha256", getServerEnv().AUTH_SECRET)
    .update(TICKET_KEY_INFO)
    .digest();
}

function encodeSegment(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function sign(body: string): string {
  return createHmac("sha256", ticketKey()).update(body).digest("base64url");
}

export function issueRealtimeTicket(
  actor: ActorLike,
  now: Date = new Date(),
): { ticket: string; expiresAt: string } {
  const payload: TicketPayload = {
    v: TICKET_VERSION,
    sub: actor.id,
    role: actor.role,
    exp: Math.floor(now.getTime() / 1000) + TICKET_TTL_SECONDS,
  };
  const body = encodeSegment(JSON.stringify(payload));
  return {
    ticket: `${body}.${sign(body)}`,
    expiresAt: new Date(payload.exp * 1000).toISOString(),
  };
}

function parsePayload(raw: string): TicketPayload | null {
  let decoded: unknown;
  try {
    decoded = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (typeof decoded !== "object" || decoded === null) return null;
  const candidate: { v?: unknown; sub?: unknown; role?: unknown; exp?: unknown } =
    decoded;
  if (candidate.v !== TICKET_VERSION) return null;
  if (typeof candidate.sub !== "string" || candidate.sub.length === 0) return null;
  if (typeof candidate.exp !== "number" || !Number.isFinite(candidate.exp)) return null;

  return {
    v: TICKET_VERSION,
    sub: candidate.sub,
    role: toUserRoleOrDefault(candidate.role),
    exp: candidate.exp,
  };
}

export function verifyRealtimeTicket(
  ticket: string | null,
  now: Date = new Date(),
): ActorLike | null {
  if (!ticket) return null;

  const separator = ticket.lastIndexOf(".");
  if (separator <= 0) return null;

  const body = ticket.slice(0, separator);
  const signature = ticket.slice(separator + 1);

  const expected = Buffer.from(sign(body), "utf8");
  const provided = Buffer.from(signature, "utf8");
  if (expected.length !== provided.length) return null;
  if (!timingSafeEqual(expected, provided)) return null;

  const payload = parsePayload(body);
  if (!payload) return null;
  if (payload.exp * 1000 <= now.getTime()) return null;

  return { id: payload.sub, role: payload.role };
}

export const REALTIME_TICKET_TTL_SECONDS = TICKET_TTL_SECONDS;
