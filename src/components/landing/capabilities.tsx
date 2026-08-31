import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { CAPABILITIES, CAPABILITIES_SECTION } from "@/content/landing";

/** A definition list, so the six kinds of work read as a list rather than six boxes. */
export function Capabilities() {
  return (
    <Section id="capabilities" labelledBy="capabilities-heading">
      <SectionHeading
        id="capabilities-heading"
        eyebrow={CAPABILITIES_SECTION.eyebrow}
        title={CAPABILITIES_SECTION.title}
        description={CAPABILITIES_SECTION.description}
      />
      <dl className="mt-10">
        {CAPABILITIES.map((item) => (
          <div key={item.title} className="capability-row">
            <dt>{item.title}</dt>
            <dd>{item.body}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
