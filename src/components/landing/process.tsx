import { ButtonLink } from "@/components/ui/button";
import { Section, SectionSplit } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { PROCESS_SECTION, PROCESS_STEPS } from "@/content/landing";
import { numberLabel } from "@/lib/utils";

export function Process() {
  return (
    <Section id="process" labelledBy="process-heading">
      <SectionSplit
        sticky
        aside={
          <>
            <SectionHeading
              id="process-heading"
              eyebrow={PROCESS_SECTION.eyebrow}
              heading={PROCESS_SECTION.heading}
              description={PROCESS_SECTION.description}
            />
            <ButtonLink
              href={PROCESS_SECTION.action.href}
              variant="secondary"
              size="sm"
              className="mt-7"
            >
              {PROCESS_SECTION.action.label}
            </ButtonLink>
          </>
        }
      >
        <ol className="process-list stagger-list">
          {PROCESS_STEPS.map((step, index) => (
            <li key={step.title} className="process-step">
              <span className="process-number">{numberLabel(index)}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </SectionSplit>
    </Section>
  );
}
