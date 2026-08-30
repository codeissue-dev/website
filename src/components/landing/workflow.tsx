import {
  ORDER_STATUS_DESCRIPTIONS,
  ORDER_STATUS_LABELS,
  ORDER_STATUSES,
} from "@/lib/orders/status";

/**
 * Delivery workflow.
 *
 * The list is generated from the same state machine the application enforces,
 * so this section cannot describe a process the software does not implement.
 */
export function Workflow() {
  return (
    <section
      id="workflow"
      aria-labelledby="workflow-heading"
      className="border-b border-line bg-surface-muted"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <h2
            id="workflow-heading"
            className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl"
          >
            The states your project moves through
          </h2>
          <p className="mt-3 text-ink-muted">
            These are the exact statuses used inside the platform. Only permitted moves
            between them are possible, and each one is written to the project history
            with its author and time.
          </p>
        </div>

        <dl className="mt-10 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2">
          {ORDER_STATUSES.map((status, index) => (
            <div key={status} className="flex gap-4 bg-surface p-5">
              <span className="font-mono text-xs text-ink-subtle tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <dt className="text-sm font-semibold text-ink">
                  {ORDER_STATUS_LABELS[status]}
                </dt>
                <dd className="mt-1.5 text-sm text-ink-muted">
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
