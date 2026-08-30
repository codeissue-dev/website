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
    <article className="case-study page-enter mx-auto w-full max-w-4xl px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-32">
      <Link href="/work" className="case-back">
        <span aria-hidden="true">←</span> All public projects
      </Link>
      <div className="mt-10 max-w-3xl">
        <p className="section-eyebrow">Case study</p>
        <h1 className="hero-title mt-4 max-w-3xl text-[clamp(2.5rem,5.3vw,4.7rem)]">
          {item.title}
        </h1>
        <p className="hero-copy mt-5 text-lg">{item.summary}</p>
      </div>

      <dl className="case-meta mt-10 grid gap-3 sm:grid-cols-3">
        {item.industry ? (
          <div>
            <dt>Industry</dt>
            <dd>{item.industry}</dd>
          </div>
        ) : null}
        {item.deliveryWeeks !== null ? (
          <div>
            <dt>Delivery</dt>
            <dd>
              {item.deliveryWeeks} {pluralize(item.deliveryWeeks, "week", "weeks")}
            </dd>
          </div>
        ) : null}
        {item.techStack.length > 0 ? (
          <div>
            <dt>Stack</dt>
            <dd>{item.techStack.join(", ")}</dd>
          </div>
        ) : null}
      </dl>

      <section className="case-section case-section-accent mt-12">
        <h2>The problem</h2>
        <div className="mt-4 flex flex-col gap-3">
          {paragraphs(item.problem).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="case-section case-section-signal mt-12">
        <h2>What we built</h2>
        <div className="mt-4 flex flex-col gap-3">
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
            View live project
          </ButtonLink>
        ) : null}
      </div>
    </article>
  );
}
