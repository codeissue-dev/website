import { useTranslations } from "next-intl";

import { StatusBadge } from "@/components/ui/status-badge";
import type { StatusEventPayload } from "@/lib/realtime/events";
import { formatDateTime, toIsoString } from "@/lib/utils";

/**
 * Status history, rendered from persisted `order_status_events` rows.
 *
 * Nothing here is derived in the UI: each entry is a row that was written in
 * the same transaction as the status change it describes.
 */
export function StatusTimeline({ events }: { events: StatusEventPayload[] }) {
  const t = useTranslations("Order");
  const tStatuses = useTranslations("Statuses");
  const tRoles = useTranslations("Roles");

  if (events.length === 0) {
    return <p className="text-sm text-ink-muted">{t("historyEmpty")}</p>;
  }

  return (
    <ol className="timeline relative flex flex-col gap-4">
      {events.map((event) => (
        <li key={event.id} className="relative">
          <span aria-hidden="true" className="timeline-dot" />
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={event.toStatus} />
            {event.fromStatus ? (
              <span className="text-xs text-ink-subtle">
                {t("fromStatus", { status: tStatuses(event.fromStatus) })}
              </span>
            ) : (
              <span className="text-xs text-ink-subtle">{t("created")}</span>
            )}
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            <time dateTime={toIsoString(event.createdAt)}>
              {formatDateTime(event.createdAt)}
            </time>
            {", "}
            {event.actor.name ?? tRoles(event.actor.role)}
            {" ("}
            {tRoles(event.actor.role)}
            {")"}
          </p>
          {event.note ? (
            <p className="note mt-2 whitespace-pre-line text-ink">{event.note}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
