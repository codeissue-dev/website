import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PublishedTestimonial } from "@/lib/content/queries";

function Attribution({ testimonial }: { testimonial: PublishedTestimonial }) {
  const details = [testimonial.authorRole, testimonial.company].filter(
    (value): value is string => value !== null && value.length > 0,
  );

  return (
    <footer className="mt-5 border-t border-line/70 pt-4 text-sm">
      <p className="font-semibold text-ink">{testimonial.authorName}</p>
      {details.length > 0 ? (
        <p className="mt-0.5 text-ink-muted">{details.join(", ")}</p>
      ) : null}
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
      className="border-b border-line bg-surface-muted/55"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          id="testimonials-heading"
          eyebrow="Proof"
          title="What customers say"
          description="Feedback is published only with the customer&rsquo;s approval, in their own words."
        />
        {testimonials.length === 0 ? (
          <EmptyState
            className="mt-10 bg-surface py-12"
            title="No testimonials are published yet"
            description="We would rather show an empty section than write praise on a customer&rsquo;s behalf. Quotes appear here as soon as they are approved."
          />
        ) : (
          <ul className="stagger-grid mt-10 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <li
                key={testimonial.id}
                className="interactive-card bg-surface p-5 sm:p-6"
              >
                <figure className="flex h-full flex-col">
                  {testimonial.rating !== null ? (
                    <p
                      className="font-mono text-xs font-semibold tracking-wide text-accent"
                      aria-label={`Rated ${testimonial.rating} out of 5`}
                    >
                      {testimonial.rating}/5
                    </p>
                  ) : null}
                  <blockquote className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink">
                    <p>&ldquo;{testimonial.quote}&rdquo;</p>
                  </blockquote>
                  <Attribution testimonial={testimonial} />
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
