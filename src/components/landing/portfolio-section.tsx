import { getTranslations } from "next-intl/server";

import { PortfolioCard } from "@/components/landing/portfolio-card";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PublishedPortfolioItem } from "@/lib/content/queries";

/** Published work comes only from rows explicitly published by an administrator. */
export async function PortfolioSection({ items }: { items: PublishedPortfolioItem[] }) {
  const t = await getTranslations("Portfolio");

  return (
    <Section id="work" labelledBy="work-heading">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          id="work-heading"
          title={t("title")}
          description={t("description")}
        />
        {items.length > 0 ? (
          <Reveal>
            <ButtonLink href="/work" variant="secondary" size="sm">
              {t("action")}
            </ButtonLink>
          </Reveal>
        ) : null}
      </div>
      {items.length === 0 ? (
        <EmptyState
          className="mt-10"
          title={t("empty.title")}
          description={t("empty.description")}
          action={
            <ButtonLink href="/register" size="sm">
              {t("empty.action")}
            </ButtonLink>
          }
        />
      ) : (
        <Reveal className="mt-10">
          <ul className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <li key={item.id}>
                <PortfolioCard item={item} />
              </li>
            ))}
          </ul>
        </Reveal>
      )}
    </Section>
  );
}
