import { Section, SectionSplit } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { WORKFLOW_SECTION } from "@/content/landing";
import {
  ORDER_STATUS_DESCRIPTIONS,
  ORDER_STATUS_LABELS,
  ORDER_STATUSES,
} from "@/lib/orders/status";
import { numberLabel } from "@/lib/utils";

/** Delivery workflow generated from the same state machine as the platform. */
export function Workflow() {
  return (
    <Section id="workflow" labelledBy="workflow-heading">
      <SectionSplit
        aside={
          <SectionHeading
            id="workflow-heading"
            eyebrow={WORKFLOW_SECTION.eyebrow}
            heading={WORKFLOW_SECTION.heading}
            description={WORKFLOW_SECTION.description}
          />
        }
      >
        <dl className="workflow-grid stagger-grid grid gap-3 sm:grid-cols-2">
          {ORDER_STATUSES.map((status, index) => (
            <div key={status} className="workflow-card interactive-card">
              <span className="workflow-number">{numberLabel(index)}</span>
              <div>
                <dt>{ORDER_STATUS_LABELS[status]}</dt>
                <dd>{ORDER_STATUS_DESCRIPTIONS[status]}</dd>
              </div>
              <span aria-hidden="true" className="workflow-beacon" />
            </div>
          ))}
        </dl>
      </SectionSplit>
    </Section>
  );
}
