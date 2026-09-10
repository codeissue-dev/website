import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { Section, SectionSplit } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { numberLabel } from "@/lib/utils";

type ProcessStep = { title: string; body: string };

export async function Process() {
  const t = await getTranslations("Process");
  const steps = t.raw("steps") as ProcessStep[];

  return (
    <Section id="process" labelledBy="process-heading">
      <SectionSplit
        sticky
        aside={
          <>
            <SectionHeading
              id="process-heading"
              eyebrow={t("eyebrow")}
              eyebrowTone="violet"
              title={t("title")}
              description={t("description")}
            />
            <Reveal className="mt-7 inline-block">
              <ButtonLink href="/register" variant="secondary" size="sm">
                {t("action")}
              </ButtonLink>
            </Reveal>
          </>
        }
      >
        <Reveal>
          <ol>
            {steps.map((step, index) => (
              <li key={step.title} className="process-step">
                <span className="process-number" aria-hidden="true">
                  {numberLabel(index)}
                </span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </SectionSplit>
    </Section>
  );
}
