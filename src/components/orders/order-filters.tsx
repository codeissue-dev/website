import Link from "next/link";

import { buttonClass } from "@/components/ui/button";
import { CONTROL_CLASS } from "@/components/ui/fields";
import { ORDER_STATUS_LABELS, ORDER_STATUSES } from "@/lib/orders/status";
import { ORDER_STATUS_FILTER_ALL, type OrderListParams } from "@/lib/validation/orders";

/**
 * Search, filter and page size as a plain GET form.
 *
 * No client JavaScript is involved: the browser submits the query string, the
 * server parses it with Zod, and every filtered list is a shareable URL.
 */
export function OrderFilters({
  action,
  params,
  showAssignment,
}: {
  action: string;
  params: OrderListParams;
  showAssignment: boolean;
}) {
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
            Search
          </label>
          <input
            id="orders-q"
            name="q"
            type="search"
            defaultValue={params.q}
            maxLength={120}
            placeholder="Reference, title or description"
            className={CONTROL_CLASS}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="orders-status" className="text-xs font-medium text-ink-muted">
            Status
          </label>
          <select
            id="orders-status"
            name="status"
            defaultValue={params.status}
            className={CONTROL_CLASS}
          >
            <option value={ORDER_STATUS_FILTER_ALL}>All statuses</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {ORDER_STATUS_LABELS[status]}
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
              Assignment
            </label>
            <select
              id="orders-assignment"
              name="assignment"
              defaultValue={params.assignment}
              className={CONTROL_CLASS}
            >
              <option value="any">Any</option>
              <option value="unassigned">Unassigned</option>
              <option value="assigned">Assigned</option>
            </select>
          </div>
        ) : null}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="orders-per-page"
            className="text-xs font-medium text-ink-muted"
          >
            Per page
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
        <button type="submit" className={buttonClass({ size: "sm" })}>
          Apply
        </button>
        {isFiltered ? (
          <Link href={action} className={buttonClass({ variant: "ghost", size: "sm" })}>
            Clear
          </Link>
        ) : null}
      </div>
    </form>
  );
}
