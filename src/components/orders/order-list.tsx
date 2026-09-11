import Link from "next/link";
import { useTranslations } from "next-intl";

import { StatusBadge } from "@/components/ui/status-badge";
import type { OrderListItem } from "@/lib/orders/queries";
import { displayName, formatDate, toIsoString } from "@/lib/utils";

/**
 * Order list.
 *
 * Rendered as linked rows rather than a wide table so the same markup works
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
  const t = useTranslations("Orders");

  return (
    <ul className="divide-y divide-line">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={`/orders/${order.reference}`}
            className="row-link flex flex-col gap-2"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="font-mono text-xs text-ink-muted">
                {order.reference}
              </span>
              <StatusBadge status={order.status} />
              {order.unreadCount > 0 ? (
                <span className="badge badge-count">
                  {t("newMessages", { count: order.unreadCount })}
                </span>
              ) : null}
            </div>

            <p className="text-sm font-medium text-ink">{order.title}</p>

            <dl className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-muted">
              <div className="flex gap-1.5">
                <dt>{t("submitted")}</dt>
                <dd>
                  <time dateTime={toIsoString(order.createdAt)}>
                    {formatDate(order.createdAt)}
                  </time>
                </dd>
              </div>
              <div className="flex gap-1.5">
                <dt>{t("updated")}</dt>
                <dd>
                  <time dateTime={toIsoString(order.updatedAt)}>
                    {formatDate(order.updatedAt)}
                  </time>
                </dd>
              </div>
              {order.desiredDeadline ? (
                <div className="flex gap-1.5">
                  <dt>{t("requestedBy")}</dt>
                  <dd>
                    <time dateTime={order.desiredDeadline}>
                      {formatDate(order.desiredDeadline)}
                    </time>
                  </dd>
                </div>
              ) : null}
              {showCustomer ? (
                <div className="flex gap-1.5">
                  <dt>{t("customer")}</dt>
                  <dd className="text-ink">
                    {displayName(order.customerName, order.customerEmail)}
                  </dd>
                </div>
              ) : null}
              {showExecutor ? (
                <div className="flex gap-1.5">
                  <dt>{t("executor")}</dt>
                  <dd className={order.executorEmail ? "text-ink" : undefined}>
                    {order.executorEmail
                      ? displayName(order.executorName, order.executorEmail)
                      : t("unassigned")}
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
