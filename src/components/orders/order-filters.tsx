import { useTranslations } from "next-intl";

import { Button, ButtonLink } from "@/components/ui/button";
import { CONTROL_CLASS } from "@/components/ui/fields";
import { ORDER_STATUSES } from "@/lib/orders/status";
import { ORDER_STATUS_FILTER_ALL, type OrderListParams } from "@/lib/validation/orders";

/** Search, filter and page size as a plain GET form. */
export function OrderFilters({
  action,
  params,
  showAssignment,
}: {
  action: string;
  params: OrderListParams;
  showAssignment: boolean;
}) {
  const t = useTranslations("Filters");
  const tStatuses = useTranslations("Statuses");
  const isFiltered =
    params.q.length > 0 ||
    params.status !== ORDER_STATUS_FILTER_ALL ||
    params.assignment !== "any";

  return (
    <form
      action={action}
      method="get"
      className="flex flex-col gap-3 border-b border-line px-4 py-3 sm:px-5"
      role="search"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-1.5 lg:col-span-2">
          <label htmlFor="orders-q" className="text-xs font-medium text-ink-muted">
            {t("search")}
          </label>
          <input
            id="orders-q"
            name="q"
            type="search"
            defaultValue={params.q}
            maxLength={120}
            placeholder={t("searchPlaceholder")}
            className={CONTROL_CLASS}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="orders-status" className="text-xs font-medium text-ink-muted">
            {t("status")}
          </label>
          <select
            id="orders-status"
            name="status"
            defaultValue={params.status}
            className={CONTROL_CLASS}
          >
            <option value={ORDER_STATUS_FILTER_ALL}>{t("allStatuses")}</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {tStatuses(status)}
              </option>
            ))}
          </select>
        </div>
        {showAssignment ? (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="orders-assignment"
              className="text-xs font-medium text-ink-muted"
            >
              {t("assignment")}
            </label>
            <select
              id="orders-assignment"
              name="assignment"
              defaultValue={params.assignment}
              className={CONTROL_CLASS}
            >
              <option value="any">{t("any")}</option>
              <option value="unassigned">{t("unassigned")}</option>
              <option value="assigned">{t("assigned")}</option>
            </select>
          </div>
        ) : null}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="orders-per-page"
            className="text-xs font-medium text-ink-muted"
          >
            {t("perPage")}
          </label>
          <select
            id="orders-per-page"
            name="perPage"
            defaultValue={String(params.perPage)}
            className={CONTROL_CLASS}
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" size="sm">
          {t("apply")}
        </Button>
        {isFiltered ? (
          <ButtonLink href={action} variant="ghost" size="sm">
            {t("clear")}
          </ButtonLink>
        ) : null}
      </div>
    </form>
  );
}
