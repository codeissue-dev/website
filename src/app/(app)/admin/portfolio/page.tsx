import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Portfolio",
  robots: { index: false, follow: false },
};

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
  await requireRoleForPage(["ADMIN"], "/admin/portfolio");
  const items = await listAllPortfolioItems();

  const published = items.filter((item) => item.published).length;

  return (
    <div className="flex flex-col gap-5">
      <PageHeading
        title="Portfolio"
        description={
          <>
            Case studies for the public site. {published} of {items.length}{" "}
            {items.length === 1 ? "item is" : "items are"} published. Nothing appears
            publicly until you publish it.
          </>
        }
      />

      <Panel>
        <PanelHeader
          title="New case study"
          description="Write it now, publish it when the customer has approved the wording."
        />
        <PanelBody>
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
              Open the form
            </summary>
            <div className="mt-4">
              <PortfolioForm
                action={createPortfolioItemAction}
                defaults={emptyPortfolioDefaults}
                submitLabel="Create case study"
              />
            </div>
          </details>
        </PanelBody>
      </Panel>

      {items.length === 0 ? (
        <Panel>
          <EmptyState
            title="No case studies yet"
            description="The public portfolio section stays in its empty state until a real delivered project is documented here."
          />
        </Panel>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <Panel key={item.id}>
              <PanelHeader
                title={item.title}
                description={`/work/${item.slug} \u00b7 ${
                  item.published
                    ? `published ${item.publishedAt === null ? "" : formatDate(item.publishedAt)}`.trim()
                    : "draft"
                } \u00b7 sort ${item.sortOrder}`}
                actions={
                  <ContentRowActions
                    id={item.id}
                    published={item.published}
                    setPublishedAction={setPortfolioItemPublishedAction}
                    deleteAction={deletePortfolioItemAction}
                    deleteConfirmMessage={`Delete "${item.title}"? This cannot be undone.`}
                  />
                }
              />
              <PanelBody>
                <details>
                  <summary className="cursor-pointer text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                    Edit
                  </summary>
                  <div className="mt-4">
                    <PortfolioForm
                      action={updatePortfolioItemAction}
                      defaults={toDefaults(item)}
                      itemId={item.id}
                      submitLabel="Save changes"
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
