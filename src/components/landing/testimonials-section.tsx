import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/reveal";
import { EmptyState } from "@/components/ui/empty-state";
import { Section, SectionSplit } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PublishedTestimonial } from "@/lib/content/queries";
import { initials } from "@/lib/utils";

function Review({
  testimonial,
  ratingLabel,
}: {
  testimonial: PublishedTestimonial;
  ratingLabel: string | null;
}) {
  const details = [testimonial.authorRole, testimonial.company].filter(
    (value): value is string => value !== null && value.length > 0,
  );

  return (
    <figure className="review">
      {ratingLabel === null ? null : <p className="review-rating">{ratingLabel}</p>}
      <blockquote className="review-quote mt-2">{testimonial.quote}</blockquote>
      <figcaption className="review-attribution">
        <span className="review-avatar" aria-hidden="true">
          {initials(testimonial.authorName)}
        </span>
        <span>
          <strong>{testimonial.authorName}</strong>
          {details.length > 0 ? details.join(", ") : null}
        </span>
      </figcaption>
    </figure>
  );
}

/** Every quote is stored in the CMS and published with the customer's approval. */
export async function TestimonialsSection({
  testimonials,
}: {
  testimonials: PublishedTestimonial[];
}) {
  const t = await getTranslations("Testimonials");

  return (
    <Section id="testimonials" labelledBy="testimonials-heading">
      <SectionSplit
        sticky
        aside={
          <>
            <SectionHeading
              id="testimonials-heading"
              title={t("title")}
              description={t("description")}
            />
            <Reveal className="mt-7">
              <p className="note">{t("note")}</p>
            </Reveal>
          </>
        }
      >
        {testimonials.length === 0 ? (
          <EmptyState
            className="self-start"
            title={t("empty.title")}
            description={t("empty.description")}
          />
        ) : (
          <Reveal>
            <ul className="grid gap-8 sm:grid-cols-2">
              {testimonials.map((testimonial) => (
                <li key={testimonial.id}>
                  <Review
                    testimonial={testimonial}
                    ratingLabel={
                      testimonial.rating === null
                        ? null
                        : t("outOfFive", { rating: testimonial.rating })
                    }
                  />
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </SectionSplit>
    </Section>
  );
}
