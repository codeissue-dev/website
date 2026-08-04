import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function FormField({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('grid gap-2', className)}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint ? (
        <span className="text-sm leading-5 text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  );
}

export function FormError({ children }: { children?: ReactNode }) {
  if (!children) return null;

  return (
    <p
      role="alert"
      className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2.5 text-sm text-danger"
    >
      {children}
    </p>
  );
}
