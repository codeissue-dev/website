import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import {
  createPortfolioItemAction,
  deletePortfolioItemAction,
  setPortfolioItemPublishedAction,
  updatePortfolioItemAction,
} from "@/actions/content";
import { ContentRowActions } from "@/components/forms/content-row-actions";
import {
  emptyPortfolioDefaults,
  PortfolioForm,
  type PortfolioFormDefaults,
} from "@/components/forms/portfolio-form";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { requireRoleForPage } from "@/lib/auth/actor";
import { listAllPortfolioItems } from "@/lib/content/queries";
import type { PortfolioItemRow } from "@/lib/db/schema";
import { formatDate } from "@/lib/utils";
import { PageHeading } from "@/components/ui/page-heading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.portfolio");
  return { title: t("title"), robots: { index: false, follow: false } };
}

/** Database row to plain form strings, so the client form holds no DB types. */
function toDefaults(item: PortfolioItemRow): PortfolioFormDefaults {
  return {
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    problem: item.problem,
    solution: item.solution,
    techStack: item.techStack.join(", "),
    industry: item.industry ?? "",
    projectUrl: item.projectUrl ?? "",
    deliveryWeeks: item.deliveryWeeks === null ? "" : String(item.deliveryWeeks),
    sortOrder: String(item.sortOrder),
    published: item.published,
  };
}

export default async function AdminPortfolioPage() {
  const [t] = await Promise.all([
    getTranslations("Admin.portfolio"),
    requireRoleForPage(["ADMIN"], "/admin/portfolio"),
  ]);
  const items = await listAllPortfolioItems();

  const published = items.filter((item) => item.published).length;

  return (
    <div className="flex flex-col gap-5">
      <PageHeading
        title={t("title")}
        description={t("description", { published, total: items.length })}
      />

      <Panel>
        <PanelHeader title={t("newTitle")} description={t("newHint")} />
        <PanelBody>
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
              {t("openForm")}
            </summary>
            <div className="mt-4">
              <PortfolioForm
                action={createPortfolioItemAction}
                defaults={emptyPortfolioDefaults}
                submitLabel={t("create")}
              />
            </div>
          </details>
        </PanelBody>
      </Panel>

      {items.length === 0 ? (
        <Panel>
          <EmptyState title={t("emptyTitle")} description={t("emptyBody")} />
        </Panel>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <Panel key={item.id}>
              <PanelHeader
                title={item.title}
                description={`/work/${item.slug} \u00b7 ${
                  item.published
                    ? t("publishedAt", {
                        date:
                          item.publishedAt === null ? "" : formatDate(item.publishedAt),
                      }).trim()
                    : t("draft")
                } \u00b7 ${t("sort", { value: item.sortOrder })}`}
                actions={
                  <ContentRowActions
                    id={item.id}
                    published={item.published}
                    setPublishedAction={setPortfolioItemPublishedAction}
                    deleteAction={deletePortfolioItemAction}
                    deleteConfirmMessage={t("deleteConfirm", { title: item.title })}
                  />
                }
              />
              <PanelBody>
                <details>
                  <summary className="cursor-pointer text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                    {t("edit")}
                  </summary>
                  <div className="mt-4">
                    <PortfolioForm
                      action={updatePortfolioItemAction}
                      defaults={toDefaults(item)}
                      itemId={item.id}
                      submitLabel={t("save")}
                    />
                  </div>
                </details>
                <p className="mt-3 text-sm text-ink-muted">{item.summary}</p>
              </PanelBody>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
