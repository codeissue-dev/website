import { EmptyState } from "@/components/ui/empty-state";
import { Section, SectionSplit } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TESTIMONIALS_SECTION } from "@/content/landing";
import type { PublishedTestimonial } from "@/lib/content/queries";
import { initials } from "@/lib/utils";

function Review({ testimonial }: { testimonial: PublishedTestimonial }) {
  const details = [testimonial.authorRole, testimonial.company].filter(
    (value): value is string => value !== null && value.length > 0,
  );

  return (
    <figure className="review">
      {testimonial.rating === null ? null : (
        <p className="review-rating">{testimonial.rating} out of 5</p>
      )}
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
export function TestimonialsSection({
  testimonials,
}: {
  testimonials: PublishedTestimonial[];
}) {
  return (
    <Section id="testimonials" labelledBy="testimonials-heading">
      <SectionSplit
        sticky
        aside={
          <>
            <SectionHeading
              id="testimonials-heading"
              eyebrow={TESTIMONIALS_SECTION.eyebrow}
              title={TESTIMONIALS_SECTION.title}
              description={TESTIMONIALS_SECTION.description}
            />
            <p className="note mt-7">{TESTIMONIALS_SECTION.note}</p>
          </>
        }
      >
        {testimonials.length === 0 ? (
          <EmptyState
            className="self-start"
            title={TESTIMONIALS_SECTION.empty.title}
            description={TESTIMONIALS_SECTION.empty.description}
          />
        ) : (
          <ul className="grid gap-8 sm:grid-cols-2">
            {testimonials.map((testimonial) => (
              <li key={testimonial.id}>
                <Review testimonial={testimonial} />
              </li>
            ))}
          </ul>
        )}
      </SectionSplit>
    </Section>
  );
}
