import { experimental_upgradeWebSocket, type WebSocketData } from "@vercel/functions";

import { describeError, logger } from "@/lib/logger";
import { createRealtimeConnection } from "@/lib/realtime/connection";
import { MAX_SOCKET_PAYLOAD_BYTES } from "@/lib/realtime/events";
import { verifyRealtimeTicket } from "@/lib/realtime/ticket";

/**
 * WebSocket endpoint for Vercel deployments.
 *
 * Per current Vercel documentation, `experimental_upgradeWebSocket()` is the
 * supported way to accept an upgrade from a Next.js Route Handler. It requires
 * the `ws` package in the project and Fluid compute to be enabled (the default
 * for projects created on or after 23 April 2025, including Hobby).
 *
 * A connection is pinned to one function instance, which is exactly why local
 * memory is never treated as the delivery guarantee: durability is Postgres,
 * cross-instance fan-out is LISTEN/NOTIFY, and clients recover missed events
 * with a cursor backfill after reconnecting.
 *
 * `next dev` does not implement WebSocket upgrades, so locally the standalone
 * gateway in `server/realtime/standalone.ts` serves the same protocol.
 */
export const runtime = "nodejs";
// The upgrade must happen at request time, never during prerendering.
export const dynamic = "force-dynamic";

function decodeFrame(data: WebSocketData): string | null {
  if (typeof data === "string") return data;
  if (Buffer.isBuffer(data)) return data.toString("utf8");
  if (Array.isArray(data)) return Buffer.concat(data).toString("utf8");
  if (data instanceof ArrayBuffer) return Buffer.from(data).toString("utf8");
  return null;
}

export async function GET(request: Request): Promise<Response> {
  const ticket = new URL(request.url).searchParams.get("ticket");
  const actor = verifyRealtimeTicket(ticket);

  // Reject before upgrading: an unauthenticated client never gets a socket.
  if (!actor) {
    return new Response("Unauthorized", {
      status: 401,
      headers: { "cache-control": "no-store" },
    });
  }

  return experimental_upgradeWebSocket(
    (socket) => {
      const connection = createRealtimeConnection({
        actor,
        transport: {
          send: (payload) => {
            socket.send(payload);
          },
          close: (code, reason) => {
            socket.close(code, reason);
          },
        },
      });

      socket.on("message", (data: WebSocketData) => {
        const raw = decodeFrame(data);
        if (raw === null) {
          socket.close(4003, "binary frames are not supported");
          return;
        }
        void connection.handleRawFrame(raw);
      });

      socket.on("close", () => {
        connection.dispose();
      });

      socket.on("error", (error: Error) => {
        logger.warn("realtime socket error", describeError(error));
        connection.dispose();
      });

      return connection.start().catch((error: unknown) => {
        logger.error("realtime connection failed to start", describeError(error));
        socket.close(1011, "internal error");
        connection.dispose();
      });
    },
    { maxPayload: MAX_SOCKET_PAYLOAD_BYTES },
  );
}
