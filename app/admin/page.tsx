import Link from 'next/link';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ChannelAvatar } from '@/components/admin/channel-avatar';
import { StatusPill } from '@/components/admin/status-pill';
import { ArrowRightIcon } from '@/components/icons';
import { getOverview } from '@/lib/admin';
import { formatMoney, formatRelativeTime } from '@/lib/format';
import type { Dictionary } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';

function orderTone(status: string) {
  if (status === 'active' || status === 'completed') return 'positive' as const;
  if (status === 'cancelled') return 'danger' as const;
  if (status === 'review' || status === 'proposal') return 'signal' as const;
  return 'warning' as const;
}

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
      code: 'INBOX',
    },
    {
      label: page.metrics.activeOrders,
      value: overview.metrics.activeOrders,
      code: 'ORDER',
    },
    {
      label: page.metrics.connectedSources,
      value: overview.metrics.connectedSources,
      code: 'SOURCE',
    },
    {
      label: page.metrics.eventsToday,
      value: overview.metrics.eventsToday,
      code: 'EVENT',
    },
  ];

  return (
    <main>
      <AdminPageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        action={
          <StatusPill tone={overview.fallback ? 'warning' : 'positive'} dot>
            {overview.fallback ? copy.admin.common.demoData : page.liveData}
          </StatusPill>
        }
      />

      <section
        className="mt-8 grid border-t border-l border-border sm:grid-cols-2 xl:grid-cols-4"
        aria-label={page.metricsLabel}
      >
        {metricItems.map((metric, index) => (
          <article
            key={metric.code}
            className="group relative min-h-40 border-r border-b border-border bg-surface/50 p-5"
          >
            <div className="flex items-center justify-between font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground">
              <span>{metric.code}</span>
              <span className="text-signal">0{index + 1}</span>
            </div>
            <strong className="mt-8 block text-5xl font-semibold tracking-[-0.065em] sm:text-6xl">
              {metric.value.toString().padStart(2, '0')}
            </strong>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              {metric.label}
            </p>
            <span className="absolute inset-x-5 bottom-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-300 group-hover:scale-x-100" />
          </article>
        ))}
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.75fr)]">
        <section className="border border-border bg-surface/50 xl:row-span-2">
          <div className="flex items-end justify-between gap-4 border-b border-border p-5 sm:p-6">
            <div>
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-signal">
                {page.inboxLabel}
              </span>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                {page.inboxTitle}
              </h2>
            </div>
            <Link
              href="/admin/inbox"
              className="inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted-foreground hover:text-signal-soft"
            >
              {page.viewAll} <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
          <div>
            {overview.conversations.slice(0, 5).map((conversation) => (
              <article
                key={conversation.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 border-b border-border p-4 last:border-b-0 transition-colors hover:bg-surface-soft sm:p-5"
              >
                <ChannelAvatar source={conversation.source} />
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <strong className="truncate text-sm">
                      {conversation.contact}
                    </strong>
                    <time className="shrink-0 font-mono text-[0.56rem] text-muted-foreground">
                      {formatRelativeTime(conversation.lastMessageAt, lng)}
                    </time>
                  </div>
                  <span className="mt-1 block truncate text-xs text-foreground/80">
                    {conversation.subject}
                  </span>
                  <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">
                    {conversation.preview}
                  </p>
                </div>
                {conversation.unreadCount > 0 ? (
                  <b className="grid size-6 place-items-center bg-signal font-mono text-[0.58rem] text-primary-foreground">
                    {conversation.unreadCount}
                  </b>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="border border-border bg-surface/50">
          <div className="flex items-end justify-between gap-4 border-b border-border p-5">
            <div>
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-signal">
                {page.pipelineLabel}
              </span>
              <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
                {page.ordersTitle}
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-muted-foreground hover:text-signal-soft"
            >
              {page.viewAll} <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {overview.orders.slice(0, 4).map((order) => (
              <article key={order.id} className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <StatusPill tone={orderTone(order.status)}>
                    {copy.admin.orders.statuses[order.status]}
                  </StatusPill>
                  <time className="font-mono text-[0.56rem] text-muted-foreground">
                    {formatRelativeTime(order.updatedAt, lng)}
                  </time>
                </div>
                <h3 className="mt-4 text-sm font-semibold">{order.title}</h3>
                <strong className="mt-2 block font-mono text-xs text-signal-soft">
                  {formatMoney(order.valueCents, order.currency, lng)}
                </strong>
              </article>
            ))}
          </div>
        </section>

        <section className="border border-border bg-surface/50">
          <div className="border-b border-border p-5">
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.14em] text-signal">
              {page.systemLabel}
            </span>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">
              {page.systemTitle}
            </h2>
          </div>
          <div className="divide-y divide-border">
            {[
              [
                'PostgreSQL 18',
                overview.fallback ? page.system.standby : page.system.connected,
                overview.fallback ? 'warning' : 'positive',
              ],
              ['Auth.js', page.system.protected, 'positive'],
              ['next-i18next', lng.toUpperCase(), 'positive'],
              [
                'WebSocket',
                process.env.BACKEND_WS_URL
                  ? page.system.configured
                  : page.system.awaiting,
                process.env.BACKEND_WS_URL ? 'positive' : 'warning',
              ],
            ].map(([label, value, tone]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 p-4 text-xs"
              >
                <span className="inline-flex items-center gap-2">
                  <i
                    className={
                      tone === 'positive'
                        ? 'size-1.5 bg-positive'
                        : 'size-1.5 bg-warning'
                    }
                  />
                  {label}
                </span>
                <strong className="font-mono text-[0.58rem] uppercase tracking-[0.08em] text-muted-foreground">
                  {value}
                </strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
