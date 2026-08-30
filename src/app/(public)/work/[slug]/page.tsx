import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonClass } from "@/components/ui/button";
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
    <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <Link
        href="/work"
        className="font-mono text-xs text-ink-muted transition-colors hover:text-ink"
      >
        &larr; All projects
      </Link>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {item.title}
      </h1>
      <p className="mt-4 text-lg text-ink-muted">{item.summary}</p>

      <dl className="mt-8 grid gap-4 border-y border-line py-5 sm:grid-cols-3">
        {item.industry ? (
          <div>
            <dt className="text-xs tracking-wide text-ink-subtle uppercase">
              Industry
            </dt>
            <dd className="mt-1 text-sm text-ink">{item.industry}</dd>
          </div>
        ) : null}
        {item.deliveryWeeks !== null ? (
          <div>
            <dt className="text-xs tracking-wide text-ink-subtle uppercase">
              Delivery
            </dt>
            <dd className="mt-1 text-sm text-ink">
              {item.deliveryWeeks} {pluralize(item.deliveryWeeks, "week", "weeks")}
            </dd>
          </div>
        ) : null}
        {item.techStack.length > 0 ? (
          <div>
            <dt className="text-xs tracking-wide text-ink-subtle uppercase">Stack</dt>
            <dd className="mt-1 text-sm text-ink">{item.techStack.join(", ")}</dd>
          </div>
        ) : null}
      </dl>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight text-ink">The problem</h2>
        <div className="mt-3 flex flex-col gap-3 text-sm text-ink-muted">
          {paragraphs(item.problem).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight text-ink">What we built</h2>
        <div className="mt-3 flex flex-col gap-3 text-sm text-ink-muted">
          {paragraphs(item.solution).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-line pt-8">
        <Link href="/register" className={buttonClass({ size: "sm" })}>
          Start a project like this
        </Link>
        {item.projectUrl ? (
          <a
            href={item.projectUrl}
            target="_blank"
            rel="noreferrer noopener"
            className={buttonClass({ variant: "secondary", size: "sm" })}
          >
            Visit the project
          </a>
        ) : null}
      </div>
    </article>
  );
}
