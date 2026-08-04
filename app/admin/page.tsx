import Link from 'next/link';

import { ArrowRightIcon } from '@/components/icons';
import { getOverview } from '@/lib/admin';
import { formatMoney, formatRelativeTime } from '@/lib/format';
import type { Dictionary } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';

export default async function AdminOverviewPage() {
  const [{ i18n, lng }, overview] = await Promise.all([
    getT('common'),
    getOverview(),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;
  const page = copy.admin.overview;
  const metricItems = [
    {
      label: page.metrics.openConversations,
      value: overview.metrics.openConversations,
      signal: 'inbox',
    },
    {
      label: page.metrics.activeOrders,
      value: overview.metrics.activeOrders,
      signal: 'orders',
    },
    {
      label: page.metrics.connectedSources,
      value: overview.metrics.connectedSources,
      signal: 'sources',
    },
    {
      label: page.metrics.eventsToday,
      value: overview.metrics.eventsToday,
      signal: 'events',
    },
  ];

  return (
    <main>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </div>
        <span className="admin-data-mode">
          <i className={overview.fallback ? 'is-demo' : 'is-live'} />
          {overview.fallback ? copy.admin.common.demoData : page.liveData}
        </span>
      </div>

      <section className="admin-metrics" aria-label={page.metricsLabel}>
        {metricItems.map((metric) => (
          <article key={metric.signal}>
            <div className={`metric-signal is-${metric.signal}`} aria-hidden>
              <span />
              <span />
              <span />
              <span />
            </div>
            <strong>{metric.value.toString().padStart(2, '0')}</strong>
            <p>{metric.label}</p>
          </article>
        ))}
      </section>

      <div className="admin-dashboard-grid">
        <section className="admin-panel admin-panel--wide">
          <div className="admin-panel__heading">
            <div>
              <span>{page.inboxLabel}</span>
              <h2>{page.inboxTitle}</h2>
            </div>
            <Link href="/admin/inbox">
              {page.viewAll} <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          <div className="conversation-list">
            {overview.conversations.slice(0, 5).map((conversation) => (
              <article key={conversation.id}>
                <div className="channel-avatar">
                  {conversation.source.slice(0, 2).toUpperCase()}
                </div>
                <div className="conversation-list__copy">
                  <div>
                    <strong>{conversation.contact}</strong>
                    <time>
                      {formatRelativeTime(conversation.lastMessageAt, lng)}
                    </time>
                  </div>
                  <span>{conversation.subject}</span>
                  <p>{conversation.preview}</p>
                </div>
                {conversation.unreadCount > 0 ? (
                  <b>{conversation.unreadCount}</b>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel__heading">
            <div>
              <span>{page.pipelineLabel}</span>
              <h2>{page.ordersTitle}</h2>
            </div>
            <Link href="/admin/orders">
              {page.viewAll} <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          <div className="order-stack">
            {overview.orders.slice(0, 4).map((order) => (
              <article key={order.id}>
                <div>
                  <span className={`status-chip is-${order.status}`}>
                    {copy.admin.orders.statuses[order.status]}
                  </span>
                  <time>{formatRelativeTime(order.updatedAt, lng)}</time>
                </div>
                <h3>{order.title}</h3>
                <strong>
                  {formatMoney(order.valueCents, order.currency, lng)}
                </strong>
              </article>
            ))}
          </div>
        </section>

        <section className="admin-panel admin-panel--system">
          <div className="admin-panel__heading">
            <div>
              <span>{page.systemLabel}</span>
              <h2>{page.systemTitle}</h2>
            </div>
          </div>
          <div className="system-status-list">
            <div>
              <span>
                <i className="is-healthy" />
                PostgreSQL 18
              </span>
              <strong>
                {overview.fallback
                  ? page.system.standby
                  : page.system.connected}
              </strong>
            </div>
            <div>
              <span>
                <i className="is-healthy" />
                Auth.js
              </span>
              <strong>{page.system.protected}</strong>
            </div>
            <div>
              <span>
                <i className="is-healthy" />
                next-i18next
              </span>
              <strong>{lng.toUpperCase()}</strong>
            </div>
            <div>
              <span>
                <i className="is-attention" />
                WebSocket
              </span>
              <strong>
                {process.env.BACKEND_WS_URL
                  ? page.system.configured
                  : page.system.awaiting}
              </strong>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
