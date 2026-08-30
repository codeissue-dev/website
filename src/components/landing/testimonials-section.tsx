import type { PublishedTestimonial } from "@/lib/content/queries";

function Attribution({ testimonial }: { testimonial: PublishedTestimonial }) {
  const details = [testimonial.authorRole, testimonial.company].filter(
    (value): value is string => value !== null && value.length > 0,
  );

  return (
    <footer className="mt-4 text-sm">
      <p className="font-medium text-ink">{testimonial.authorName}</p>
      {details.length > 0 ? (
        <p className="text-ink-muted">{details.join(", ")}</p>
      ) : null}
    </footer>
  );
}

/**
 * Published testimonials.
 *
 * Every quote is a row an administrator entered and published; none of this text
 * lives in the source code.
 */
export function TestimonialsSection({
  testimonials,
}: {
  testimonials: PublishedTestimonial[];
}) {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="border-b border-line bg-surface-muted"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <h2
            id="testimonials-heading"
            className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            What customers say
          </h2>
          <p className="mt-3 text-ink-muted">
            Feedback is published only with the customer&rsquo;s approval, in their own
            words.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="mt-10 rounded-panel border border-dashed border-line bg-surface px-6 py-12 text-center">
            <p className="text-sm font-semibold text-ink">
              No testimonials are published yet
            </p>
            <p className="mx-auto mt-2 max-w-lg text-sm text-ink-muted">
              We would rather show an empty section than write praise on a
              customer&rsquo;s behalf. Quotes appear here as soon as they are approved.
            </p>
          </div>
        ) : (
          <ul className="mt-10 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <li key={testimonial.id} className="bg-surface p-5">
                <figure className="flex h-full flex-col">
                  {testimonial.rating !== null ? (
                    <p
                      className="font-mono text-xs text-ink-subtle"
                      aria-label={`Rated ${testimonial.rating} out of 5`}
                    >
                      {testimonial.rating}/5
                    </p>
                  ) : null}
                  <blockquote className="mt-2 flex-1 text-sm text-ink">
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
