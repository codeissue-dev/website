import Link from 'next/link';

import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { ChannelAvatar } from '@/components/admin/channel-avatar';
import { StatusPill } from '@/components/admin/status-pill';
import { ArrowRightIcon } from '@/components/icons';
import { Panel, PanelHeader } from '@/components/ui/panel';
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
      code: 'Inbox',
    },
    {
      label: page.metrics.activeOrders,
      value: overview.metrics.activeOrders,
      code: 'Orders',
    },
    {
      label: page.metrics.connectedSources,
      value: overview.metrics.connectedSources,
      code: 'Sources',
    },
    {
      label: page.metrics.eventsToday,
      value: overview.metrics.eventsToday,
      code: 'Events',
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
        className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        aria-label={page.metricsLabel}
      >
        {metricItems.map((metric, index) => (
          <article
            key={metric.code}
            className="rounded-xl border border-border bg-card p-5 shadow-[0_1px_0_rgba(255,255,255,0.035)_inset]"
          >
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{metric.code}</span>
              <span className="font-mono">0{index + 1}</span>
            </div>
            <strong className="mt-7 block text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
              {metric.value.toString().padStart(2, '0')}
            </strong>
            <p className="mt-2 text-sm leading-5 text-muted-foreground">
              {metric.label}
            </p>
          </article>
        ))}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.72fr)]">
        <Panel className="xl:row-span-2">
          <PanelHeader
            eyebrow={page.inboxLabel}
            title={page.inboxTitle}
            action={
              <Link
                href="/admin/inbox"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {page.viewAll}
                <ArrowRightIcon className="size-3.5" />
              </Link>
            }
          />
          <div className="divide-y divide-border">
            {overview.conversations.slice(0, 5).map((conversation) => (
              <article
                key={conversation.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 px-5 py-4 transition-colors hover:bg-white/[0.025] sm:px-6"
              >
                <ChannelAvatar source={conversation.source} />
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <strong className="truncate text-sm font-medium">
                      {conversation.contact}
                    </strong>
                    <time className="shrink-0 text-sm text-muted-foreground">
                      {formatRelativeTime(conversation.lastMessageAt, lng)}
                    </time>
                  </div>
                  <span className="mt-1 block truncate text-sm text-foreground/80">
                    {conversation.subject}
                  </span>
                  <p className="mt-1.5 line-clamp-1 text-sm text-muted-foreground">
                    {conversation.preview}
                  </p>
                </div>
                {conversation.unreadCount > 0 ? (
                  <b className="grid size-6 place-items-center rounded-full bg-white text-sm font-medium text-black">
                    {conversation.unreadCount}
                  </b>
                ) : null}
              </article>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            eyebrow={page.pipelineLabel}
            title={page.ordersTitle}
            action={
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {page.viewAll}
                <ArrowRightIcon className="size-3.5" />
              </Link>
            }
          />
          <div className="divide-y divide-border">
            {overview.orders.slice(0, 4).map((order) => (
              <article key={order.id} className="px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-3">
                  <StatusPill tone={orderTone(order.status)}>
                    {copy.admin.orders.statuses[order.status]}
                  </StatusPill>
                  <time className="text-sm text-muted-foreground">
                    {formatRelativeTime(order.updatedAt, lng)}
                  </time>
                </div>
                <h3 className="mt-3 text-sm font-medium">{order.title}</h3>
                <strong className="mt-1.5 block font-mono text-sm text-signal-soft">
                  {formatMoney(order.valueCents, order.currency, lng)}
                </strong>
              </article>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelHeader eyebrow={page.systemLabel} title={page.systemTitle} />
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
                className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm sm:px-6"
              >
                <span className="inline-flex items-center gap-2.5">
                  <i
                    className={
                      tone === 'positive'
                        ? 'size-1.5 rounded-full bg-positive'
                        : 'size-1.5 rounded-full bg-warning'
                    }
                  />
                  {label}
                </span>
                <strong className="text-sm font-medium text-muted-foreground">
                  {value}
                </strong>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </main>
  );
}
