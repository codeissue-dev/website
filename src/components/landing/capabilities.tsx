import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CAPABILITIES, CAPABILITIES_SECTION } from "@/content/landing";
import { numberLabel } from "@/lib/utils";

export function Capabilities() {
  return (
    <Section id="capabilities" labelledBy="capabilities-heading">
      <SectionHeading
        id="capabilities-heading"
        eyebrow={CAPABILITIES_SECTION.eyebrow}
        heading={CAPABILITIES_SECTION.heading}
        description={CAPABILITIES_SECTION.description}
      />
      <ul className="bento-grid stagger-grid mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((capability, index) => (
          <li
            key={capability.title}
            className={`bento-card bento-card-${index + 1} interactive-card`}
          >
            <span className="feature-index">{numberLabel(index)}</span>
            <h3>{capability.title}</h3>
            <p>{capability.body}</p>
            <span aria-hidden="true" className="feature-arrow">
              ↗
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
