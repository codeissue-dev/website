import type { Metadata } from "next";

import { PortfolioCard } from "@/components/landing/portfolio-section";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Container } from "@/components/ui/section";
import { SplitTitle } from "@/components/ui/section-heading";
import { WORK_INDEX } from "@/content/landing";
import { listPublishedPortfolioItems } from "@/lib/content/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Public projects",
  description:
    "Custom software projects delivered by codeissue and shared with the client's permission.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const items = await listPublishedPortfolioItems(60);

  return (
    <Container className="public-page page-enter pb-20 pt-24 sm:pb-28 sm:pt-32">
      <div className="public-page-orbit" aria-hidden="true" />
      <div className="public-page-hero relative max-w-3xl">
        <p className="section-eyebrow">{WORK_INDEX.eyebrow}</p>
        <h1 className="hero-title mt-4 max-w-4xl text-[clamp(2.5rem,5.3vw,4.7rem)]">
          <SplitTitle heading={WORK_INDEX.heading} accentClassName="hero-gradient" />
        </h1>
        <p className="hero-copy mt-5">{WORK_INDEX.description}</p>
      </div>
      {items.length === 0 ? (
        <EmptyState
          className="public-empty mt-12 py-14"
          title={WORK_INDEX.empty.title}
          description={WORK_INDEX.empty.description}
          action={
            <ButtonLink href="/register" size="sm">
              Start a project
            </ButtonLink>
          }
        />
      ) : (
        <ul className="project-grid stagger-grid mt-12 grid gap-3 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <li key={item.id}>
              <PortfolioCard item={item} index={index} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
