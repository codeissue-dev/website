import Link from "next/link";

import { StatusBadge } from "@/components/ui/status-badge";
import type { ActivityEntry } from "@/lib/stats/queries";
import { displayName, formatRelativeTime } from "@/lib/utils";

/**
 * Recent status changes, read from `order_status_events`.
 * Nothing here is derived from the interface: each row is a persisted event.
 */
export function ActivityList({ entries }: { entries: ActivityEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="px-4 py-6 text-sm text-ink-muted sm:px-5">
        No status changes have been recorded yet.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-line">
      {entries.map((entry) => (
        <li key={entry.id} className="px-4 py-3.5 sm:px-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={entry.toStatus} />
            <Link
              href={`/orders/${entry.reference}`}
              className="text-sm font-medium text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
            >
              {entry.title}
            </Link>
            <span className="font-mono text-xs text-ink-subtle">{entry.reference}</span>
          </div>
          <p className="mt-1 text-xs text-ink-muted">
            {displayName(entry.actorName, entry.actorEmail)} &middot;{" "}
            <time dateTime={entry.createdAt.toISOString()}>
              {formatRelativeTime(entry.createdAt)}
            </time>
          </p>
          {entry.note ? (
            <p className="mt-1.5 text-sm text-ink-muted">{entry.note}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
