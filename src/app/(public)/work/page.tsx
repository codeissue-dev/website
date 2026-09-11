import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PortfolioCard } from "@/components/landing/portfolio-card";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Container } from "@/components/ui/section";
import { listPublishedPortfolioItems } from "@/lib/content/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  return {
    title: t("workTitle"),
    description: t("workDescription"),
    alternates: { canonical: "/work" },
  };
}

export default async function WorkPage() {
  const [items, t] = await Promise.all([
    listPublishedPortfolioItems(60),
    getTranslations("Work"),
  ]);

  return (
    <Container className="py-16 sm:py-20">
      <Reveal className="max-w-3xl">
        <h1 className="title-hero">{t("title")}</h1>
        <p className="lede mt-5">{t("description")}</p>
      </Reveal>
      {items.length === 0 ? (
        <EmptyState
          className="mt-12"
          title={t("empty.title")}
          description={t("empty.description")}
          action={
            <ButtonLink href="/register" size="sm">
              {t("empty.action")}
            </ButtonLink>
          }
        />
      ) : (
        <Reveal className="mt-12">
          <ul className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <li key={item.id}>
                <PortfolioCard item={item} />
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </Container>
  );
}
