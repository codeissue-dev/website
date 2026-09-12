import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import {
  createTestimonialAction,
  deleteTestimonialAction,
  setTestimonialPublishedAction,
  updateTestimonialAction,
} from "@/actions/content";
import { ContentRowActions } from "@/components/forms/content-row-actions";
import {
  emptyTestimonialDefaults,
  TestimonialForm,
  type TestimonialFormDefaults,
} from "@/components/forms/testimonial-form";
import { EmptyState } from "@/components/ui/empty-state";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";
import { requireRoleForPage } from "@/lib/auth/actor";
import { listAllTestimonials, listDeliveredOrderOptions } from "@/lib/content/queries";
import type { TestimonialRow } from "@/lib/db/schema";
import { formatDate } from "@/lib/utils";
import { PageHeading } from "@/components/ui/page-heading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Admin.testimonials");
  return { title: t("title"), robots: { index: false, follow: false } };
}

function toDefaults(testimonial: TestimonialRow): TestimonialFormDefaults {
  return {
    authorName: testimonial.authorName,
    authorRole: testimonial.authorRole ?? "",
    company: testimonial.company ?? "",
    quote: testimonial.quote,
    rating: testimonial.rating === null ? "" : String(testimonial.rating),
    orderId: testimonial.orderId ?? "",
    sortOrder: String(testimonial.sortOrder),
    published: testimonial.published,
  };
}

export default async function AdminTestimonialsPage() {
  const [t] = await Promise.all([
    getTranslations("Admin.testimonials"),
    requireRoleForPage(["ADMIN"], "/admin/testimonials"),
  ]);

  const [testimonials, deliveredOrders] = await Promise.all([
    listAllTestimonials(),
    listDeliveredOrderOptions(),
  ]);

  const published = testimonials.filter((testimonial) => testimonial.published).length;

  return (
    <div className="flex flex-col gap-5">
      <PageHeading
        title={t("title")}
        description={t("description", {
          published,
          total: testimonials.length,
        })}
      />

      <Panel>
        <PanelHeader title={t("newTitle")} description={t("newHint")} />
        <PanelBody>
          <details>
            <summary className="cursor-pointer text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
              {t("openForm")}
            </summary>
            <div className="mt-4">
              <TestimonialForm
                action={createTestimonialAction}
                defaults={emptyTestimonialDefaults}
                submitLabel={t("create")}
                deliveredOrders={deliveredOrders}
              />
            </div>
          </details>
        </PanelBody>
      </Panel>

      {testimonials.length === 0 ? (
        <Panel>
          <EmptyState title={t("emptyTitle")} description={t("emptyBody")} />
        </Panel>
      ) : (
        <div className="flex flex-col gap-4">
          {testimonials.map((testimonial) => (
            <Panel key={testimonial.id}>
              <PanelHeader
                title={testimonial.authorName}
                description={`${
                  testimonial.published
                    ? t("publishedAt", {
                        date:
                          testimonial.publishedAt === null
                            ? ""
                            : formatDate(testimonial.publishedAt),
                      }).trim()
                    : t("draft")
                } \u00b7 ${t("sort", { value: testimonial.sortOrder })}${
                  testimonial.rating === null
                    ? ""
                    : ` \u00b7 ${t("rating", { rating: testimonial.rating })}`
                }`}
                actions={
                  <ContentRowActions
                    id={testimonial.id}
                    published={testimonial.published}
                    setPublishedAction={setTestimonialPublishedAction}
                    deleteAction={deleteTestimonialAction}
                    deleteConfirmMessage={t("deleteConfirm", {
                      author: testimonial.authorName,
                    })}
                  />
                }
              />
              <PanelBody>
                <blockquote className="border-l border-line pl-4 text-sm text-ink-muted">
                  {testimonial.quote}
                </blockquote>
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                    {t("edit")}
                  </summary>
                  <div className="mt-4">
                    <TestimonialForm
                      action={updateTestimonialAction}
                      defaults={toDefaults(testimonial)}
                      testimonialId={testimonial.id}
                      submitLabel={t("save")}
                      deliveredOrders={deliveredOrders}
                    />
                  </div>
                </details>
              </PanelBody>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
