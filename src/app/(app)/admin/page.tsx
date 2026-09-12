import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ActivityList } from "@/components/orders/activity-list";
import { ButtonLink } from "@/components/ui/button";
import { CountList } from "@/components/ui/count-list";
import { PageHeading } from "@/components/ui/page-heading";
import { Panel, PanelHeader, Stat } from "@/components/ui/panel";
import { requireRoleForPage } from "@/lib/auth/actor";
import { USER_ROLES } from "@/lib/auth/roles";
import { ORDER_STATUSES } from "@/lib/orders/status";
import { loadAdminStats } from "@/lib/stats/queries";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.overview");
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function AdminOverviewPage() {
  await requireRoleForPage(["ADMIN"], "/admin");
  const [t, tStatuses, tRoles] = await Promise.all([
    getTranslations("Admin.overview"),
    getTranslations("Statuses"),
    getTranslations("Roles"),
  ]);
  const stats = await loadAdminStats();

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title={t("title")}
        description={t("description")}
        action={
          <ButtonLink href="/admin/orders" size="sm">
            {t("reviewProjects")}
          </ButtonLink>
        }
      />
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={t("projects")} value={stats.totalOrders} />
        <Stat
          label={t("open")}
          value={stats.openOrders}
          detail={t("unassignedDetail", { count: stats.unassignedOrders })}
        />
        <Stat
          label={t("completed")}
          value={stats.completedOrders}
          detail={t("last30", { count: stats.completedLast30Days })}
        />
        <Stat
          label={t("avgDelivery")}
          value={
            stats.averageDeliveryDays === null
              ? t("noData")
              : t("days", { count: stats.averageDeliveryDays })
          }
          detail={t("submissionToCompletion")}
        />
      </dl>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <Panel>
          <PanelHeader title={t("recentActivity")} description={t("recentHint")} />
          <ActivityList entries={stats.recentActivity} />
        </Panel>
        <div className="flex flex-col gap-6">
          <Panel>
            <PanelHeader title={t("byStatus")} />
            <CountList
              rows={ORDER_STATUSES.map((status) => ({
                label: tStatuses(status),
                value: stats.statusCounts[status],
              }))}
            />
          </Panel>
          <Panel>
            <PanelHeader
              title={t("people")}
              actions={
                <ButtonLink href="/admin/users" variant="ghost" size="sm">
                  {t("manage")}
                </ButtonLink>
              }
            />
            <CountList
              rows={USER_ROLES.map((role) => ({
                label: tRoles(role),
                value: stats.usersByRole[role],
              }))}
            />
          </Panel>
          <Panel>
            <PanelHeader title={t("publicContent")} />
            <CountList
              rows={[
                {
                  label: t("portfolioPublished"),
                  value: stats.publishedPortfolioItems,
                },
                { label: t("portfolioDrafts"), value: stats.draftPortfolioItems },
                {
                  label: t("testimonialsPublished"),
                  value: stats.publishedTestimonials,
                },
                { label: t("testimonialsDrafts"), value: stats.draftTestimonials },
              ]}
            />
          </Panel>
        </div>
      </div>
    </div>
  );
}
