import Link from "next/link";

import { buttonClass } from "@/components/ui/button";
import { ORDER_STATUS_LABELS, ORDER_STATUSES } from "@/lib/orders/status";

/**
 * Hero.
 *
 * The pipeline strip lists the real statuses from the state machine, so the
 * first thing a visitor sees is how their project will actually be tracked.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden="true" className="grid-backdrop absolute inset-0" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="font-mono text-xs tracking-wide text-ink-muted uppercase">
          Custom software development
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance text-ink sm:text-5xl">
          Describe the software you need. Watch it get built.
        </h1>
        <p className="mt-5 max-w-2xl text-base text-ink-muted sm:text-lg">
          codeissue turns a written brief into working software. You submit the idea, we
          scope it, and every stage of the work stays visible in your account &mdash;
          with a direct line to the people writing the code.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/register" className={buttonClass({ size: "lg" })}>
            Start a project
          </Link>
          <Link
            href="/work"
            className={buttonClass({ variant: "secondary", size: "lg" })}
          >
            See completed work
          </Link>
        </div>

        <dl className="mt-14 grid max-w-3xl gap-6 sm:grid-cols-3">
          <div>
            <dt className="text-sm font-medium text-ink">One written brief</dt>
            <dd className="mt-1 text-sm text-ink-muted">
              A structured request form that captures goals, features and constraints
              instead of a vague enquiry.
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-ink">Tracked delivery</dt>
            <dd className="mt-1 text-sm text-ink-muted">
              Every status change is recorded with who changed it, when, and why.
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-ink">Direct conversation</dt>
            <dd className="mt-1 text-sm text-ink-muted">
              A live chat attached to your project, kept as a permanent record.
            </dd>
          </div>
        </dl>

        <div className="mt-14">
          <p className="font-mono text-xs tracking-wide text-ink-subtle uppercase">
            Project pipeline
          </p>
          <ol className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
            {ORDER_STATUSES.map((status, index) => (
              <li key={status} className="flex items-center gap-2">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-ink-subtle">
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
