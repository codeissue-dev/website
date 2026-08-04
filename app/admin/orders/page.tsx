import { createOrder } from '@/app/admin/orders/actions';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { StatusPill } from '@/components/admin/status-pill';
import { buttonVariants } from '@/components/ui/button';
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
            <summary
              className={buttonVariants({
                size: 'md',
                className: 'list-none [&::-webkit-details-marker]:hidden',
              })}
            >
              + {page.new}
            </summary>
            <form
              action={createOrder}
              className="absolute right-0 top-[calc(100%_+_0.75rem)] z-20 grid w-[min(25rem,calc(100vw_-_2rem))] gap-4 rounded-xl border border-border bg-card p-5 shadow-2xl shadow-black/60"
            >
              <label className="grid gap-2">
                <span className="text-sm font-medium">{page.titleLabel}</span>
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
                  <span className="text-sm font-medium">{page.valueLabel}</span>
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
                  <span className="text-sm font-medium">
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
              <button type="submit" className={buttonVariants({ size: 'md' })}>
                {page.create}
              </button>
            </form>
          </details>
        }
      />

      <section className="mt-8 overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_0_rgba(255,255,255,0.035)_inset]">
        <div className="hidden grid-cols-[minmax(16rem,1.4fr)_10rem_11rem_10rem_9rem] border-b border-border bg-white/[0.025] px-5 py-3 text-sm text-muted-foreground md:grid">
          <span>{page.issue}</span>
          <span>{page.status}</span>
          <span>{page.owner}</span>
          <span>{page.value}</span>
          <span>{page.updated}</span>
        </div>
        <div className="divide-y divide-border">
          {result.data.map((order, index) => (
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
                  {page.statuses[order.status]}
                </StatusPill>
              </div>
              <span className="truncate text-sm text-muted-foreground">
                {order.owner ?? ' - '}
              </span>
              <strong className="font-mono text-sm text-signal-soft">
                {formatMoney(order.valueCents, order.currency, lng)}
              </strong>
              <time className="text-sm text-muted-foreground">
                {formatRelativeTime(order.updatedAt, lng)}
              </time>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
