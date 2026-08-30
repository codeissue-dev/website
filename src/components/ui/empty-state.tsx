import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Deliberate empty state; never fills unavailable data with invented rows. */
export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "empty-state flex flex-col items-center gap-2 rounded-panel border border-dashed border-line px-6 py-10 text-center",
        className,
      )}
    >
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="max-w-md text-sm leading-relaxed text-ink-muted">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
