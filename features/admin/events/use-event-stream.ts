'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { EventSummary } from '@/lib/admin';

import type { ConnectionState, StreamEvent } from './types';

type SocketTicket = { url: string; expiresAt: string | null };

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

export function useEventStream(initialEvents: EventSummary[]) {
  const socketRef = useRef<WebSocket | null>(null);
  const requestRef = useRef<AbortController | null>(null);
  const [connection, setConnection] = useState<ConnectionState>('disconnected');
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const [events, setEvents] = useState<StreamEvent[]>(
    initialEvents.map((event) => ({ ...event, transport: 'api' })),
  );
  const [apiLoading, setApiLoading] = useState(false);

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
      const response = await fetch('/api/admin/socket', {
        method: 'POST',
        cache: 'no-store',
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Ticket request failed');

      const ticket = (await response.json()) as SocketTicket;
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
        setEvents((current) =>
          [normalizeSocketEvent(parsed), ...current].slice(0, 200),
        );
      });
      socket.addEventListener('error', () => setConnection('error'));
      socket.addEventListener('close', () => {
        socketRef.current = null;
        setConnection('disconnected');
      });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError'))
        setConnection('error');
    } finally {
      requestRef.current = null;
    }
  }, [connection]);

  const refresh = useCallback(async () => {
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

  return {
    connection,
    endpoint,
    events,
    apiLoading,
    connect,
    disconnect,
    refresh,
    clear: () => setEvents([]),
  };
}
