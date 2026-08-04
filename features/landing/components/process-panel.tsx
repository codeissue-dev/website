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
    <div
      className="rounded-xl border border-border bg-card p-5 shadow-[0_1px_0_rgba(255,255,255,0.035)_inset]"
      key={active}
    >
      <div className="flex items-center justify-between border-b border-border pb-4 text-sm text-muted-foreground">
        <span>{copy.currentLabel}</span>
        <span className="inline-flex items-center gap-2 text-positive">
          <i className="size-1.5 rounded-full bg-positive" aria-hidden="true" />
          {copy.status}
        </span>
      </div>

      <div className="mt-7 font-mono text-sm text-signal-soft">
        {step.number}
      </div>
      <h3 className="mt-3 text-3xl font-semibold tracking-[-0.045em]">
        {step.title}
      </h3>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        {step.copy}
      </p>

      <div className="mt-7 border-t border-border pt-5">
        <span className="text-sm font-medium">{copy.deliverablesLabel}</span>
        <ul className="mt-4 space-y-3">
          {step.deliverables.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <CheckIcon className="size-4 text-positive" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-7 grid grid-cols-4 gap-2" aria-hidden="true">
        {copy.steps.map((item, index) => (
          <span
            key={item.number}
            className={cn(
              'h-1 rounded-full bg-border',
              index <= active && 'bg-signal',
            )}
          />
        ))}
      </div>
    </div>
  );
}
