import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PublishedPortfolioItem } from "@/lib/content/queries";
import { pluralize } from "@/lib/utils";

export function PortfolioCard({ item }: { item: PublishedPortfolioItem }) {
  return (
    <article className="interactive-card flex flex-col gap-3 bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {item.industry ? (
          <span className="font-mono text-xs tracking-wide text-accent uppercase">
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
      <p className="text-sm leading-relaxed text-ink-muted">{item.summary}</p>
      {item.techStack.length > 0 ? (
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {item.techStack.map((tech) => (
            <li
              key={tech}
              className="rounded-md border border-line bg-surface-muted/60 px-2 py-0.5 font-mono text-xs text-ink-muted"
            >
              {tech}
            </li>
          ))}
        </ul>
      ) : null}
      {item.projectUrl ? (
        <Link
          href={item.projectUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-1 text-sm font-semibold text-ink underline decoration-accent/45 underline-offset-4 transition-colors hover:decoration-accent"
        >
          Visit the project
        </Link>
      ) : null}
    </article>
  );
}

/** Published work comes only from rows explicitly published by an administrator. */
export function PortfolioSection({ items }: { items: PublishedPortfolioItem[] }) {
  return (
    <section id="work" aria-labelledby="work-heading" className="border-b border-line">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <SectionHeading
            id="work-heading"
            eyebrow="Selected work"
            title="Completed projects"
            description="Work we are allowed to talk about, written up by the people who built it."
          />
          {items.length > 0 ? (
            <ButtonLink href="/work" variant="secondary" size="sm">
              All projects
            </ButtonLink>
          ) : null}
        </div>
        {items.length === 0 ? (
          <EmptyState
            className="mt-10 py-12"
            title="No case studies are published yet"
            description="Client work is only published here once the customer has approved the write-up, so this section stays empty until then. Ask us directly about relevant experience when you submit a request."
            action={
              <ButtonLink href="/register" size="sm">
                Submit a request
              </ButtonLink>
            }
          />
        ) : (
          <div className="stagger-grid mt-10 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
