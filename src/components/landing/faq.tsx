import { ChevronDownIcon } from "@/components/ui/icon";
import { Section, SectionSplit } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { FAQ_ENTRIES, FAQ_SECTION } from "@/content/landing";

/** Native disclosure elements: they open without JavaScript and stay accessible. */
export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-heading">
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
