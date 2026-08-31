import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ButtonLink } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icon";
import { Container } from "@/components/ui/section";
import { SITE } from "@/content/site";
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
      title: `${item.title} - ${SITE.name}`,
      description: item.summary,
      type: "article",
      url: `/work/${item.slug}`,
    },
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

  return (
    <Container width="narrow" className="py-16 sm:py-20">
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
