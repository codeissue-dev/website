import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/reveal";
import { Panel } from "@/components/ui/panel";
import { Section, SectionSplit } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/orders/status";

/*
 * Node colouring mirrors the badge tones: the schematic and the badge of a row
 * always agree about the state they describe.
 */
const NODE_TONES: Record<OrderStatus, string> = {
  SUBMITTED: "",
  REVIEWING: "workflow-node-caution",
  ACCEPTED: "workflow-node-accent",
  IN_PROGRESS: "workflow-node-accent",
  WAITING_FOR_CUSTOMER: "workflow-node-caution",
  QUALITY_ASSURANCE: "workflow-node-accent",
  COMPLETED: "workflow-node-positive",
  CANCELED: "workflow-node-critical",
};

/**
 * The delivery stages as a schematic: a rail with a node per state, rendered
 * with the same badge the workspace uses. The list is generated from the
 * status module, so the public page cannot describe a stage the platform does
 * not have.
 */
export async function Workflow() {
  const t = await getTranslations("Workflow");

  return (
    <Section id="workflow" labelledBy="workflow-heading">
      <SectionSplit
        sticky
        aside={
          <SectionHeading
            id="workflow-heading"
            eyebrow={t("eyebrow")}
            eyebrowTone="amber"
            title={t("title")}
            description={t("description")}
          />
        }
      >
        <Reveal>
          <Panel>
            <dl className="workflow-rail">
              {ORDER_STATUSES.map((status) => (
                <div key={status} className="workflow-row">
                  <span
                    className={cn("workflow-node", NODE_TONES[status])}
                    aria-hidden="true"
                  />
                  <dt>
                    <StatusBadge status={status} />
                  </dt>
                  <dd>{t(`descriptions.${status}`)}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </Reveal>
      </SectionSplit>
    </Section>
  );
}
