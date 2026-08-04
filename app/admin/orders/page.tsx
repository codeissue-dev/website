import { createOrder } from '@/app/admin/orders/actions';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatusPill } from '@/components/admin/status-pill';
import { getOrders } from '@/lib/admin';
import { formatMoney, formatRelativeTime } from '@/lib/format';
import type { Dictionary } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';
import { fieldClass } from '@/lib/ui/styles';

function orderTone(status: string) {
  if (status === 'active' || status === 'completed') return 'positive' as const;
  if (status === 'cancelled') return 'danger' as const;
  if (status === 'review' || status === 'proposal') return 'signal' as const;
  return 'warning' as const;
}

export default async function OrdersPage() {
  const [{ i18n, lng }, result] = await Promise.all([
    getT('common'),
    getOrders(),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;
  const page = copy.admin.orders;

  return (
    <main>
      <AdminPageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        action={
          <details className="group relative">
            <summary className="inline-flex h-10 list-none items-center justify-center border border-signal bg-signal px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-signal-soft [&::-webkit-details-marker]:hidden">
              + {page.new}
            </summary>
            <form
              action={createOrder}
              className="absolute right-0 top-[calc(100%_+_0.75rem)] z-20 grid w-[min(24rem,calc(100vw_-_2rem))] gap-4 border border-border bg-surface p-5 shadow-2xl shadow-black/30"
            >
              <label className="grid gap-2">
                <span className="font-mono text-sm uppercase tracking-[0.1em] text-muted-foreground">
                  {page.titleLabel}
                </span>
                <input
                  type="text"
                  name="title"
                  minLength={3}
                  maxLength={200}
                  placeholder={page.titlePlaceholder}
                  required
                  className={fieldClass}
                />
              </label>
              <div className="grid grid-cols-[1fr_7rem] gap-3">
                <label className="grid gap-2">
                  <span className="font-mono text-sm uppercase tracking-[0.1em] text-muted-foreground">
                    {page.valueLabel}
                  </span>
                  <input
                    type="number"
                    name="value"
                    min="0"
                    max="100000000"
                    step="0.01"
                    defaultValue="0"
                    required
                    className={fieldClass}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="font-mono text-sm uppercase tracking-[0.1em] text-muted-foreground">
                    {page.currencyLabel}
                  </span>
                  <select
                    name="currency"
                    defaultValue="USD"
                    className={fieldClass}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="RUB">RUB</option>
                  </select>
                </label>
              </div>
              <button
                type="submit"
                className="h-10 border border-signal bg-signal text-sm font-semibold text-primary-foreground hover:bg-signal-soft"
              >
                {page.create}
              </button>
            </form>
          </details>
        }
      />

      <section className="mt-8 overflow-x-auto border border-border bg-surface/40">
        <div className="grid min-w-[52rem] grid-cols-[minmax(16rem,1.4fr)_10rem_11rem_10rem_9rem] border-b border-border bg-surface-soft px-5 py-3 font-mono text-sm uppercase tracking-[0.12em] text-muted-foreground">
          <span>{page.issue}</span>
          <span>{page.status}</span>
          <span>{page.owner}</span>
          <span>{page.value}</span>
          <span>{page.updated}</span>
        </div>
        {result.data.map((order, index) => (
          <article
            key={order.id}
            className="grid min-w-[52rem] grid-cols-[minmax(16rem,1.4fr)_10rem_11rem_10rem_9rem] items-center border-b border-border px-5 py-4 last:border-b-0 transition-colors hover:bg-surface-soft"
          >
            <div className="min-w-0">
              <span className="font-mono text-sm text-signal">
                CI-{String(index + 41).padStart(4, '0')}
              </span>
              <strong className="mt-1 block truncate text-sm">
                {order.title}
              </strong>
            </div>
            <StatusPill tone={orderTone(order.status)}>
              {page.statuses[order.status]}
            </StatusPill>
            <span className="truncate text-sm text-muted-foreground">
              {order.owner ?? ' - '}
            </span>
            <strong className="font-mono text-sm text-signal-soft">
              {formatMoney(order.valueCents, order.currency, lng)}
            </strong>
            <time className="font-mono text-sm text-muted-foreground">
              {formatRelativeTime(order.updatedAt, lng)}
            </time>
          </article>
        ))}
      </section>
    </main>
  );
}
