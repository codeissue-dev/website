import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ExternalLinkIcon } from "@/components/ui/icon";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { PORTFOLIO_SECTION } from "@/content/landing";
import type { PublishedPortfolioItem } from "@/lib/content/queries";
import { pluralize } from "@/lib/utils";

/** One published project. Every value shown here comes from the CMS row. */
export function PortfolioCard({ item }: { item: PublishedPortfolioItem }) {
  const meta = [
    item.industry,
    item.deliveryWeeks === null
      ? null
      : `${item.deliveryWeeks} ${pluralize(item.deliveryWeeks, "week", "weeks")} to delivery`,
  ].filter((value): value is string => value !== null && value.length > 0);

  return (
    <article className="project-card">
      {meta.length > 0 ? <p className="project-meta">{meta.join(", ")}</p> : null}
      <h3 className="mt-3">{item.title}</h3>
      <p className="mt-2">{item.summary}</p>
      {item.techStack.length > 0 ? (
        <ul className="project-stack mt-5 flex flex-wrap gap-1.5">
          {item.techStack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      ) : null}
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
        <Link href={`/work/${item.slug}`} className="project-link">
          Read the case study
        </Link>
        {item.projectUrl ? (
          <Link
            href={item.projectUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="project-link"
          >
            Open live project
            <ExternalLinkIcon />
          </Link>
        ) : null}
      </div>
    </article>
  );
}

/** Published work comes only from rows explicitly published by an administrator. */
export function PortfolioSection({ items }: { items: PublishedPortfolioItem[] }) {
  return (
    <Section id="work" labelledBy="work-heading">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          id="work-heading"
          eyebrow={PORTFOLIO_SECTION.eyebrow}
          title={PORTFOLIO_SECTION.title}
          description={PORTFOLIO_SECTION.description}
        />
        {items.length > 0 ? (
          <ButtonLink
            href={PORTFOLIO_SECTION.action.href}
            variant="secondary"
            size="sm"
          >
            {PORTFOLIO_SECTION.action.label}
          </ButtonLink>
        ) : null}
      </div>
      {items.length === 0 ? (
        <EmptyState
          className="mt-10"
          title={PORTFOLIO_SECTION.empty.title}
          description={PORTFOLIO_SECTION.empty.description}
          action={
            <ButtonLink href="/register" size="sm">
              Start a project
            </ButtonLink>
          }
        />
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <PortfolioCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
