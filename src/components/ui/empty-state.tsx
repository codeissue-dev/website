import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Says plainly that there is nothing here yet; never invents rows to fill space. */
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
        "empty-state flex flex-col items-start gap-2 px-5 py-8 sm:px-6",
        className,
      )}
    >
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="max-w-xl text-sm leading-relaxed text-ink-muted">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
