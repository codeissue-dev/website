import Link from 'next/link';

import { StatusPill } from '@/components/admin/status-pill';
import { ArrowRightIcon } from '@/components/icons';
import { Panel, PanelHeader } from '@/components/ui/panel';
import type { OrderSummary } from '@/lib/admin';
import { formatMoney, formatRelativeTime } from '@/lib/format';
import type { Dictionary } from '@/lib/i18n';

import { orderTone } from '../shared/status-tones';

export function OrderPreviewPanel({
  orders,
  locale,
  copy,
}: {
  orders: OrderSummary[];
  locale: string;
  copy: Dictionary['admin']['overview'] & {
    statuses: Dictionary['admin']['orders']['statuses'];
  };
}) {
  return (
    <Panel>
      <PanelHeader
        eyebrow={copy.pipelineLabel}
        title={copy.ordersTitle}
        action={
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {copy.viewAll}
            <ArrowRightIcon className="size-3.5" />
          </Link>
        }
      />
      <div className="divide-y divide-border">
        {orders.slice(0, 4).map((order) => (
          <article key={order.id} className="px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <StatusPill tone={orderTone(order.status)}>
                {copy.statuses[order.status]}
              </StatusPill>
              <time className="text-sm text-muted-foreground">
                {formatRelativeTime(order.updatedAt, locale)}
              </time>
            </div>
            <h3 className="mt-3 text-sm font-medium">{order.title}</h3>
            <strong className="mt-1.5 block font-mono text-sm text-signal-soft">
              {formatMoney(order.valueCents, order.currency, locale)}
            </strong>
          </article>
        ))}
      </div>
    </Panel>
  );
}
