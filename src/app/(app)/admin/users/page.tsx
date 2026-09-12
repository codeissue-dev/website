import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { UserRoleForm } from "@/components/forms/user-role-form";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeading } from "@/components/ui/page-heading";
import { CONTROL_CLASS } from "@/components/ui/fields";
import { Pagination } from "@/components/ui/pagination";
import { Panel, PanelHeader } from "@/components/ui/panel";
import { RoleBadge } from "@/components/ui/status-badge";
import { requireRoleForPage } from "@/lib/auth/actor";
import { USER_ROLES } from "@/lib/auth/roles";
import { countAdmins, listUsers } from "@/lib/users/queries";
import { formatDate } from "@/lib/utils";
import { buildUserListQueryString, parseUserListParams } from "@/lib/validation/users";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.users");
  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [actor, rawParams, t, tRoles] = await Promise.all([
    requireRoleForPage(["ADMIN"], "/admin/users"),
    searchParams,
    getTranslations("Admin.users"),
    getTranslations("Roles"),
  ]);

  const params = parseUserListParams(rawParams);
  const [result, adminCount] = await Promise.all([listUsers(params), countAdmins()]);
  const isFiltered = params.q.length > 0 || params.role !== "ALL";

  return (
    <div className="flex flex-col gap-5">
      <PageHeading title={t("title")} description={t("description")} />

      <Panel>
        <form
          action="/admin/users"
          method="get"
          className="flex flex-col gap-3 border-b border-line px-4 py-3 sm:px-5"
          role="search"
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1.5 lg:col-span-2">
              <label htmlFor="users-q" className="text-xs font-medium text-ink-muted">
                {t("search")}
              </label>
              <input
                id="users-q"
                name="q"
                type="search"
                defaultValue={params.q}
                maxLength={120}
                placeholder={t("searchPlaceholder")}
                className={CONTROL_CLASS}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="users-role"
                className="text-xs font-medium text-ink-muted"
              >
                {t("role")}
              </label>
              <select
                id="users-role"
                name="role"
                defaultValue={params.role}
                className={CONTROL_CLASS}
              >
                <option value="ALL">{t("allRoles")}</option>
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {tRoles(role)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="users-per-page"
                className="text-xs font-medium text-ink-muted"
              >
                {t("perPage")}
              </label>
              <select
                id="users-per-page"
                name="perPage"
                defaultValue={String(params.perPage)}
                className={CONTROL_CLASS}
              >
                {[20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" size="sm">
              {t("apply")}
            </Button>
            {isFiltered ? (
              <ButtonLink href="/admin/users" variant="ghost" size="sm">
                {t("clear")}
              </ButtonLink>
            ) : null}
          </div>
        </form>

        <PanelHeader
          title={t("count", { count: result.total })}
          description={t("adminCount", { count: adminCount })}
        />

        {result.rows.length === 0 ? (
          <EmptyState title={t("emptyTitle")} description={t("emptyBody")} />
        ) : (
          <ul className="divide-y divide-line">
            {result.rows.map((user) => (
              <li
                key={user.id}
                className="flex flex-col gap-3 px-4 py-4 sm:px-5 lg:flex-row lg:items-start lg:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-medium text-ink">
                      {user.name ?? user.email}
                    </p>
                    <RoleBadge role={user.role} />
                    {user.id === actor.id ? (
                      <span className="text-xs text-ink-subtle">{t("you")}</span>
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-sm text-ink-muted">{user.email}</p>
                  <p className="mt-1 text-xs text-ink-subtle">
                    {t("joined", { date: formatDate(user.createdAt) })} &middot;{" "}
                    {t("requests", { count: user.orderCount })} &middot;{" "}
                    {t("assigned", { count: user.assignedCount })}
                  </p>
                </div>
                <div className="lg:w-72 lg:shrink-0">
                  <UserRoleForm
                    userId={user.id}
                    role={user.role}
                    isSelf={user.id === actor.id}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Pagination
        page={result.page}
        pageCount={result.pageCount}
        total={result.total}
        itemLabel={t("title")}
        hrefForPage={(page) =>
          `/admin/users${buildUserListQueryString({ ...params, page })}`
        }
      />
    </div>
  );
}
