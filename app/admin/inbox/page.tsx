import { InboxScreen } from '@/features/admin/inbox';
import { getConversations } from '@/lib/admin';
import type { Dictionary } from '@/lib/i18n';
import { toLocale } from '@/lib/i18n/locales';
import { getT } from '@/lib/i18n/server';

export default async function InboxPage() {
  const [{ i18n, lng }, result] = await Promise.all([
    getT('common'),
    getConversations(),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;

  return (
    <InboxScreen
      conversations={result.data}
      locale={toLocale(lng)}
      copy={copy}
    />
  );
}
