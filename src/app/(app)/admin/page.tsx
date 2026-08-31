import type { Metadata } from "next";

import { ActivityList } from "@/components/orders/activity-list";
import { ButtonLink } from "@/components/ui/button";
import { CountList } from "@/components/ui/count-list";
import { PageHeading } from "@/components/ui/page-heading";
import { Panel, PanelHeader, Stat } from "@/components/ui/panel";
import { requireRoleForPage } from "@/lib/auth/actor";
import { ROLE_LABELS, USER_ROLES } from "@/lib/auth/roles";
import { ORDER_STATUS_LABELS, ORDER_STATUSES } from "@/lib/orders/status";
import { loadAdminStats } from "@/lib/stats/queries";
import { pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminOverviewPage() {
  await requireRoleForPage(["ADMIN"], "/admin");
  const stats = await loadAdminStats();

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="Overview"
        description="Every figure on this page is counted in PostgreSQL when the page is requested."
        action={
          <ButtonLink href="/admin/orders" size="sm">
            Review projects
          </ButtonLink>
        }
      />
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Projects" value={stats.totalOrders} />
        <Stat
          label="Open"
          value={stats.openOrders}
          detail={`${stats.unassignedOrders} ${pluralize(stats.unassignedOrders, "is", "are")} unassigned`}
        />
        <Stat
          label="Completed"
          value={stats.completedOrders}
          detail={`${stats.completedLast30Days} in the last 30 days`}
        />
        <Stat
          label="Average delivery"
          value={
            stats.averageDeliveryDays === null
              ? "no data yet"
              : `${stats.averageDeliveryDays} ${pluralize(stats.averageDeliveryDays, "day", "days")}`
          }
          detail="Submission to completion"
        />
      </dl>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <Panel>
          <PanelHeader
            title="Recent activity"
            description="The latest recorded status changes across the workspace."
          />
          <ActivityList entries={stats.recentActivity} />
        </Panel>
        <div className="flex flex-col gap-6">
          <Panel>
            <PanelHeader title="Projects by status" />
            <CountList
              rows={ORDER_STATUSES.map((status) => ({
                label: ORDER_STATUS_LABELS[status],
                value: stats.statusCounts[status],
              }))}
            />
          </Panel>
          <Panel>
            <PanelHeader
              title="People"
              actions={
                <ButtonLink href="/admin/users" variant="ghost" size="sm">
                  Manage people
                </ButtonLink>
              }
            />
            <CountList
              rows={USER_ROLES.map((role) => ({
                label: ROLE_LABELS[role],
                value: stats.usersByRole[role],
              }))}
            />
          </Panel>
          <Panel>
            <PanelHeader title="Public content" />
            <CountList
              rows={[
                { label: "Portfolio published", value: stats.publishedPortfolioItems },
                { label: "Portfolio drafts", value: stats.draftPortfolioItems },
                { label: "Testimonials published", value: stats.publishedTestimonials },
                { label: "Testimonial drafts", value: stats.draftTestimonials },
              ]}
            />
          </Panel>
        </div>
      </div>
    </div>
  );
}
