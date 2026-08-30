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
      className="border-b border-line bg-surface-muted"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          id="workflow-heading"
          eyebrow="Delivery system"
          title="The states your project moves through"
          description="These are the exact statuses used inside the platform. Only permitted moves between them are possible, and each one is written to the project history with its author and time."
        />
        <dl className="stagger-grid mt-10 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2">
          {ORDER_STATUSES.map((status, index) => (
            <div
              key={status}
              className="interactive-card flex gap-4 bg-surface p-5 sm:p-6"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-semibold text-accent tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <dt className="text-base font-semibold text-ink">
                  {ORDER_STATUS_LABELS[status]}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {ORDER_STATUS_DESCRIPTIONS[status]}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
