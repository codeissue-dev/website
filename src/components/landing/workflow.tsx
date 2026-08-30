import { SectionHeading } from "@/components/ui/section-heading";
import {
  ORDER_STATUS_DESCRIPTIONS,
  ORDER_STATUS_LABELS,
  ORDER_STATUSES,
} from "@/lib/orders/status";

/** Delivery workflow generated from the same state machine as the platform. */
export function Workflow() {
  return (
    <section
      id="workflow"
      aria-labelledby="workflow-heading"
      className="public-section border-b border-line"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:gap-16">
          <SectionHeading
            id="workflow-heading"
            eyebrow="The project space"
            title={
              <>
                Everyone sees the same{" "}
                <span className="heading-accent">next step.</span>
              </>
            }
            description="The stages below are the real states used by the platform. Only the right moves are available, and every change is recorded."
          />
          <dl className="workflow-grid stagger-grid grid gap-3 sm:grid-cols-2">
            {ORDER_STATUSES.map((status, index) => (
              <div key={status} className="workflow-card interactive-card">
                <span className="workflow-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <dt>{ORDER_STATUS_LABELS[status]}</dt>
                  <dd>{ORDER_STATUS_DESCRIPTIONS[status]}</dd>
                </div>
                <span aria-hidden="true" className="workflow-beacon" />
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
