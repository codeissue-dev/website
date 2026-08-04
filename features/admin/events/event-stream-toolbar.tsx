'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { ConnectionState, EventStreamCopy } from './types';

const dotTone: Record<ConnectionState, string> = {
  connected: 'bg-positive',
  connecting: 'bg-warning',
  disconnected: 'bg-muted-foreground',
  error: 'bg-danger',
};

export function EventStreamToolbar({
  copy,
  connection,
  endpoint,
  apiLoading,
  onConnect,
  onDisconnect,
  onRefresh,
  onClear,
}: {
  copy: EventStreamCopy;
  connection: ConnectionState;
  endpoint: string | null;
  apiLoading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onRefresh: () => void;
  onClear: () => void;
}) {
  const labels: Record<ConnectionState, string> = {
    connected: copy.connected,
    connecting: copy.connecting,
    disconnected: copy.disconnected,
    error: copy.error,
  };
  const active = connection === 'connected' || connection === 'connecting';

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn('size-2 shrink-0 rounded-full', dotTone[connection])}
          />
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
          <button
            type="button"
            onClick={active ? onDisconnect : onConnect}
            className={buttonVariants({
              variant: active ? 'secondary' : 'default',
              size: 'sm',
            })}
          >
            {active ? copy.disconnect : copy.connect}
          </button>
          <button
            type="button"
            onClick={onRefresh}
            disabled={apiLoading}
            className={buttonVariants({ variant: 'secondary', size: 'sm' })}
          >
            {apiLoading ? '...' : copy.refresh}
          </button>
          <button
            type="button"
            onClick={onClear}
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
    </>
  );
}
