import { cn } from '@/lib/utils';

import type { EventStreamCopy, StreamEvent } from './types';

export function EventList({
  events,
  copy,
}: {
  events: StreamEvent[];
  copy: EventStreamCopy;
}) {
  if (events.length === 0) {
    return (
      <div className="grid min-h-64 place-items-center p-8 text-sm text-muted-foreground">
        {copy.empty}
      </div>
    );
  }

  return (
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
              {event.transport === 'websocket' ? copy.live : copy.persisted}
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
            <span className="text-sm text-muted-foreground">{copy.source}</span>
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
  );
}
