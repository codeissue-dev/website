import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatusPill } from '@/components/admin/status-pill';
import { SocialIcon } from '@/components/social-icons';
import type { SocialIconName } from '@/components/social-icons';
import { getIntegrations } from '@/lib/admin';
import { formatRelativeTime } from '@/lib/format';
import type { Dictionary } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';

const supportedSocialIcons = new Set([
  'telegram',
  'discord',
  'instagram',
  'github',
  'youtube',
  'x',
  'tiktok',
  'twitch',
  'max',
  'linkedin',
]);

function integrationTone(status: string) {
  if (status === 'connected') return 'positive' as const;
  if (status === 'degraded') return 'warning' as const;
  if (status === 'disabled') return 'danger' as const;
  return 'neutral' as const;
}

export default async function IntegrationsPage() {
  const [{ i18n, lng }, result] = await Promise.all([
    getT('common'),
    getIntegrations(),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;
  const page = copy.admin.integrations;
  const endpoints = [
    [
      'REST',
      page.apiEndpoint,
      process.env.BACKEND_API_URL ?? 'BACKEND_API_URL',
    ],
    ['WS', page.wsEndpoint, process.env.BACKEND_WS_URL ?? 'BACKEND_WS_URL'],
    ['HOOK', page.webhookEndpoint, '/api/webhooks/[provider]'],
  ];

  return (
    <main>
      <AdminPageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
      />

      <section className="mt-8 grid border-t border-l border-border lg:grid-cols-3">
        {endpoints.map(([type, label, endpoint]) => (
          <article
            key={type}
            className="grid min-h-28 grid-cols-[3.5rem_minmax(0,1fr)] gap-4 border-r border-b border-border bg-surface/50 p-4"
          >
            <span className="font-mono text-[0.58rem] font-semibold text-signal">
              {type}
            </span>
            <div className="min-w-0">
              <strong className="block text-xs">{label}</strong>
              <code className="mt-3 block truncate text-[0.62rem] text-muted-foreground">
                {endpoint}
              </code>
            </div>
          </article>
        ))}
      </section>

      <p className="border-x border-b border-border px-4 py-3 font-mono text-[0.58rem] leading-5 text-muted-foreground">
        {page.secretHint}
      </p>

      <section className="mt-8 grid border-t border-l border-border lg:grid-cols-2">
        {result.data.map((integration) => (
          <article
            key={integration.id}
            className="grid min-h-44 grid-cols-[4.5rem_minmax(0,1fr)] border-r border-b border-border bg-surface/40 transition-colors hover:bg-surface-soft"
          >
            <div className="grid place-items-center border-r border-border text-foreground">
              {supportedSocialIcons.has(integration.provider) ? (
                <SocialIcon
                  name={integration.provider as SocialIconName}
                  className="size-7"
                />
              ) : (
                <span className="font-mono text-xs text-signal">
                  {integration.provider.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-col p-5">
              <header className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold tracking-[-0.035em]">
                    {integration.displayName}
                  </h2>
                  <span className="mt-1 block truncate font-mono text-[0.58rem] text-muted-foreground">
                    {integration.externalAccountId ?? integration.provider}
                  </span>
                </div>
                <StatusPill tone={integrationTone(integration.status)} dot>
                  {page[integration.status] ?? integration.status}
                </StatusPill>
              </header>
              <footer className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-4">
                <span className="font-mono text-[0.56rem] text-muted-foreground">
                  {integration.lastEventAt
                    ? formatRelativeTime(integration.lastEventAt, lng)
                    : page.noEvents}
                </span>
                <button
                  type="button"
                  className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-muted-foreground hover:text-signal-soft"
                >
                  {page.configure} →
                </button>
              </footer>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
