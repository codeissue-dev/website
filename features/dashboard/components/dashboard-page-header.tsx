import type { ReactNode } from 'react';

export function DashboardPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="border-b border-border pb-7">
      <p className="font-mono text-sm text-signal-soft">{eyebrow}</p>
      <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
        {action}
      </div>
    </header>
  );
}
