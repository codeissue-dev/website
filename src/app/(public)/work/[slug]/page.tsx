import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ButtonLink } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icon";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/section";
import {
  loadPublishedPortfolioItem,
  type PublishedPortfolioItem,
} from "@/lib/content/queries";
import { getSiteUrl } from "@/lib/env";
import { paragraphs, pluralize } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await loadPublishedPortfolioItem(slug);
  if (item === null) return { title: "Project not found", robots: { index: false } };
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: `/work/${item.slug}` },
    openGraph: {
      type: "article",
      title: item.title,
      description: item.summary,
      url: `/work/${item.slug}`,
      ...(item.publishedAt ? { publishedTime: item.publishedAt.toISOString() } : {}),
      ...(item.updatedAt ? { modifiedTime: item.updatedAt.toISOString() } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.summary,
    },
  };
}

/** Article and breadcrumb structured data, scoped to what the row actually says. */
function caseJsonLd(url: string, item: PublishedPortfolioItem) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: item.title,
        description: item.summary,
        url,
        mainEntityOfPage: url,
        ...(item.publishedAt ? { datePublished: item.publishedAt.toISOString() } : {}),
        ...(item.updatedAt ? { dateModified: item.updatedAt.toISOString() } : {}),
        author: { "@id": `${getSiteUrl()}/#organization` },
        publisher: { "@id": `${getSiteUrl()}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Public projects",
            item: `${getSiteUrl()}/work`,
          },
          { "@type": "ListItem", position: 2, name: item.title, item: url },
        ],
      },
    ],
  };
}

/** One part of the write-up. Bodies are stored as text and split into paragraphs. */
function CaseSection({ title, body }: { title: string; body: string }) {
  return (
    <section className="case-section mt-12">
      <h2>{title}</h2>
      <div className="prose-block mt-4 flex flex-col gap-4">
        {paragraphs(body).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

/** A published case study: only rows an administrator marked public reach here. */
export default async function WorkDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await loadPublishedPortfolioItem(slug);
  if (item === null) notFound();

  const canonical = `/work/${item.slug}`;

  return (
    <Container width="narrow" className="py-16 sm:py-20">
      <JsonLd data={caseJsonLd(`${getSiteUrl()}${canonical}`, item)} />
      <article>
        <Link href="/work" className="case-back">
          <ArrowLeftIcon />
          All public projects
        </Link>
        <div className="mt-8">
          <p className="section-eyebrow">Case study</p>
          <h1 className="title-hero mt-4">{item.title}</h1>
          <p className="lede mt-5">{item.summary}</p>
        </div>

        <dl className="case-meta mt-10 grid gap-4 sm:grid-cols-3">
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

        <CaseSection title="The problem" body={item.problem} />
        <CaseSection title="What we built" body={item.solution} />

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
              Open live project
            </ButtonLink>
          ) : null}
        </div>
      </article>
    </Container>
  );
}
