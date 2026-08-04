import { StatusPill } from '@/components/admin/status-pill';
import type { OrderSummary } from '@/lib/admin';
import { formatMoney, formatRelativeTime } from '@/lib/format';
import type { Dictionary } from '@/lib/i18n';

import { orderTone } from '../shared/status-tones';

export function OrderList({
  orders,
  locale,
  copy,
}: {
  orders: OrderSummary[];
  locale: string;
  copy: Dictionary['admin']['orders'];
}) {
  return (
    <section className="mt-8 overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_0_rgba(255,255,255,0.035)_inset]">
      <div className="hidden grid-cols-[minmax(16rem,1.4fr)_10rem_11rem_10rem_9rem] border-b border-border bg-white/[0.025] px-5 py-3 text-sm text-muted-foreground md:grid">
        <span>{copy.issue}</span>
        <span>{copy.status}</span>
        <span>{copy.owner}</span>
        <span>{copy.value}</span>
        <span>{copy.updated}</span>
      </div>
      <div className="divide-y divide-border">
        {orders.map((order, index) => (
          <article
            key={order.id}
            className="grid gap-4 px-5 py-4 transition-colors hover:bg-white/[0.025] md:grid-cols-[minmax(16rem,1.4fr)_10rem_11rem_10rem_9rem] md:items-center"
          >
            <div className="min-w-0">
              <span className="font-mono text-sm text-signal-soft">
                CI-{String(index + 41).padStart(4, '0')}
              </span>
              <strong className="mt-1 block truncate text-sm font-medium">
                {order.title}
              </strong>
            </div>
            <div>
              <StatusPill tone={orderTone(order.status)}>
                {copy.statuses[order.status]}
              </StatusPill>
            </div>
            <span className="truncate text-sm text-muted-foreground">
              {order.owner ?? ' - '}
            </span>
            <strong className="font-mono text-sm text-signal-soft">
              {formatMoney(order.valueCents, order.currency, locale)}
            </strong>
            <time className="text-sm text-muted-foreground">
              {formatRelativeTime(order.updatedAt, locale)}
            </time>
          </article>
        ))}
      </div>
    </section>
  );
}
