import { CheckIcon } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function ProcessPanel({
  copy,
  active,
}: {
  copy: Dictionary['process'];
  active: number;
}) {
  const step = copy.steps[active] ?? copy.steps[0];

  return (
    <div className="border border-border bg-surface p-5" key={active}>
      <div className="flex items-center justify-between border-b border-border pb-4 font-mono text-sm uppercase tracking-[0.14em] text-muted-foreground">
        <span>{copy.currentLabel}</span>
        <span className="inline-flex items-center gap-2">
          <i className="size-1.5 bg-positive" aria-hidden="true" />
          {copy.status}
        </span>
      </div>

      <div className="mt-8 font-mono text-sm text-signal">{step.number}</div>
      <h3 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">
        {step.title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-muted-foreground">
        {step.copy}
      </p>

      <div className="mt-8 border-t border-border pt-5">
        <span className="font-mono text-sm uppercase tracking-[0.14em] text-muted-foreground">
          {copy.deliverablesLabel}
        </span>
        <ul className="mt-4 space-y-3">
          {step.deliverables.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm">
              <CheckIcon className="size-4 text-signal" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 grid grid-cols-4 gap-2" aria-hidden="true">
        {copy.steps.map((item, index) => (
          <span
            key={item.number}
            className={cn('h-1 bg-border', index <= active && 'bg-signal')}
          />
        ))}
      </div>
    </div>
  );
}
