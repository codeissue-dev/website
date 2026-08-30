import type { Metadata } from "next";

import { ActivityList } from "@/components/orders/activity-list";
import { ButtonLink } from "@/components/ui/button";
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
    <div className="flex flex-col gap-5">
      <PageHeading
        title="Overview"
        description="Every figure on this page is counted in PostgreSQL when the page is requested."
        action={
          <ButtonLink href="/admin/orders" size="sm">
            Review projects
          </ButtonLink>
        }
      />
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
              ? "—"
              : `${stats.averageDeliveryDays} ${pluralize(stats.averageDeliveryDays, "day", "days")}`
          }
          detail="Submission to completion"
        />
      </dl>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Panel>
          <PanelHeader
            title="Recent activity"
            description="The latest recorded status changes across the workspace."
          />
          <ActivityList entries={stats.recentActivity} />
        </Panel>
        <div className="flex flex-col gap-5">
          <Panel>
            <PanelHeader title="Projects by status" />
            <dl className="divide-y divide-line">
              {ORDER_STATUSES.map((status) => (
                <div
                  key={status}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5"
                >
                  <dt className="text-sm text-ink-muted">
                    {ORDER_STATUS_LABELS[status]}
                  </dt>
                  <dd className="text-sm font-medium text-ink tabular-nums">
                    {stats.statusCounts[status]}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>
          <Panel>
            <PanelHeader
              title="People"
              actions={
                <ButtonLink href="/admin/users" variant="ghost" size="sm">
                  Manage
                </ButtonLink>
              }
            />
            <dl className="divide-y divide-line">
              {USER_ROLES.map((role) => (
                <div
                  key={role}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5"
                >
                  <dt className="text-sm text-ink-muted">{ROLE_LABELS[role]}</dt>
                  <dd className="text-sm font-medium text-ink tabular-nums">
                    {stats.usersByRole[role]}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>
          <Panel>
            <PanelHeader title="Public content" />
            <dl className="divide-y divide-line">
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
                <dt className="text-sm text-ink-muted">Portfolio published</dt>
                <dd className="text-sm font-medium text-ink tabular-nums">
                  {stats.publishedPortfolioItems}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
                <dt className="text-sm text-ink-muted">Portfolio drafts</dt>
                <dd className="text-sm font-medium text-ink tabular-nums">
                  {stats.draftPortfolioItems}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
                <dt className="text-sm text-ink-muted">Testimonials published</dt>
                <dd className="text-sm font-medium text-ink tabular-nums">
                  {stats.publishedTestimonials}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
                <dt className="text-sm text-ink-muted">Testimonial drafts</dt>
                <dd className="text-sm font-medium text-ink tabular-nums">
                  {stats.draftTestimonials}
                </dd>
              </div>
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  );
}
