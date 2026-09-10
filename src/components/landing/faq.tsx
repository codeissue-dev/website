import { ChevronDownIcon } from "@/components/ui/icon";
import { JsonLd } from "@/components/seo/json-ld";
import { Section, SectionSplit } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { FAQ_ENTRIES, FAQ_SECTION } from "@/content/landing";
import { getSiteUrl } from "@/lib/env";

/** The same entries as structured data, so search engines can index the answers. */
function faqJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${siteUrl}/#faq`,
    mainEntity: FAQ_ENTRIES.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

/** Native disclosure elements: they open without JavaScript and stay accessible. */
export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-heading">
      <JsonLd data={faqJsonLd()} />
      <SectionSplit
        sticky
        aside={
          <SectionHeading
            id="faq-heading"
            eyebrow={FAQ_SECTION.eyebrow}
            title={FAQ_SECTION.title}
            description={FAQ_SECTION.description}
          />
        }
      >
        <div className="faq-panel">
          {FAQ_ENTRIES.map((entry) => (
            <details key={entry.question} className="faq-row">
              <summary className="faq-question">
                {entry.question}
                <ChevronDownIcon className="faq-icon" />
              </summary>
              <p className="faq-answer">{entry.answer}</p>
            </details>
          ))}
        </div>
      </SectionSplit>
    </Section>
  );
}
