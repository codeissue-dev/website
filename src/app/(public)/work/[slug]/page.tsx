import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ButtonLink } from "@/components/ui/button";
import { loadPublishedPortfolioItem } from "@/lib/content/queries";
import { paragraphs, pluralize } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await loadPublishedPortfolioItem(slug);
  if (item === null) return { title: "Project not found" };
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: `/work/${item.slug}` },
    openGraph: {
      title: `${item.title} · codeissue`,
      description: item.summary,
      type: "article",
      url: `/work/${item.slug}`,
    },
  };
}

export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await loadPublishedPortfolioItem(slug);
  if (item === null) notFound();

  return (
    <article className="page-enter mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <Link
        href="/work"
        className="font-mono text-xs font-semibold tracking-wide text-ink-muted uppercase transition-colors hover:text-accent"
      >
        &larr; All projects
      </Link>
      <p className="section-eyebrow mt-10">Case study</p>
      <h1 className="hero-title max-w-3xl text-[clamp(2.35rem,5vw,4.5rem)]">
        {item.title}
      </h1>
      <p className="hero-copy mt-5 text-lg">{item.summary}</p>

      <dl className="mt-10 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-3">
        {item.industry ? (
          <div className="bg-surface p-4">
            <dt className="font-mono text-xs tracking-wide text-ink-subtle uppercase">
              Industry
            </dt>
            <dd className="mt-1.5 text-sm font-semibold text-ink">{item.industry}</dd>
          </div>
        ) : null}
        {item.deliveryWeeks !== null ? (
          <div className="bg-surface p-4">
            <dt className="font-mono text-xs tracking-wide text-ink-subtle uppercase">
              Delivery
            </dt>
            <dd className="mt-1.5 text-sm font-semibold text-ink">
              {item.deliveryWeeks} {pluralize(item.deliveryWeeks, "week", "weeks")}
            </dd>
          </div>
        ) : null}
        {item.techStack.length > 0 ? (
          <div className="bg-surface p-4">
            <dt className="font-mono text-xs tracking-wide text-ink-subtle uppercase">
              Stack
            </dt>
            <dd className="mt-1.5 text-sm font-semibold leading-relaxed text-ink">
              {item.techStack.join(", ")}
            </dd>
          </div>
        ) : null}
      </dl>

      <section className="mt-12 border-l-2 border-accent/45 pl-5 sm:pl-7">
        <h2 className="text-xl font-semibold tracking-tight text-ink">The problem</h2>
        <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-ink-muted">
          {paragraphs(item.problem).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="mt-12 border-l-2 border-signal/65 pl-5 sm:pl-7">
        <h2 className="text-xl font-semibold tracking-tight text-ink">What we built</h2>
        <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-ink-muted">
          {paragraphs(item.solution).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      <div className="mt-14 flex flex-wrap items-center gap-3 border-t border-line pt-8">
        <ButtonLink href="/register" size="sm">
          Start a project like this
        </ButtonLink>
        {item.projectUrl ? (
          <ButtonLink
            href={item.projectUrl}
            target="_blank"
            rel="noreferrer noopener"
            variant="secondary"
            size="sm"
          >
            Visit the project
          </ButtonLink>
        ) : null}
      </div>
    </article>
  );
}
