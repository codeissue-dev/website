import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatusPill } from '@/components/admin/status-pill';
import type {
  ConversationSummary,
  IntegrationSummary,
  OrderSummary,
} from '@/lib/admin';
import type { Dictionary } from '@/lib/i18n';

import { ConversationPreviewPanel } from './conversation-preview-panel';
import { MetricGrid } from './metric-grid';
import { OrderPreviewPanel } from './order-preview-panel';
import { SystemStatusPanel } from './system-status-panel';

type OverviewData = {
  fallback: boolean;
  metrics: {
    openConversations: number;
    activeOrders: number;
    connectedSources: number;
    eventsToday: number;
  };
  conversations: ConversationSummary[];
  orders: OrderSummary[];
  integrations: IntegrationSummary[];
};

export function OverviewScreen({
  overview,
  copy,
  locale,
  websocketConfigured,
}: {
  overview: OverviewData;
  copy: Dictionary;
  locale: string;
  websocketConfigured: boolean;
}) {
  const page = copy.admin.overview;
  const metrics = [
    {
      code: 'Inbox',
      label: page.metrics.openConversations,
      value: overview.metrics.openConversations,
    },
    {
      code: 'Orders',
      label: page.metrics.activeOrders,
      value: overview.metrics.activeOrders,
    },
    {
      code: 'Sources',
      label: page.metrics.connectedSources,
      value: overview.metrics.connectedSources,
    },
    {
      code: 'Events',
      label: page.metrics.eventsToday,
      value: overview.metrics.eventsToday,
    },
  ];
  const statuses = [
    {
      label: 'PostgreSQL 18',
      value: overview.fallback ? page.system.standby : page.system.connected,
      tone: overview.fallback ? ('warning' as const) : ('positive' as const),
    },
    {
      label: 'Auth.js',
      value: page.system.protected,
      tone: 'positive' as const,
    },
    {
      label: 'next-i18next',
      value: locale.toUpperCase(),
      tone: 'positive' as const,
    },
    {
      label: 'WebSocket',
      value: websocketConfigured
        ? page.system.configured
        : page.system.awaiting,
      tone: websocketConfigured ? ('positive' as const) : ('warning' as const),
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
      <MetricGrid items={metrics} label={page.metricsLabel} />
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.72fr)]">
        <ConversationPreviewPanel
          conversations={overview.conversations}
          locale={locale}
          eyebrow={page.inboxLabel}
          title={page.inboxTitle}
          viewAll={page.viewAll}
        />
        <OrderPreviewPanel
          orders={overview.orders}
          locale={locale}
          copy={{ ...page, statuses: copy.admin.orders.statuses }}
        />
        <SystemStatusPanel
          eyebrow={page.systemLabel}
          title={page.systemTitle}
          items={statuses}
        />
      </div>
    </main>
  );
}
