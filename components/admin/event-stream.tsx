'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { EventSummary } from '@/lib/admin';
import { cn } from '@/lib/utils';

type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'error';

type EventStreamCopy = {
  connect: string;
  disconnect: string;
  refresh: string;
  clear: string;
  connected: string;
  connecting: string;
  disconnected: string;
  error: string;
  live: string;
  persisted: string;
  payload: string;
  source: string;
  received: string;
  empty: string;
  wsMissing: string;
  apiReady: string;
};

type StreamEvent = EventSummary & { transport: 'websocket' | 'api' };

type SocketTicket = {
  url: string;
  expiresAt: string | null;
};

const stateLabels = (
  copy: EventStreamCopy,
): Record<ConnectionState, string> => ({
  connected: copy.connected,
  connecting: copy.connecting,
  disconnected: copy.disconnected,
  error: copy.error,
});

function normalizeSocketEvent(raw: unknown): StreamEvent {
  const object =
    raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const payload =
    object.payload && typeof object.payload === 'object'
      ? (object.payload as Record<string, unknown>)
      : { value: raw };

  return {
    id: String(object.id ?? crypto.randomUUID()),
    source: String(object.source ?? 'websocket'),
    eventType: String(object.eventType ?? object.type ?? 'message'),
    status: String(object.status ?? 'received'),
    payload,
    receivedAt: String(object.receivedAt ?? new Date().toISOString()),
    transport: 'websocket',
  };
}

export function EventStream({
  copy,
  initialEvents,
}: {
  copy: EventStreamCopy;
  initialEvents: EventSummary[];
}) {
  const socketRef = useRef<WebSocket | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const [connection, setConnection] = useState<ConnectionState>('disconnected');
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const [events, setEvents] = useState<StreamEvent[]>(
    initialEvents.map((event) => ({ ...event, transport: 'api' })),
  );
  const [apiLoading, setApiLoading] = useState(false);

  const pushEvent = useCallback((event: StreamEvent) => {
    setEvents((current) => [event, ...current].slice(0, 200));
  }, []);

  const disconnect = useCallback(() => {
    requestRef.current?.abort();
    requestRef.current = null;
    socketRef.current?.close(1000, 'Disconnected by operator');
    socketRef.current = null;
    setConnection('disconnected');
  }, []);

  const connect = useCallback(async () => {
    if (socketRef.current || connection === 'connecting') return;

    setConnection('connecting');
    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const ticketResponse = await fetch('/api/admin/socket', {
        method: 'POST',
        cache: 'no-store',
        signal: controller.signal,
      });
      if (!ticketResponse.ok) throw new Error('Ticket request failed');

      const ticket = (await ticketResponse.json()) as SocketTicket;
      if (!ticket.url) throw new Error('Missing socket URL');

      const socket = new WebSocket(ticket.url);
      socketRef.current = socket;
      setEndpoint(new URL(ticket.url).origin);

      socket.addEventListener('open', () => setConnection('connected'));
      socket.addEventListener('message', (message) => {
        let parsed: unknown = message.data;
        if (typeof message.data === 'string') {
          try {
            parsed = JSON.parse(message.data);
          } catch {
            parsed = { payload: { message: message.data } };
          }
        }
        pushEvent(normalizeSocketEvent(parsed));
      });
      socket.addEventListener('error', () => setConnection('error'));
      socket.addEventListener('close', () => {
        socketRef.current = null;
        setConnection('disconnected');
      });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        setConnection('error');
      }
    } finally {
      requestRef.current = null;
    }
  }, [connection, pushEvent]);

  const refreshApi = useCallback(async () => {
    setApiLoading(true);
    try {
      const response = await fetch('/api/admin/events?limit=100', {
        cache: 'no-store',
      });
      if (!response.ok) throw new Error('Request failed');
      const payload = (await response.json()) as { events: EventSummary[] };
      setEvents(
        payload.events.map((event) => ({ ...event, transport: 'api' })),
      );
    } finally {
      setApiLoading(false);
    }
  }, []);

  useEffect(() => disconnect, [disconnect]);

  const labels = stateLabels(copy);

  return (
    <div className="event-console">
      <div className="event-console__toolbar">
        <div className="event-console__connection">
          <span className={cn('connection-dot', `is-${connection}`)} />
          <div>
            <strong>{labels[connection]}</strong>
            <span>{endpoint ?? copy.wsMissing}</span>
          </div>
        </div>

        <div className="event-console__actions">
          {connection === 'connected' || connection === 'connecting' ? (
            <button type="button" onClick={disconnect}>
              {copy.disconnect}
            </button>
          ) : (
            <button type="button" onClick={connect}>
              {copy.connect}
            </button>
          )}
          <button type="button" onClick={refreshApi} disabled={apiLoading}>
            {apiLoading ? '…' : copy.refresh}
          </button>
          <button type="button" onClick={() => setEvents([])}>
            {copy.clear}
          </button>
        </div>
      </div>

      <div className="event-console__hint">
        <span>{copy.apiReady}</span>
        <code>/api/admin/backend/[...path]</code>
      </div>

      <div className="event-log" aria-live="polite">
        {events.length === 0 ? (
          <div className="event-log__empty">{copy.empty}</div>
        ) : (
          events.map((event) => (
            <article key={`${event.transport}-${event.id}`}>
              <div className="event-log__meta">
                <span
                  className={cn(
                    'event-transport',
                    event.transport === 'websocket' && 'is-live',
                  )}
                >
                  {event.transport === 'websocket' ? copy.live : copy.persisted}
                </span>
                <strong>{event.eventType}</strong>
                <span>{event.status}</span>
                <time dateTime={event.receivedAt}>
                  {new Intl.DateTimeFormat(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  }).format(new Date(event.receivedAt))}
                </time>
              </div>
              <div className="event-log__source">
                <span>{copy.source}</span>
                <code>{event.source}</code>
              </div>
              <pre>{JSON.stringify(event.payload, null, 2)}</pre>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
