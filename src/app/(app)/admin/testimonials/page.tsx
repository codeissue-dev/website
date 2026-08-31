import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "Testimonials",
  robots: { index: false, follow: false },
};

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
  await requireRoleForPage(["ADMIN"], "/admin/testimonials");

  const [testimonials, deliveredOrders] = await Promise.all([
    listAllTestimonials(),
    listDeliveredOrderOptions(),
  ]);

  const published = testimonials.filter((testimonial) => testimonial.published).length;

  return (
    <div className="flex flex-col gap-5">
      <PageHeading
        title="Testimonials"
        description={
          <>
            Real quotes, entered here and stored in the database. {published} of{" "}
            {testimonials.length}{" "}
            {testimonials.length === 1 ? "quote is" : "quotes are"} published. Publish
            only what the author has approved.
          </>
        }
      />

      <Panel>
        <PanelHeader
          title="New testimonial"
          description="Optionally link the quote to the completed project it refers to."
        />
        <PanelBody>
          <details>
            <summary className="cursor-pointer text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
              Open the form
            </summary>
            <div className="mt-4">
              <TestimonialForm
                action={createTestimonialAction}
                defaults={emptyTestimonialDefaults}
                submitLabel="Create testimonial"
                deliveredOrders={deliveredOrders}
              />
            </div>
          </details>
        </PanelBody>
      </Panel>

      {testimonials.length === 0 ? (
        <Panel>
          <EmptyState
            title="No testimonials yet"
            description="The public site shows a deliberate empty state rather than invented praise until a real quote is published here."
          />
        </Panel>
      ) : (
        <div className="flex flex-col gap-4">
          {testimonials.map((testimonial) => (
            <Panel key={testimonial.id}>
              <PanelHeader
                title={testimonial.authorName}
                description={`${
                  testimonial.published
                    ? `Published ${testimonial.publishedAt === null ? "" : formatDate(testimonial.publishedAt)}`.trim()
                    : "Draft"
                } \u00b7 sort ${testimonial.sortOrder}${
                  testimonial.rating === null ? "" : ` \u00b7 ${testimonial.rating}/5`
                }`}
                actions={
                  <ContentRowActions
                    id={testimonial.id}
                    published={testimonial.published}
                    setPublishedAction={setTestimonialPublishedAction}
                    deleteAction={deleteTestimonialAction}
                    deleteConfirmMessage={`Delete the testimonial from ${testimonial.authorName}? This cannot be undone.`}
                  />
                }
              />
              <PanelBody>
                <blockquote className="border-l border-line pl-4 text-sm text-ink-muted">
                  {testimonial.quote}
                </blockquote>
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                    Edit
                  </summary>
                  <div className="mt-4">
                    <TestimonialForm
                      action={updateTestimonialAction}
                      defaults={toDefaults(testimonial)}
                      testimonialId={testimonial.id}
                      submitLabel="Save changes"
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
