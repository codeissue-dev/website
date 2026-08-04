import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatusPill } from '@/components/admin/status-pill';
import { SocialIcon } from '@/components/social-icons';
import type { SocialIconName } from '@/components/social-icons';
import { Panel, PanelHeader } from '@/components/ui/panel';
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

      <section className="mt-8 grid gap-3 lg:grid-cols-3">
        {endpoints.map(([type, label, endpoint]) => (
          <article
            key={type}
            className="rounded-xl border border-border bg-card p-5 shadow-[0_1px_0_rgba(255,255,255,0.035)_inset]"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-signal-soft">{type}</span>
              <i className="size-1.5 rounded-full bg-positive" />
            </div>
            <strong className="mt-5 block text-sm font-medium">{label}</strong>
            <code className="mt-2 block truncate font-mono text-sm text-muted-foreground">
              {endpoint}
            </code>
          </article>
        ))}
      </section>

      <p className="mt-3 rounded-lg border border-border bg-white/[0.025] px-4 py-3 text-sm leading-6 text-muted-foreground">
        {page.secretHint}
      </p>

      <Panel className="mt-8">
        <PanelHeader eyebrow="CHANNELS" title={page.title} />
        <div className="grid gap-px bg-border sm:grid-cols-2">
          {result.data.map((integration) => (
            <article
              key={integration.id}
              className="group flex min-h-44 flex-col bg-card p-5 transition-colors hover:bg-surface-soft sm:p-6"
            >
              <header className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-black text-muted-foreground transition-colors group-hover:text-foreground">
                    {supportedSocialIcons.has(integration.provider) ? (
                      <SocialIcon
                        name={integration.provider as SocialIconName}
                        className="size-5"
                      />
                    ) : (
                      <span className="font-mono text-sm text-signal-soft">
                        {integration.provider.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold tracking-[-0.025em]">
                      {integration.displayName}
                    </h2>
                    <span className="mt-1 block truncate text-sm text-muted-foreground">
                      {integration.externalAccountId ?? integration.provider}
                    </span>
                  </div>
                </div>
                <StatusPill tone={integrationTone(integration.status)} dot>
                  {page[integration.status] ?? integration.status}
                </StatusPill>
              </header>
              <footer className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">
                  {integration.lastEventAt
                    ? formatRelativeTime(integration.lastEventAt, lng)
                    : page.noEvents}
                </span>
                <button
                  type="button"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {page.configure} -&gt;
                </button>
              </footer>
            </article>
          ))}
        </div>
      </Panel>
    </main>
  );
}
