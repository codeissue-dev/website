import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ActivityList } from "@/components/orders/activity-list";
import { OrderList } from "@/components/orders/order-list";
import { ButtonLink } from "@/components/ui/button";
import { CountList } from "@/components/ui/count-list";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeading } from "@/components/ui/page-heading";
import { Panel, PanelHeader, Stat } from "@/components/ui/panel";
import { requireActorForPage } from "@/lib/auth/actor";
import { listOrdersForActor } from "@/lib/orders/queries";
import { ORDER_STATUS_LABELS, ORDER_STATUSES } from "@/lib/orders/status";
import { loadCustomerStats, loadExecutorStats } from "@/lib/stats/queries";
import { ORDER_STATUS_FILTER_ALL } from "@/lib/validation/orders";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const actor = await requireActorForPage("/dashboard");
  if (actor.role === "ADMIN") redirect("/admin");

  const isExecutor = actor.role === "EXECUTOR";
  const [stats, recentOrders] = await Promise.all([
    isExecutor ? loadExecutorStats(actor.id) : loadCustomerStats(actor.id),
    listOrdersForActor(actor, {
      q: "",
      status: ORDER_STATUS_FILTER_ALL,
      assignment: "any",
      page: 1,
      perPage: 5,
    }),
  ]);
  const statusRows = ORDER_STATUSES.filter(
    (status) => stats.statusCounts[status] > 0,
  ).map((status) => ({
    label: ORDER_STATUS_LABELS[status],
    value: stats.statusCounts[status],
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title={isExecutor ? "Your work" : "Your projects"}
        description={
          isExecutor
            ? "Everything assigned to you, with the latest status changes."
            : "A summary of your requests and where each one stands."
        }
        action={
          isExecutor ? undefined : (
            <ButtonLink href="/orders/new" size="sm">
              New request
            </ButtonLink>
          )
        }
      />
      <dl className="grid gap-4 sm:grid-cols-3">
        <Stat
          label={isExecutor ? "Assigned projects" : "Projects"}
          value={stats.totalOrders}
        />
        <Stat label="In progress" value={stats.openOrders} detail="Not yet closed" />
        <Stat label="Completed" value={stats.completedOrders} />
      </dl>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <Panel>
          <PanelHeader
            title="Latest projects"
            actions={
              <ButtonLink href="/orders" variant="ghost" size="sm">
                View all projects
              </ButtonLink>
            }
          />
          {recentOrders.rows.length === 0 ? (
            <EmptyState
              className="m-4"
              title={isExecutor ? "Nothing assigned yet" : "No requests yet"}
              description={
                isExecutor
                  ? "When an administrator assigns you a project it appears here with its full history and chat."
                  : "Describe what you need built and we will reply in the project chat."
              }
              action={
                isExecutor ? undefined : (
                  <ButtonLink href="/orders/new" size="sm">
                    Submit a request
                  </ButtonLink>
                )
              }
            />
          ) : (
            <OrderList
              orders={recentOrders.rows}
              showCustomer={isExecutor}
              showExecutor={!isExecutor}
            />
          )}
        </Panel>
        <div className="flex flex-col gap-6">
          <Panel>
            <PanelHeader title="By status" />
            {statusRows.length === 0 ? (
              <p className="px-4 py-5 text-sm text-ink-muted">Nothing to count yet.</p>
            ) : (
              <CountList rows={statusRows} />
            )}
          </Panel>
          <Panel>
            <PanelHeader title="Recent activity" />
            <ActivityList entries={stats.recentActivity} />
          </Panel>
        </div>
      </div>
    </div>
  );
}
