import { AdminPageHeader } from '@/components/admin/admin-page-header';
import type { EventSummary } from '@/lib/admin';
import type { Dictionary } from '@/lib/i18n';

import { EventStream } from './event-stream';

export function EventsScreen({
  copy,
  initialEvents,
}: {
  copy: Dictionary['admin']['events'];
  initialEvents: EventSummary[];
}) {
  return (
    <main>
      <AdminPageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
      />
      <EventStream copy={copy} initialEvents={initialEvents} />
    </main>
  );
}
