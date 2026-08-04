import { AdminPageHeader } from '@/components/admin/admin-page-header';
import type { IntegrationSummary } from '@/lib/admin';
import type { Dictionary } from '@/lib/i18n';

import { EndpointGrid } from './endpoint-grid';
import { IntegrationGrid } from './integration-grid';

export function IntegrationsScreen({
  integrations,
  locale,
  copy,
  backendApiUrl,
  backendWsUrl,
}: {
  integrations: IntegrationSummary[];
  locale: string;
  copy: Dictionary;
  backendApiUrl?: string;
  backendWsUrl?: string;
}) {
  const page = copy.admin.integrations;
  const endpoints = [
    {
      type: 'REST',
      label: page.apiEndpoint,
      endpoint: backendApiUrl ?? 'BACKEND_API_URL',
    },
    {
      type: 'WS',
      label: page.wsEndpoint,
      endpoint: backendWsUrl ?? 'BACKEND_WS_URL',
    },
    {
      type: 'HOOK',
      label: page.webhookEndpoint,
      endpoint: '/api/webhooks/[provider]',
    },
  ];

  return (
    <main>
      <AdminPageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
      />
      <EndpointGrid items={endpoints} />
      <p className="mt-3 rounded-lg border border-border bg-white/[0.025] px-4 py-3 text-sm leading-6 text-muted-foreground">
        {page.secretHint}
      </p>
      <IntegrationGrid
        integrations={integrations}
        locale={locale}
        copy={page}
      />
    </main>
  );
}
