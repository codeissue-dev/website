import Link from "next/link";

import { buttonClass } from "@/components/ui/button";
import type { PublishedPortfolioItem } from "@/lib/content/queries";
import { pluralize } from "@/lib/utils";

export function PortfolioCard({ item }: { item: PublishedPortfolioItem }) {
  return (
    <article className="flex flex-col gap-3 bg-surface p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {item.industry ? (
          <span className="font-mono text-xs tracking-wide text-ink-subtle uppercase">
            {item.industry}
          </span>
        ) : null}
        {item.deliveryWeeks !== null ? (
          <span className="text-xs text-ink-subtle">
            {item.deliveryWeeks} {pluralize(item.deliveryWeeks, "week", "weeks")} to
            delivery
          </span>
        ) : null}
      </div>

      <h3 className="text-base font-semibold text-ink">{item.title}</h3>
      <p className="text-sm text-ink-muted">{item.summary}</p>

      {item.techStack.length > 0 ? (
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {item.techStack.map((tech) => (
            <li
              key={tech}
              className="rounded-md border border-line px-2 py-0.5 font-mono text-xs text-ink-muted"
            >
              {tech}
            </li>
          ))}
        </ul>
      ) : null}

      {item.projectUrl ? (
        <a
          href={item.projectUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
        >
          Visit the project
        </a>
      ) : null}
    </article>
  );
}

/**
 * Published work.
 *
 * Rows come from `portfolio_items` where `published` is true. When nothing is
 * published the section says so rather than inventing a client list.
 */
export function PortfolioSection({ items }: { items: PublishedPortfolioItem[] }) {
  return (
    <section id="work" aria-labelledby="work-heading" className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2
              id="work-heading"
              className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
            >
              Completed projects
            </h2>
            <p className="mt-3 text-ink-muted">
              Work we are allowed to talk about, written up by the people who built it.
            </p>
          </div>
          {items.length > 0 ? (
            <Link
              href="/work"
              className={buttonClass({ variant: "secondary", size: "sm" })}
            >
              All projects
            </Link>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-panel border border-dashed border-line px-6 py-12 text-center">
            <p className="text-sm font-semibold text-ink">
              No case studies are published yet
            </p>
            <p className="mx-auto mt-2 max-w-lg text-sm text-ink-muted">
              Client work is only published here once the customer has approved the
              write-up, so this section stays empty until then. Ask us directly about
              relevant experience when you submit a request.
            </p>
            <Link
              href="/register"
              className={buttonClass({ size: "sm", className: "mt-6" })}
            >
              Submit a request
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
