import { getAdminSessionForApi } from '@/lib/auth/guards';

export const dynamic = 'force-dynamic';

function isWebSocketUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'ws:' || url.protocol === 'wss:';
  } catch {
    return false;
  }
}

export async function POST() {
  const session = await getAdminSessionForApi();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiBaseUrl = process.env.BACKEND_API_URL;
  const configuredSocketUrl = process.env.BACKEND_WS_URL;
  if (!apiBaseUrl || !configuredSocketUrl) {
    return Response.json(
      { error: 'Backend WebSocket bridge is not configured.' },
      { status: 503 },
    );
  }

  if (!isWebSocketUrl(configuredSocketUrl)) {
    return Response.json(
      { error: 'BACKEND_WS_URL must use ws:// or wss://.' },
      { status: 503 },
    );
  }

  const ticketPath = process.env.BACKEND_WS_TICKET_PATH ?? '/ws/ticket';
  let ticketUrl: URL;
  try {
    const base = new URL(apiBaseUrl);
    if (base.protocol !== 'http:' && base.protocol !== 'https:') {
      throw new Error('Unsupported backend protocol.');
    }
    ticketUrl = new URL(ticketPath, `${base.toString().replace(/\/$/, '')}/`);
  } catch {
    return Response.json(
      { error: 'Backend ticket endpoint is invalid.' },
      { status: 503 },
    );
  }

  const headers = new Headers({ accept: 'application/json' });
  headers.set('x-codeissue-user-id', session.user.id);
  headers.set('x-codeissue-user-role', session.user.role);
  if (process.env.BACKEND_API_TOKEN) {
    headers.set('authorization', `Bearer ${process.env.BACKEND_API_TOKEN}`);
  }

  try {
    const response = await fetch(ticketUrl, {
      method: 'POST',
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
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
    };
    if (typeof payload.ticket !== 'string' || payload.ticket.length < 8) {
      return Response.json(
        { error: 'Backend returned an invalid WebSocket ticket.' },
        { status: 502 },
      );
    }

    const socketUrl = new URL(configuredSocketUrl);
    socketUrl.searchParams.set('ticket', payload.ticket);

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
