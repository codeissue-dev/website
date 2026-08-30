import type { Metadata } from "next";

import { OrderFilters } from "@/components/orders/order-filters";
import { OrderList } from "@/components/orders/order-list";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { requireRoleForPage } from "@/lib/auth/actor";
import { listOrdersForActor } from "@/lib/orders/queries";
import {
  buildOrderListQueryString,
  parseOrderListParams,
} from "@/lib/validation/orders";

export const metadata: Metadata = {
  title: "Projects",
  robots: { index: false, follow: false },
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [actor, rawParams] = await Promise.all([
    requireRoleForPage(["ADMIN"], "/admin/orders"),
    searchParams,
  ]);

  const params = parseOrderListParams(rawParams);
  const result = await listOrdersForActor(actor, params);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-ink">Projects</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Search by reference, title or customer. Open a project to assign it, move its
          status or reply in the chat.
        </p>
      </div>

      <OrderFilters action="/admin/orders" params={params} showAssignment />

      <Panel>
        <PanelHeader
          title={`${result.total} ${result.total === 1 ? "project" : "projects"}`}
          description={
            result.total > 0 ? `Page ${result.page} of ${result.pageCount}` : undefined
          }
        />
        {result.rows.length === 0 ? (
          <EmptyState
            title="No matching projects"
            description="Adjust the filters, or wait for the next request to arrive: new requests appear here as soon as they are submitted."
          />
        ) : (
          <OrderList orders={result.rows} showCustomer showExecutor />
        )}
      </Panel>

      <Pagination
        page={result.page}
        pageCount={result.pageCount}
        total={result.total}
        itemLabel="project"
        hrefForPage={(page) =>
          `/admin/orders${buildOrderListQueryString({ ...params, page })}`
        }
      />
    </div>
  );
}
