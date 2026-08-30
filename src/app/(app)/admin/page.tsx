import type { Metadata } from "next";
import Link from "next/link";

import { ActivityList } from "@/components/orders/activity-list";
import { buttonClass } from "@/components/ui/button";
import { Panel, PanelHeader, Stat } from "@/components/ui/panel";
import { requireRoleForPage } from "@/lib/auth/actor";
import { ORDER_STATUS_LABELS, ORDER_STATUSES } from "@/lib/orders/status";
import { loadAdminStats } from "@/lib/stats/queries";
import { ROLE_LABELS, USER_ROLES } from "@/lib/auth/roles";
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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-ink">Overview</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Every figure on this page is counted in PostgreSQL when the page is
            requested.
          </p>
        </div>
        <Link href="/admin/orders" className={buttonClass({ size: "sm" })}>
          Review projects
        </Link>
      </div>

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
              ? "\u2014"
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
                <Link
                  href="/admin/users"
                  className={buttonClass({ variant: "ghost", size: "sm" })}
                >
                  Manage
                </Link>
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
