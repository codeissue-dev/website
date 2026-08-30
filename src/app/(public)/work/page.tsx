import type { Metadata } from "next";
import Link from "next/link";

import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { listPublishedPortfolioItems } from "@/lib/content/queries";
import { pluralize } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Completed projects",
  description:
    "Custom software projects delivered by codeissue, written up with the problem, the solution and the stack used.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const items = await listPublishedPortfolioItems(60);
  return (
    <div className="page-enter mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="max-w-3xl">
        <p className="section-eyebrow">Portfolio</p>
        <h1 className="hero-title mt-4 max-w-3xl text-[clamp(2.35rem,5vw,4.25rem)]">
          Completed projects
        </h1>
        <p className="hero-copy mt-5">
          Every entry here is a project we delivered and were given permission to
          describe. Nothing is published without the customer&rsquo;s approval.
        </p>
      </div>
      {items.length === 0 ? (
        <EmptyState
          className="mt-12 py-14"
          title="Nothing published yet"
          description="Approved write-ups appear on this page as they are published. In the meantime, describe your project and ask us about comparable work — we answer directly in the project chat."
          action={
            <ButtonLink href="/register" size="sm">
              Submit a request
            </ButtonLink>
          }
        />
      ) : (
        <ul className="stagger-grid mt-12 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id} className="bg-surface">
              <Link
                href={`/work/${item.slug}`}
                className="interactive-card group flex h-full flex-col gap-3 p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {item.industry ? (
                    <span className="font-mono text-xs tracking-wide text-accent uppercase">
                      {item.industry}
                    </span>
                  ) : null}
                  {item.deliveryWeeks !== null ? (
                    <span className="text-xs text-ink-subtle">
                      {item.deliveryWeeks}{" "}
                      {pluralize(item.deliveryWeeks, "week", "weeks")} to delivery
                    </span>
                  ) : null}
                </div>
                <h2 className="text-lg font-semibold text-ink">{item.title}</h2>
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
                <span className="mt-2 text-sm font-semibold text-ink underline decoration-accent/45 underline-offset-4 transition-colors group-hover:decoration-accent">
                  Read the write-up
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
