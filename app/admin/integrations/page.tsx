import { IntegrationsScreen } from '@/features/admin/integrations';
import { getIntegrations } from '@/lib/admin';
import type { Dictionary } from '@/lib/i18n';
import { toLocale } from '@/lib/i18n/locales';
import { getT } from '@/lib/i18n/server';

export default async function IntegrationsPage() {
  const [{ i18n, lng }, result] = await Promise.all([
    getT('common'),
    getIntegrations(),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;

  return (
    <IntegrationsScreen
      integrations={result.data}
      locale={toLocale(lng)}
      copy={copy}
      backendApiUrl={process.env.BACKEND_API_URL}
      backendWsUrl={process.env.BACKEND_WS_URL}
    />
  );
}
