import { getTranslations } from "next-intl/server";

import { CircuitLine } from "@/components/decor/circuit-line";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

export async function Cta() {
  const t = await getTranslations("Cta");

  return (
    <Section labelledBy="cta-heading">
      <Reveal>
        <div className="cta-band">
          <p className="section-eyebrow">
            <span className="eyebrow-dot text-accent" />
            {t("eyebrow")}
          </p>
          <h2 id="cta-heading" className="section-title max-w-2xl">
            {t("title")}
          </h2>
          <p className="section-description">{t("description")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/register" size="lg">
              {t("primaryAction")}
            </ButtonLink>
            <ButtonLink href="/sign-in" variant="secondary" size="lg">
              {t("secondaryAction")}
            </ButtonLink>
          </div>
          <CircuitLine className="mt-10" />
        </div>
      </Reveal>
    </Section>
  );
}
