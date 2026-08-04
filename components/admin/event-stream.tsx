'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
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
  const connectionDot = {
    connected: 'bg-positive',
    connecting: 'bg-warning',
    disconnected: 'bg-muted-foreground',
    error: 'bg-danger',
  }[connection];

  return (
    <Panel className="mt-8 overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className={cn('size-2 shrink-0 rounded-full', connectionDot)} />
          <div className="min-w-0">
            <strong className="block text-sm font-medium">
              {labels[connection]}
            </strong>
            <span className="mt-1 block truncate text-sm text-muted-foreground">
              {endpoint ?? copy.wsMissing}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {connection === 'connected' || connection === 'connecting' ? (
            <button
              type="button"
              onClick={disconnect}
              className={buttonVariants({ variant: 'secondary', size: 'sm' })}
            >
              {copy.disconnect}
            </button>
          ) : (
            <button
              type="button"
              onClick={connect}
              className={buttonVariants({ size: 'sm' })}
            >
              {copy.connect}
            </button>
          )}
          <button
            type="button"
            onClick={refreshApi}
            disabled={apiLoading}
            className={buttonVariants({ variant: 'secondary', size: 'sm' })}
          >
            {apiLoading ? '...' : copy.refresh}
          </button>
          <button
            type="button"
            onClick={() => setEvents([])}
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            {copy.clear}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-white/[0.02] px-5 py-3 text-sm text-muted-foreground sm:px-6">
        <span>{copy.apiReady}</span>
        <code className="font-mono text-signal-soft">
          /api/admin/backend/[...path]
        </code>
      </div>

      <div aria-live="polite">
        {events.length === 0 ? (
          <div className="grid min-h-64 place-items-center p-8 text-sm text-muted-foreground">
            {copy.empty}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {events.map((event) => (
              <article
                key={`${event.transport}-${event.id}`}
                className="grid gap-5 px-5 py-5 lg:grid-cols-[11rem_11rem_minmax(0,1fr)] lg:px-6"
              >
                <div className="flex flex-col items-start gap-2">
                  <span
                    className={cn(
                      'rounded-full border px-2.5 py-1 text-sm font-medium',
                      event.transport === 'websocket'
                        ? 'border-positive/25 bg-positive/10 text-positive'
                        : 'border-border bg-white/[0.03] text-muted-foreground',
                    )}
                  >
                    {event.transport === 'websocket'
                      ? copy.live
                      : copy.persisted}
                  </span>
                  <strong className="break-words text-sm font-medium">
                    {event.eventType}
                  </strong>
                  <span className="text-sm text-muted-foreground">
                    {event.status}
                  </span>
                  <time
                    dateTime={event.receivedAt}
                    className="text-sm text-muted-foreground"
                  >
                    {new Intl.DateTimeFormat(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    }).format(new Date(event.receivedAt))}
                  </time>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">
                    {copy.source}
                  </span>
                  <code className="mt-2 block break-all font-mono text-sm text-signal-soft">
                    {event.source}
                  </code>
                </div>
                <pre className="max-h-80 overflow-auto rounded-lg border border-border bg-black p-4 font-mono text-sm leading-5 text-muted-foreground">
                  {JSON.stringify(event.payload, null, 2)}
                </pre>
              </article>
            ))}
          </div>
        )}
      </div>
    </Panel>
  );
}
