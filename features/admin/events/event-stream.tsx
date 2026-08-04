'use client';

import { Panel } from '@/components/ui/panel';
import type { EventSummary } from '@/lib/admin';

import { EventList } from './event-list';
import { EventStreamToolbar } from './event-stream-toolbar';
import type { EventStreamCopy } from './types';
import { useEventStream } from './use-event-stream';

export function EventStream({
  copy,
  initialEvents,
}: {
  copy: EventStreamCopy;
  initialEvents: EventSummary[];
}) {
  const stream = useEventStream(initialEvents);

  return (
    <Panel className="mt-8 overflow-hidden">
      <EventStreamToolbar
        copy={copy}
        connection={stream.connection}
        endpoint={stream.endpoint}
        apiLoading={stream.apiLoading}
        onConnect={stream.connect}
        onDisconnect={stream.disconnect}
        onRefresh={stream.refresh}
        onClear={stream.clear}
      />
      <div aria-live="polite">
        <EventList events={stream.events} copy={copy} />
      </div>
    </Panel>
  );
}
