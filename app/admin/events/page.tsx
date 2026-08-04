import { EventStream } from '@/components/admin/event-stream';
import { getEvents } from '@/lib/admin';
import type { Dictionary } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';

export default async function EventsPage() {
  const [{ i18n, lng }, result] = await Promise.all([
    getT('common'),
    getEvents(100),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;
  const page = copy.admin.events;

  return (
    <main>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </div>
      </div>

      <EventStream copy={page} initialEvents={result.data} />
    </main>
  );
}
