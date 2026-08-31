import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** A bordered surface. The same panel is used on public pages and in the workspace. */
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
    <div className={cn("panel-header", className)}>
      <div className="min-w-0">
        <h2 className="panel-title">{title}</h2>
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
  return <div className={cn("px-4 py-4", className)}>{children}</div>;
}

/** A single figure. Every value shown here is counted in PostgreSQL by the caller. */
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
    <div className="stat-card">
      <dt className="label-quiet">{label}</dt>
      <dd className="stat-value">{value}</dd>
      {detail ? (
        <p className="mt-1 text-xs leading-relaxed text-ink-muted">{detail}</p>
      ) : null}
    </div>
  );
}
