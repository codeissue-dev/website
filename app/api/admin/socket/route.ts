import { getAdminSessionForApi } from '@/lib/auth/guards';
import {
  SOCKET_TICKET_TIMEOUT_MS,
  buildBackendIdentityHeaders,
  buildSocketTicketTarget,
  buildSocketUrl,
} from '@/lib/backend/client';

export const dynamic = 'force-dynamic';

export async function POST() {
  const session = await getAdminSessionForApi();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let ticketUrl: URL;
  try {
    ticketUrl = buildSocketTicketTarget();
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Backend WebSocket bridge is not configured.',
      },
      { status: 503 },
    );
  }

  const headers = buildBackendIdentityHeaders(session.user);

  try {
    const response = await fetch(ticketUrl, {
      method: 'POST',
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(SOCKET_TICKET_TIMEOUT_MS),
    });

    if (!response.ok) {
      return Response.json(
        { error: 'Backend rejected the WebSocket ticket request.' },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as {
      ticket?: unknown;
      expiresAt?: unknown;
      url?: unknown;
    };
    if (typeof payload.ticket !== 'string' || payload.ticket.length < 8) {
      return Response.json(
        { error: 'Backend returned an invalid WebSocket ticket.' },
        { status: 502 },
      );
    }

    const socketUrl = buildSocketUrl(
      payload.ticket,
      typeof payload.url === 'string' ? payload.url : null,
    );

    return Response.json({
      url: socketUrl.toString(),
      expiresAt:
        typeof payload.expiresAt === 'string' ? payload.expiresAt : null,
    });
  } catch {
    return Response.json(
      { error: 'WebSocket ticket service is unavailable.' },
      { status: 502 },
    );
  }
}
