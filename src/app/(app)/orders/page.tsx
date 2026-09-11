import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { OrderFilters } from "@/components/orders/order-filters";
import { OrderList } from "@/components/orders/order-list";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeading } from "@/components/ui/page-heading";
import { Pagination } from "@/components/ui/pagination";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { requireActorForPage } from "@/lib/auth/actor";
import { listOrdersForActor } from "@/lib/orders/queries";
import {
  buildOrderListQueryString,
  parseOrderListParams,
} from "@/lib/validation/orders";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Orders");
  return { title: t("titleCustomer"), robots: { index: false, follow: false } };
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [actor, rawParams, t] = await Promise.all([
    requireActorForPage("/orders"),
    searchParams,
    getTranslations("Orders"),
  ]);
  const params = parseOrderListParams(rawParams);
  const result = await listOrdersForActor(actor, params);

  const copy = {
    CUSTOMER: { title: t("titleCustomer"), description: t("descriptionCustomer") },
    EXECUTOR: { title: t("titleExecutor"), description: t("descriptionExecutor") },
    ADMIN: { title: t("titleAdmin"), description: t("descriptionAdmin") },
  }[actor.role];

  return (
    <div className="flex flex-col gap-5">
      <PageHeading
        title={copy.title}
        description={copy.description}
        action={
          actor.role === "CUSTOMER" ? (
            <ButtonLink href="/orders/new" size="sm">
              {t("newRequest")}
            </ButtonLink>
          ) : undefined
        }
      />
      <OrderFilters
        action="/orders"
        params={params}
        showAssignment={actor.role === "ADMIN"}
      />
      <Panel>
        <PanelHeader
          title={t("count", { count: result.total })}
          description={
            result.total > 0
              ? t("page", { page: result.page, pageCount: result.pageCount })
              : undefined
          }
        />
        {result.rows.length === 0 ? (
          <EmptyState
            title={t("emptyTitle")}
            description={
              actor.role === "CUSTOMER" ? t("emptyCustomer") : t("emptyOther")
            }
            action={
              actor.role === "CUSTOMER" ? (
                <ButtonLink href="/orders/new" size="sm">
                  {t("submitFirst")}
                </ButtonLink>
              ) : undefined
            }
          />
        ) : (
          <OrderList
            orders={result.rows}
            showCustomer={actor.role !== "CUSTOMER"}
            showExecutor={actor.role !== "EXECUTOR"}
          />
        )}
      </Panel>
      <Pagination
        page={result.page}
        pageCount={result.pageCount}
        total={result.total}
        itemLabel="project"
        hrefForPage={(page) =>
          `/orders${buildOrderListQueryString({ ...params, page })}`
        }
      />
    </div>
  );
}
