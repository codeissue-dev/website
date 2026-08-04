import type { EventSummary } from '@/lib/admin';

export type ConnectionState =
  'connected' | 'connecting' | 'disconnected' | 'error';

export type EventStreamCopy = {
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

export type LiveEvent = EventSummary;

export type StreamEvent = EventSummary & { transport: 'websocket' | 'api' };
