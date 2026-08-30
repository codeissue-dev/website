import Link from "next/link";

import { StatusBadge } from "@/components/ui/status-badge";
import type { OrderListItem } from "@/lib/orders/queries";
import { displayName, formatDate, pluralize, toIsoString } from "@/lib/utils";

/**
 * Order list.
 *
 * Rendered as linked cards rather than a wide table so the same markup works
 * from a narrow phone up, without horizontal scrolling.
 */
export function OrderList({
  orders,
  showCustomer,
  showExecutor,
}: {
  orders: OrderListItem[];
  showCustomer: boolean;
  showExecutor: boolean;
}) {
  return (
    <ul className="divide-y divide-line">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={`/orders/${order.reference}`}
            className="flex flex-col gap-2 px-4 py-3.5 transition-colors hover:bg-surface-muted sm:px-5"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="font-mono text-xs text-ink-muted">
                {order.reference}
              </span>
              <StatusBadge status={order.status} />
              {order.unreadCount > 0 ? (
                <span className="inline-flex items-center rounded-full bg-ink px-2 py-0.5 text-xs font-medium text-inverse">
                  {order.unreadCount} new
                  <span className="sr-only">
                    {" "}
                    {pluralize(order.unreadCount, "message", "messages")}
                  </span>
                </span>
              ) : null}
            </div>

            <p className="text-sm font-medium text-ink">{order.title}</p>

            <dl className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-muted">
              <div className="flex gap-1.5">
                <dt>Submitted</dt>
                <dd>
                  <time dateTime={toIsoString(order.createdAt)}>
                    {formatDate(order.createdAt)}
                  </time>
                </dd>
              </div>
              <div className="flex gap-1.5">
                <dt>Updated</dt>
                <dd>
                  <time dateTime={toIsoString(order.updatedAt)}>
                    {formatDate(order.updatedAt)}
                  </time>
                </dd>
              </div>
              {order.desiredDeadline ? (
                <div className="flex gap-1.5">
                  <dt>Requested by</dt>
                  <dd>
                    <time dateTime={order.desiredDeadline}>
                      {formatDate(order.desiredDeadline)}
                    </time>
                  </dd>
                </div>
              ) : null}
              {showCustomer ? (
                <div className="flex gap-1.5">
                  <dt>Customer</dt>
                  <dd className="text-ink">
                    {displayName(order.customerName, order.customerEmail)}
                  </dd>
                </div>
              ) : null}
              {showExecutor ? (
                <div className="flex gap-1.5">
                  <dt>Executor</dt>
                  <dd className={order.executorEmail ? "text-ink" : undefined}>
                    {order.executorEmail
                      ? displayName(order.executorName, order.executorEmail)
                      : "Unassigned"}
                  </dd>
                </div>
              ) : null}
            </dl>
          </Link>
        </li>
      ))}
    </ul>
  );
}
