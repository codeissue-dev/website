import { Panel } from "@/components/ui/panel";
import { Section, SectionSplit } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { WORKFLOW_SECTION } from "@/content/landing";
import { ORDER_STATUS_DESCRIPTIONS, ORDER_STATUSES } from "@/lib/orders/status";

/**
 * The delivery stages, rendered with the same badge the workspace uses.
 *
 * The list is generated from the status module, so the public page cannot
 * describe a stage the platform does not have.
 */
export function Workflow() {
  return (
    <Section id="workflow" labelledBy="workflow-heading">
      <SectionSplit
        sticky
        aside={
          <SectionHeading
            id="workflow-heading"
            eyebrow={WORKFLOW_SECTION.eyebrow}
            title={WORKFLOW_SECTION.title}
            description={WORKFLOW_SECTION.description}
          />
        }
      >
        <Panel>
          <dl>
            {ORDER_STATUSES.map((status) => (
              <div key={status} className="workflow-row">
                <dt>
                  <StatusBadge status={status} />
                </dt>
                <dd>{ORDER_STATUS_DESCRIPTIONS[status]}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </SectionSplit>
    </Section>
  );
}
