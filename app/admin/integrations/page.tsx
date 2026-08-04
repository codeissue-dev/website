import { AdminPageHeader } from '@/components/admin/admin-page-header';
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

export default async function IntegrationsPage() {
  const [{ i18n, lng }, result] = await Promise.all([
    getT('common'),
    getIntegrations(),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;
  const page = copy.admin.integrations;

  return (
    <main>
      <AdminPageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
      />

      <section className="integration-endpoints">
        <article>
          <span>REST</span>
          <div>
            <strong>{page.apiEndpoint}</strong>
            <code>{process.env.BACKEND_API_URL ?? 'BACKEND_API_URL'}</code>
          </div>
        </article>
        <article>
          <span>WS</span>
          <div>
            <strong>{page.wsEndpoint}</strong>
            <code>{process.env.BACKEND_WS_URL ?? 'BACKEND_WS_URL'}</code>
          </div>
        </article>
        <article>
          <span>HOOK</span>
          <div>
            <strong>{page.webhookEndpoint}</strong>
            <code>/api/webhooks/[provider]</code>
          </div>
        </article>
      </section>

      <p className="integration-secret-hint">{page.secretHint}</p>

      <section className="integration-grid">
        {result.data.map((integration) => (
          <article key={integration.id}>
            <div className="integration-card__icon">
              {supportedSocialIcons.has(integration.provider) ? (
                <SocialIcon
                  name={integration.provider as SocialIconName}
                  className="size-7"
                />
              ) : (
                <span>{integration.provider.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div className="integration-card__copy">
              <header>
                <div>
                  <h2>{integration.displayName}</h2>
                  <span>
                    {integration.externalAccountId ?? integration.provider}
                  </span>
                </div>
                <span className={`integration-status is-${integration.status}`}>
                  <i />
                  {page[integration.status] ?? integration.status}
                </span>
              </header>
              <div className="integration-card__line" />
              <footer>
                <span>
                  {integration.lastEventAt
                    ? formatRelativeTime(integration.lastEventAt, lng)
                    : page.noEvents}
                </span>
                <button type="button">{page.configure} →</button>
              </footer>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
