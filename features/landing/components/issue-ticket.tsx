import { ArrowRightIcon, CheckIcon } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';
import { reveal } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

export function IssueTicket({ copy }: { copy: Dictionary['hero']['ticket'] }) {
  return (
    <aside
      className={cn(
        reveal,
        'relative flex min-h-[34rem] flex-col overflow-hidden border-t border-border bg-black/70 p-5 sm:min-h-[38rem] sm:p-8 lg:min-h-0 lg:border-t-0 lg:p-9',
      )}
      aria-label={copy.title}
      data-reveal
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-55 [background-image:linear-gradient(rgba(148,141,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,141,255,0.07)_1px,transparent_1px)] [background-size:3rem_3rem]"
        aria-hidden="true"
      />

      <header className="relative flex items-center justify-between border-b border-border pb-4 font-mono text-sm tracking-[0.1em]">
        <span className="text-signal">{copy.id}</span>
        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <i className="size-1.5 bg-positive" aria-hidden="true" />
          {copy.status}
        </span>
      </header>

      <div className="relative mt-8">
        <span className="font-mono text-sm tracking-[0.1em] text-muted-foreground">
          {copy.inputLabel} / {copy.outputLabel}
        </span>
        <h2 className="mt-3 max-w-[12ch] text-[clamp(1.8rem,3vw,2.8rem)] font-medium leading-[1.02] tracking-[-0.045em]">
          {copy.title}
        </h2>
      </div>

      <div className="relative mt-8 grid grid-cols-[1fr_2.75rem_1fr] border-y border-border bg-black">
        <div className="p-4">
          <span className="block font-mono text-sm tracking-[0.1em] text-muted-foreground">
            {copy.inputLabel}
          </span>
          <strong className="mt-2 block text-sm leading-5">
            {copy.inputValue}
          </strong>
        </div>
        <span className="grid place-items-center border-x border-border text-signal">
          <ArrowRightIcon className="size-4" />
        </span>
        <div className="p-4">
          <span className="block font-mono text-sm tracking-[0.1em] text-muted-foreground">
            {copy.outputLabel}
          </span>
          <strong className="mt-2 block text-sm leading-5">
            {copy.outputValue}
          </strong>
        </div>
      </div>

      <ol className="relative mt-8 border-l border-border pl-5">
        {copy.stages.map((stage, index) => (
          <li
            key={stage}
            className="relative grid min-h-14 grid-cols-[2.25rem_1fr_auto] items-center border-b border-border last:border-b-0"
          >
            <span
              className={cn(
                'absolute -left-[1.33rem] size-2 border border-border-strong bg-black',
                index === 0 && 'border-signal bg-signal',
              )}
              aria-hidden="true"
            />
            <span className="font-mono text-sm text-muted-foreground">
              0{index + 1}
            </span>
            <span className="text-sm">{stage}</span>
            {index === 0 ? (
              <CheckIcon className="size-3.5 text-positive" />
            ) : (
              <span
                className="size-1.5 border border-border-strong"
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>

      <footer className="relative mt-auto grid grid-cols-2 border-t border-border pt-4">
        <div>
          <span className="block font-mono text-sm tracking-[0.1em] text-muted-foreground">
            {copy.ownerLabel}
          </span>
          <strong className="mt-1 block text-sm">{copy.ownerValue}</strong>
        </div>
        <div className="border-l border-border pl-4">
          <span className="block font-mono text-sm tracking-[0.1em] text-muted-foreground">
            {copy.reviewLabel}
          </span>
          <strong className="mt-1 block text-sm">{copy.reviewValue}</strong>
        </div>
      </footer>
    </aside>
  );
}
