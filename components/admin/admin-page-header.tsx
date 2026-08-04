import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <header
      className={cn(
        'admin-page-heading',
        compact && 'admin-page-heading--compact',
      )}
    >
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </header>
  );
}
