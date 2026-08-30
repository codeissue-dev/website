import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Projects",
  robots: { index: false, follow: false },
};

const CUSTOMER_COPY = {
  title: "Your projects",
  description: "Every request you have submitted, newest first.",
};

const TITLES: Record<string, typeof CUSTOMER_COPY> = {
  CUSTOMER: CUSTOMER_COPY,
  EXECUTOR: {
    title: "Assigned work",
    description: "Projects assigned to you. Nothing else is visible here.",
  },
  ADMIN: {
    title: "All projects",
    description: "Every project in the workspace.",
  },
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [actor, rawParams] = await Promise.all([
    requireActorForPage("/orders"),
    searchParams,
  ]);
  const params = parseOrderListParams(rawParams);
  const result = await listOrdersForActor(actor, params);
  const copy = TITLES[actor.role] ?? CUSTOMER_COPY;

  return (
    <div className="flex flex-col gap-5">
      <PageHeading
        title={copy.title}
        description={copy.description}
        action={
          actor.role === "CUSTOMER" ? (
            <ButtonLink href="/orders/new" size="sm">
              New request
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
          title={`${result.total} ${result.total === 1 ? "project" : "projects"}`}
          description={
            result.total > 0 ? `Page ${result.page} of ${result.pageCount}` : undefined
          }
        />
        {result.rows.length === 0 ? (
          <EmptyState
            title="Nothing to show"
            description={
              actor.role === "CUSTOMER"
                ? "You have not submitted a project request yet, or no request matches these filters."
                : "No project matches these filters."
            }
            action={
              actor.role === "CUSTOMER" ? (
                <ButtonLink href="/orders/new" size="sm">
                  Submit your first request
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
