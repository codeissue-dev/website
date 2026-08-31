import { Section, SectionSplit } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { FAQ_ENTRIES, FAQ_SECTION } from "@/content/landing";

export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-heading">
      <SectionSplit
        className="lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]"
        aside={
          <SectionHeading
            id="faq-heading"
            eyebrow={FAQ_SECTION.eyebrow}
            heading={FAQ_SECTION.heading}
            description={FAQ_SECTION.description}
          />
        }
      >
        <div className="faq-panel self-start overflow-hidden rounded-panel border border-line bg-surface/75">
          {FAQ_ENTRIES.map((entry) => (
            <details
              key={entry.question}
              className="faq-row group border-b border-line last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-sm font-semibold text-ink sm:px-6">
                {entry.question}
                <span aria-hidden="true" className="faq-icon">
                  +
                </span>
              </summary>
              <p className="max-w-3xl px-5 pb-5 text-sm leading-relaxed text-ink-muted sm:px-6">
                {entry.answer}
              </p>
            </details>
          ))}
        </div>
      </SectionSplit>
    </Section>
  );
}
