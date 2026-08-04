import { cn } from '@/lib/utils';

export function ChannelAvatar({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-surface-soft font-mono text-sm font-semibold uppercase text-signal-soft',
        className,
      )}
    >
      {source.slice(0, 2).toUpperCase()}
    </span>
  );
}
