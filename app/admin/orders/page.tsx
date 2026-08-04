import { createOrder } from '@/app/admin/orders/actions';
import { getOrders } from '@/lib/admin-data';
import { formatMoney, formatRelativeTime } from '@/lib/format';
import type { Dictionary } from '@/lib/i18n';
import { getT } from '@/lib/i18n/server';

export default async function OrdersPage() {
  const [{ i18n, lng }, result] = await Promise.all([
    getT('common'),
    getOrders(),
  ]);
  const copy = i18n.getResourceBundle(lng, 'common') as Dictionary;
  const page = copy.admin.orders;

  return (
    <main>
      <div className="admin-page-heading">
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
        </div>
        <details className="new-order">
          <summary className="admin-primary-action">+ {page.new}</summary>
          <form action={createOrder}>
            <label>
              <span>{page.titleLabel}</span>
              <input
                type="text"
                name="title"
                minLength={3}
                maxLength={200}
                placeholder={page.titlePlaceholder}
                required
              />
            </label>
            <div>
              <label>
                <span>{page.valueLabel}</span>
                <input
                  type="number"
                  name="value"
                  min="0"
                  max="100000000"
                  step="0.01"
                  defaultValue="0"
                  required
                />
              </label>
              <label>
                <span>{page.currencyLabel}</span>
                <select name="currency" defaultValue="USD">
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="RUB">RUB</option>
                </select>
              </label>
            </div>
            <button type="submit">{page.create}</button>
          </form>
        </details>
      </div>

      <section className="orders-board">
        <div className="orders-board__head">
          <span>{page.issue}</span>
          <span>{page.status}</span>
          <span>{page.owner}</span>
          <span>{page.value}</span>
          <span>{page.updated}</span>
        </div>
        {result.data.map((order, index) => (
          <article key={order.id}>
            <div>
              <span>CI-{String(index + 41).padStart(4, '0')}</span>
              <strong>{order.title}</strong>
            </div>
            <span className={`status-chip is-${order.status}`}>
              {page.statuses[order.status]}
            </span>
            <span>{order.owner ?? '—'}</span>
            <strong>
              {formatMoney(order.valueCents, order.currency, lng)}
            </strong>
            <time>{formatRelativeTime(order.updatedAt, lng)}</time>
          </article>
        ))}
      </section>
    </main>
  );
}
