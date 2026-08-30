import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PublishedPortfolioItem } from "@/lib/content/queries";
import { pluralize } from "@/lib/utils";

export function PortfolioCard({
  item,
  index = 0,
}: {
  item: PublishedPortfolioItem;
  index?: number;
}) {
  const artVariant = (index % 3) + 1;

  return (
    <article className="project-card interactive-card flex h-full flex-col">
      <div aria-hidden="true" className={`project-art project-art-${artVariant}`}>
        <span className="project-art-count">{String(index + 1).padStart(2, "0")}</span>
        <div className="project-art-window">
          <span />
          <span />
          <span />
          <i />
          <i />
          <i />
        </div>
        <span className="project-art-spark project-art-spark-one" />
        <span className="project-art-spark project-art-spark-two" />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {item.industry ? <span className="project-meta">{item.industry}</span> : null}
          {item.deliveryWeeks !== null ? (
            <span className="project-duration">
              {item.deliveryWeeks} {pluralize(item.deliveryWeeks, "week", "weeks")} to
              delivery
            </span>
          ) : null}
        </div>
        <h3 className="mt-4">{item.title}</h3>
        <p className="mt-2">{item.summary}</p>
        {item.techStack.length > 0 ? (
          <ul className="project-stack mt-5 flex flex-wrap gap-1.5">
            {item.techStack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        ) : null}
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-6">
          <Link href={`/work/${item.slug}`} className="project-link">
            Read the case <span aria-hidden="true">↗</span>
          </Link>
          {item.projectUrl ? (
            <Link
              href={item.projectUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="project-link project-link-muted"
            >
              View live project
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/** Published work comes only from rows explicitly published by an administrator. */
export function PortfolioSection({ items }: { items: PublishedPortfolioItem[] }) {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="public-section border-b border-line"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="work-heading"
            eyebrow="Public projects"
            title={
              <>
                Finished work,{" "}
                <span className="heading-accent">shared with permission.</span>
              </>
            }
            description="Every project here has an approved public write-up. The work stays private unless the client chooses otherwise."
          />
          {items.length > 0 ? (
            <ButtonLink href="/work" variant="secondary" size="sm">
              View all projects
            </ButtonLink>
          ) : null}
        </div>
        {items.length === 0 ? (
          <EmptyState
            className="public-empty mt-10 py-12"
            title="Public case studies are on their way"
            description="We only show a finished project after the client approves it for publication."
            action={
              <ButtonLink href="/register" size="sm">
                Start a project
              </ButtonLink>
            }
          />
        ) : (
          <ul className="project-grid stagger-grid mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <li key={item.id}>
                <PortfolioCard item={item} index={index} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
