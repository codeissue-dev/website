import type { Metadata } from "next";

import { PortfolioCard } from "@/components/landing/portfolio-section";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
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
    <div className="public-page page-enter mx-auto w-full max-w-6xl px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-32">
      <div className="public-page-orbit" aria-hidden="true" />
      <div className="public-page-hero relative max-w-3xl">
        <p className="section-eyebrow">Public projects</p>
        <h1 className="hero-title mt-4 max-w-4xl text-[clamp(2.5rem,5.3vw,4.7rem)]">
          Things we finished and <span className="hero-gradient">can show.</span>
        </h1>
        <p className="hero-copy mt-5">
          Every write-up below has been approved by the client. We do not turn private
          work into portfolio material without permission.
        </p>
      </div>
      {items.length === 0 ? (
        <EmptyState
          className="public-empty mt-12 py-14"
          title="There are no public cases yet"
          description="Finished projects appear here after the client approves a public write-up."
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
    </div>
  );
}
