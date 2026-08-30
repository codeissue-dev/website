import { ButtonLink } from "@/components/ui/button";
import { ORDER_STATUS_LABELS, ORDER_STATUSES } from "@/lib/orders/status";

/**
 * Hero.
 *
 * The pipeline strip lists the real statuses from the state machine, so the
 * first thing a visitor sees is how their project will actually be tracked.
 */
export function Hero() {
  return (
    <section className="hero-shell relative overflow-hidden border-b border-line">
      <div aria-hidden="true" className="grid-backdrop absolute inset-0" />
      <div aria-hidden="true" className="hero-aurora" />
      <div aria-hidden="true" className="hero-orbit hero-orbit-one" />
      <div aria-hidden="true" className="hero-orbit hero-orbit-two" />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
        <div className="stagger-list">
          <p className="section-eyebrow">Custom software development</p>
          <h1 className="hero-title mt-4">
            Describe the software you need. Watch it get built.
          </h1>
          <p className="hero-copy mt-6">
            codeissue turns a written brief into working software. You submit the idea,
            we scope it, and every stage of the work stays visible in your account
            &mdash; with a direct line to the people writing the code.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/register" size="lg">
              Start a project
            </ButtonLink>
            <ButtonLink href="/work" variant="secondary" size="lg">
              See completed work
            </ButtonLink>
          </div>
        </div>

        <dl className="hero-proof stagger-grid mt-16 grid max-w-4xl gap-6 sm:grid-cols-3">
          <div>
            <dt className="text-sm font-semibold text-ink">One written brief</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              A structured request form that captures goals, features and constraints
              instead of a vague enquiry.
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-ink">Tracked delivery</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              Every status change is recorded with who changed it, when, and why.
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-ink">Direct conversation</dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-ink-muted">
              A live chat attached to your project, kept as a permanent record.
            </dd>
          </div>
        </dl>

        <div className="hero-pipeline mt-16 max-w-5xl px-4 py-4 sm:px-5">
          <p className="section-eyebrow mb-3">Project pipeline</p>
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
            {ORDER_STATUSES.map((status, index) => (
              <li key={status} className="flex items-center gap-2">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-accent/65">
                    /
                  </span>
                ) : null}
                <span className="font-mono text-xs text-ink-muted">
                  {ORDER_STATUS_LABELS[status]}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
