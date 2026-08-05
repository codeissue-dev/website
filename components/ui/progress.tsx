import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type DataAttributes = {
  [key: `data-${string}`]: string | number | boolean | null | undefined;
};

type ProgressIndicatorProps = HTMLAttributes<HTMLDivElement> & DataAttributes;

export function Progress({
  value = 0,
  className,
  indicatorClassName,
  indicatorProps,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  value?: number;
  indicatorClassName?: string;
  indicatorProps?: ProgressIndicatorProps;
}) {
  const normalized = Math.max(0, Math.min(100, value));

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(normalized)}
      className={cn(
        'relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'h-full origin-left rounded-full bg-primary transition-transform duration-300 ease-out',
          indicatorClassName,
        )}
        style={{ transform: `scaleX(${normalized / 100})` }}
        {...indicatorProps}
      />
    </div>
  );
}
