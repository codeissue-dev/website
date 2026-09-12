import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

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
import { PageHeading } from "@/components/ui/page-heading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.orders");
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [actor, rawParams, t, tOrders] = await Promise.all([
    requireRoleForPage(["ADMIN"], "/admin/orders"),
    searchParams,
    getTranslations("Admin.orders"),
    getTranslations("Orders"),
  ]);

  const params = parseOrderListParams(rawParams);
  const result = await listOrdersForActor(actor, params);

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title={t("title")} description={t("description")} />

      <OrderFilters action="/admin/orders" params={params} showAssignment />

      <Panel>
        <PanelHeader
          title={tOrders("count", { count: result.total })}
          description={
            result.total > 0
              ? tOrders("page", { page: result.page, pageCount: result.pageCount })
              : undefined
          }
        />
        {result.rows.length === 0 ? (
          <EmptyState title={t("emptyTitle")} description={t("emptyBody")} />
        ) : (
          <OrderList orders={result.rows} showCustomer showExecutor />
        )}
      </Panel>

      <Pagination
        page={result.page}
        pageCount={result.pageCount}
        total={result.total}
        itemLabel={t("title")}
        hrefForPage={(page) =>
          `/admin/orders${buildOrderListQueryString({ ...params, page })}`
        }
      />
    </div>
  );
}
