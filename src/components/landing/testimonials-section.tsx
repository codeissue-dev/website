import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PublishedTestimonial } from "@/lib/content/queries";

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
        {testimonial.authorName.slice(0, 1)}
      </span>
      <div>
        <p>{testimonial.authorName}</p>
        {details.length > 0 ? <span>{details.join(", ")}</span> : null}
      </div>
    </footer>
  );
}

/** Every quote is stored in the CMS and published with the customer's approval. */
export function TestimonialsSection({
  testimonials,
}: {
  testimonials: PublishedTestimonial[];
}) {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="public-section border-b border-line"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)] lg:gap-16">
          <div>
            <SectionHeading
              id="testimonials-heading"
              eyebrow="Client reviews"
              title={
                <>
                  Words from people who{" "}
                  <span className="heading-accent">shipped with us.</span>
                </>
              }
              description="Quotes are published in the client&rsquo;s own words and only after they approve sharing them."
            />
            <div className="review-note mt-7">
              <span className="review-note-orbit" aria-hidden="true" />
              <p>
                Feedback belongs next to the finished work, not in a made-up carousel.
              </p>
            </div>
          </div>
          {testimonials.length === 0 ? (
            <EmptyState
              className="public-empty self-start py-12"
              title="Reviews will appear here"
              description="We publish client feedback only when it is approved for the public site."
            />
          ) : (
            <ul className="review-grid stagger-grid grid gap-3 sm:grid-cols-2">
              {testimonials.map((testimonial) => (
                <li key={testimonial.id} className="review-card interactive-card">
                  <figure className="flex h-full flex-col p-5 sm:p-6">
                    <span aria-hidden="true" className="review-quote-mark">
                      &ldquo;
                    </span>
                    <Rating rating={testimonial.rating} />
                    <blockquote className="mt-4 flex-1">
                      <p>{testimonial.quote}</p>
                    </blockquote>
                    <Attribution testimonial={testimonial} />
                  </figure>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
