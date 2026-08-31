import { EmptyState } from "@/components/ui/empty-state";
import { Section, SectionSplit } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TESTIMONIALS_SECTION } from "@/content/landing";
import type { PublishedTestimonial } from "@/lib/content/queries";
import { initials } from "@/lib/utils";

function Rating({ rating }: { rating: number | null }) {
  if (rating === null) return null;

  return (
    <p className="review-rating" aria-label={`Rated ${rating} out of 5`}>
      <span aria-hidden="true" className="review-rating-dots">
        {Array.from({ length: rating }, (_, index) => (
          <i key={index} />
        ))}
      </span>
      {rating} / 5
    </p>
  );
}

function Attribution({ testimonial }: { testimonial: PublishedTestimonial }) {
  const details = [testimonial.authorRole, testimonial.company].filter(
    (value): value is string => value !== null && value.length > 0,
  );

  return (
    <footer className="review-attribution">
      <span className="review-avatar" aria-hidden="true">
        {initials(testimonial.authorName)}
      </span>
      <div>
        <p>{testimonial.authorName}</p>
        {details.length > 0 ? <span>{details.join(", ")}</span> : null}
      </div>
    </footer>
  );
}

function ReviewCard({ testimonial }: { testimonial: PublishedTestimonial }) {
  return (
    <li className="review-card interactive-card">
      <figure className="flex h-full flex-col p-5 sm:p-6">
        <span aria-hidden="true" className="review-quote-mark">
          “
        </span>
        <Rating rating={testimonial.rating} />
        <blockquote className="mt-4 flex-1">
          <p>{testimonial.quote}</p>
        </blockquote>
        <Attribution testimonial={testimonial} />
      </figure>
    </li>
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
        className="lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]"
        aside={
          <>
            <SectionHeading
              id="testimonials-heading"
              eyebrow={TESTIMONIALS_SECTION.eyebrow}
              heading={TESTIMONIALS_SECTION.heading}
              description={TESTIMONIALS_SECTION.description}
            />
            <div className="review-note mt-7">
              <span className="review-note-orbit" aria-hidden="true" />
              <p>{TESTIMONIALS_SECTION.note}</p>
            </div>
          </>
        }
      >
        {testimonials.length === 0 ? (
          <EmptyState
            className="public-empty self-start py-12"
            title={TESTIMONIALS_SECTION.empty.title}
            description={TESTIMONIALS_SECTION.empty.description}
          />
        ) : (
          <ul className="review-grid stagger-grid grid gap-3 sm:grid-cols-2">
            {testimonials.map((testimonial) => (
              <ReviewCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </ul>
        )}
      </SectionSplit>
    </Section>
  );
}
