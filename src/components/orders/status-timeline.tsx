import { roleLabel, StatusBadge } from "@/components/ui/status-badge";
import { ORDER_STATUS_LABELS } from "@/lib/orders/status";
import type { StatusEventPayload } from "@/lib/realtime/events";
import { formatDateTime, toIsoString } from "@/lib/utils";

/**
 * Status history, rendered from persisted `order_status_events` rows.
 *
 * Nothing here is derived in the UI: each entry is a row that was written in
 * the same transaction as the status change it describes.
 */
export function StatusTimeline({ events }: { events: StatusEventPayload[] }) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        The history will list every status change with its author and time.
      </p>
    );
  }

  return (
    <ol className="relative flex flex-col gap-4 border-l border-line pl-5">
      {events.map((event) => (
        <li key={event.id} className="relative">
          <span
            aria-hidden="true"
            className="absolute top-1.5 -left-[1.4375rem] size-2 rounded-full border border-line-strong bg-surface"
          />
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={event.toStatus} />
            {event.fromStatus ? (
              <span className="text-xs text-ink-subtle">
                from {ORDER_STATUS_LABELS[event.fromStatus]}
              </span>
            ) : (
              <span className="text-xs text-ink-subtle">request created</span>
            )}
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            <time dateTime={toIsoString(event.createdAt)}>
              {formatDateTime(event.createdAt)}
            </time>
            {" · "}
            {event.actor.name ?? roleLabel(event.actor.role)}
            {" ("}
            {roleLabel(event.actor.role)}
            {")"}
          </p>
          {event.note ? (
            <p className="mt-1.5 rounded-md border border-line bg-surface-muted px-3 py-2 text-sm whitespace-pre-line text-ink">
              {event.note}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
