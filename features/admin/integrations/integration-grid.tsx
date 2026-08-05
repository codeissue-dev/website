import { StatusPill } from '@/components/admin/status-pill';
import { Button } from '@/components/ui/button';
import { SocialIcon, type SocialIconName } from '@/components/social-icons';
import { Panel, PanelHeader } from '@/components/ui/panel';
import type { IntegrationSummary } from '@/lib/admin';
import { formatRelativeTime } from '@/lib/format';
import type { Dictionary } from '@/lib/i18n';

import { integrationTone } from '../shared/status-tones';

const supportedSocialIcons = new Set<SocialIconName>([
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

export function IntegrationGrid({
  integrations,
  locale,
  copy,
}: {
  integrations: IntegrationSummary[];
  locale: string;
  copy: Dictionary['admin']['integrations'];
}) {
  return (
    <Panel className="mt-8">
      <PanelHeader eyebrow="CHANNELS" title={copy.title} />
      <div className="grid gap-px bg-border sm:grid-cols-2">
        {integrations.map((integration) => {
          const icon = supportedSocialIcons.has(
            integration.provider as SocialIconName,
          )
            ? (integration.provider as SocialIconName)
            : null;

          return (
            <article
              key={integration.id}
              className="group flex min-h-44 flex-col bg-card p-5 transition-colors hover:bg-surface-soft sm:p-6"
            >
              <header className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-black text-muted-foreground transition-colors group-hover:text-foreground">
                    {icon ? (
                      <SocialIcon name={icon} className="size-5" />
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
                  {copy[integration.status] ?? integration.status}
                </StatusPill>
              </header>
              <footer className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">
                  {integration.lastEventAt
                    ? formatRelativeTime(integration.lastEventAt, locale)
                    : copy.noEvents}
                </span>
                <Button type="button" variant="ghost" size="sm">
                  {copy.configure} -&gt;
                </Button>
              </footer>
            </article>
          );
        })}
      </div>
    </Panel>
  );
}
