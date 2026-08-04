import { CheckIcon } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';
import { reveal } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

export function ProcessTimeline({ copy }: { copy: Dictionary['process'] }) {
  return (
    <ol className="relative border-l border-border pl-6 sm:pl-8">
      {copy.steps.map((step, index) => (
        <li
          key={step.number}
          className={cn(reveal, 'group relative pb-12 last:pb-0 sm:pb-16')}
          data-reveal
          data-process-step
        >
          <span
            className="absolute left-[-1.93rem] top-1 grid size-4 place-items-center rounded-full border border-border-strong bg-black transition-colors group-[.is-current]:border-signal group-[.is-current]:bg-signal sm:left-[-2.43rem]"
            aria-hidden="true"
          >
            <i className="size-1 rounded-full bg-black" />
          </span>
          <div className="rounded-xl border border-border bg-card p-5 transition-[border-color,background-color,transform] duration-300 group-[.is-current]:translate-x-1 group-[.is-current]:border-signal/45 group-[.is-current]:bg-surface-soft sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-sm text-signal-soft">
                {step.number}
              </span>
              <span className="font-mono text-sm text-muted-foreground">
                {String(index + 1).padStart(2, '0')} /{' '}
                {String(copy.steps.length).padStart(2, '0')}
              </span>
            </div>
            <h3 className="mt-7 max-w-[18ch] text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-3xl">
              {step.title}
            </h3>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              {step.copy}
            </p>
            <div className="mt-7 border-t border-border pt-5">
              <span className="text-sm font-medium text-foreground">
                {copy.deliverablesLabel}
              </span>
              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                {step.deliverables.map((deliverable) => (
                  <li
                    key={deliverable}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckIcon className="size-4 shrink-0 text-positive" />
                    {deliverable}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
