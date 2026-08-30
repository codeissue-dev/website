import { getActor } from "@/lib/auth/actor";
import { issueRealtimeTicket } from "@/lib/realtime/ticket";

/**
 * Exchanges the session cookie for a short-lived WebSocket ticket.
 *
 * POST only (never prefetched, never cached), and the response is explicitly
 * marked `no-store` so a shared cache can never hand one visitor's ticket to
 * another.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(): Promise<Response> {
  const actor = await getActor();
  if (!actor) {
    return Response.json(
      { error: "Authentication required." },
      { status: 401, headers: { "cache-control": "no-store" } },
    );
  }

  const { ticket, expiresAt } = issueRealtimeTicket(actor);

  return Response.json(
    { ticket, expiresAt },
    { status: 200, headers: { "cache-control": "no-store" } },
  );
}
