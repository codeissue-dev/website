import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
import { ORDER_STATUSES } from "@/lib/orders/status";
import { loadCustomerStats, loadExecutorStats } from "@/lib/stats/queries";
import { ORDER_STATUS_FILTER_ALL } from "@/lib/validation/orders";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Dashboard");
  return { title: t("titleCustomer"), robots: { index: false, follow: false } };
}

export default async function DashboardPage() {
  const [actor, t, tStatuses] = await Promise.all([
    requireActorForPage("/dashboard"),
    getTranslations("Dashboard"),
    getTranslations("Statuses"),
  ]);
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
    label: tStatuses(status),
    value: stats.statusCounts[status],
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title={isExecutor ? t("titleExecutor") : t("titleCustomer")}
        description={isExecutor ? t("descriptionExecutor") : t("descriptionCustomer")}
        action={
          isExecutor ? undefined : (
            <ButtonLink href="/orders/new" size="sm">
              {t("newRequest")}
            </ButtonLink>
          )
        }
      />
      <dl className="grid gap-4 sm:grid-cols-3">
        <Stat
          label={isExecutor ? t("assignedProjects") : t("projects")}
          value={stats.totalOrders}
        />
        <Stat
          label={t("inProgress")}
          value={stats.openOrders}
          detail={t("notYetClosed")}
        />
        <Stat label={t("completed")} value={stats.completedOrders} />
      </dl>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <Panel className="h-fit">
          <PanelHeader
            title={t("latest")}
            actions={
              <ButtonLink href="/orders" variant="ghost" size="sm">
                {t("viewAll")}
              </ButtonLink>
            }
          />
          {recentOrders.rows.length === 0 ? (
            <EmptyState
              className="m-4"
              title={isExecutor ? t("emptyExecutorTitle") : t("emptyCustomerTitle")}
              description={isExecutor ? t("emptyExecutorBody") : t("emptyCustomerBody")}
              action={
                isExecutor ? undefined : (
                  <ButtonLink href="/orders/new" size="sm">
                    {t("submitRequest")}
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
          <Panel className="flex-1">
            <PanelHeader title={t("byStatus")} />
            {statusRows.length === 0 ? (
              <p className="px-4 py-5 text-sm text-ink-muted">{t("nothingToCount")}</p>
            ) : (
              <CountList rows={statusRows} />
            )}
          </Panel>
          <Panel className="flex-1">
            <PanelHeader title={t("recentActivity")} />
            <ActivityList entries={stats.recentActivity} />
          </Panel>
        </div>
      </div>
    </div>
  );
}
