import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
  as: Element = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article" | "aside";
}) {
  return (
    <Element
      className={cn(
        "surface-card overflow-hidden rounded-panel border border-line",
        className,
      )}
    >
      {children}
    </Element>
  );
}

export function PanelHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 border-b border-line/90 px-4 py-3.5 sm:px-5",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-sm font-semibold tracking-tight text-ink">{title}</h2>
        {description ? (
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-ink-muted">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function PanelBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("px-4 py-4 sm:px-5", className)}>{children}</div>;
}

/** A single figure. Every value shown here is read from Postgres by the caller. */
export function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <div className="stat-card rounded-panel border border-line px-4 py-4">
      <dt className="text-xs font-medium tracking-[0.08em] text-ink-muted uppercase">
        {label}
      </dt>
      <dd className="mt-2 text-2xl font-semibold tracking-tight text-ink tabular-nums">
        {value}
      </dd>
      {detail ? (
        <p className="mt-1 text-xs leading-relaxed text-ink-muted">{detail}</p>
      ) : null}
    </div>
  );
}
