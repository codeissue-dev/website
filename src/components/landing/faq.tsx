import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/reveal";
import { ChevronDownIcon } from "@/components/ui/icon";
import { JsonLd } from "@/components/seo/json-ld";
import { Section, SectionSplit } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSiteUrl } from "@/lib/env";

type FaqEntry = { question: string; answer: string };

/** The same entries as structured data, localized with the page. */
function faqJsonLd(entries: FaqEntry[]) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${siteUrl}/#faq`,
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

/** Native disclosure elements: they open without JavaScript and stay accessible. */
export async function Faq() {
  const t = await getTranslations("Faq");
  const entries = t.raw("entries") as FaqEntry[];

  return (
    <Section id="faq" labelledBy="faq-heading">
      <JsonLd data={faqJsonLd(entries)} />
      <SectionSplit
        sticky
        aside={
          <SectionHeading
            id="faq-heading"
            title={t("title")}
            description={t("description")}
          />
        }
      >
        <Reveal>
          <div className="faq-panel">
            {entries.map((entry) => (
              <details key={entry.question} className="faq-row">
                <summary className="faq-question">
                  {entry.question}
                  <ChevronDownIcon className="faq-icon" />
                </summary>
                <p className="faq-answer">{entry.answer}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </SectionSplit>
    </Section>
  );
}
