import type { Metadata } from "next";
import Link from "next/link";

import { OrderFilters } from "@/components/orders/order-filters";
import { OrderList } from "@/components/orders/order-list";
import { buttonClass } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
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

const TITLES: Record<string, { title: string; description: string }> = {
  CUSTOMER: {
    title: "Your projects",
    description: "Every request you have submitted, newest first.",
  },
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
  // The query itself is scoped to the actor: a customer cannot widen it with
  // query parameters, and an executor only ever sees assigned work.
  const result = await listOrdersForActor(actor, params);
  const copy = TITLES[actor.role] ?? TITLES.CUSTOMER;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">
            {copy?.title}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">{copy?.description}</p>
        </div>
        {actor.role === "CUSTOMER" ? (
          <Link href="/orders/new" className={buttonClass({ size: "sm" })}>
            New request
          </Link>
        ) : null}
      </div>

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
                <Link href="/orders/new" className={buttonClass({ size: "sm" })}>
                  Submit your first request
                </Link>
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
