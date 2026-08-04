import { EventsScreen } from '@/features/admin/events';
import { getEvents } from '@/lib/admin';
import type { Dictionary } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';

export default async function EventsPage() {
  const [{ i18n, lng }, result] = await Promise.all([
    getT('common'),
    getEvents(100),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;

  return <EventsScreen copy={copy.admin.events} initialEvents={result.data} />;
}
