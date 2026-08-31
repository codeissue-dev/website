import type { Metadata } from "next";

import { PortfolioCard } from "@/components/landing/portfolio-section";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Container } from "@/components/ui/section";
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
    <Container className="py-16 sm:py-20">
      <div className="max-w-3xl">
        <p className="section-eyebrow">{WORK_INDEX.eyebrow}</p>
        <h1 className="title-hero mt-4">{WORK_INDEX.title}</h1>
        <p className="lede mt-5">{WORK_INDEX.description}</p>
      </div>
      {items.length === 0 ? (
        <EmptyState
          className="mt-12"
          title={WORK_INDEX.empty.title}
          description={WORK_INDEX.empty.description}
          action={
            <ButtonLink href="/register" size="sm">
              Start a project
            </ButtonLink>
          }
        />
      ) : (
        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <PortfolioCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
