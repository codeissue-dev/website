import { OverviewScreen } from '@/features/admin/overview';
import { getOverview } from '@/lib/admin';
import type { Dictionary } from '@/lib/i18n';
import { toLocale } from '@/lib/i18n/locales';
import { getT } from '@/lib/i18n/server';

export default async function AdminOverviewPage() {
  const [{ i18n, lng }, overview] = await Promise.all([
    getT('common'),
    getOverview(),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;

  return (
    <OverviewScreen
      overview={overview}
      copy={copy}
      locale={toLocale(lng)}
      websocketConfigured={Boolean(
        process.env.BACKEND_WS_URL || process.env.BACKEND_API_URL,
      )}
    />
  );
}
