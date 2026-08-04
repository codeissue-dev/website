import { ArrowRightIcon, CheckIcon } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';
import { reveal } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

export function IssueTicket({ copy }: { copy: Dictionary['hero']['ticket'] }) {
  return (
    <aside
      className={cn(
        reveal,
        'relative m-3 flex min-h-[38rem] flex-col overflow-hidden border border-border bg-surface/90 p-5 [clip-path:polygon(0_0,90%_0,100%_8%,100%_100%,0_100%)] sm:m-5 sm:p-7 lg:m-7',
      )}
      aria-label={copy.title}
      data-reveal
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(135,149,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(135,149,255,0.07)_1px,transparent_1px)] [background-size:2.5rem_2.5rem]"
        aria-hidden="true"
      />
      <header className="relative flex items-center justify-between border-b border-border pb-4 font-mono text-[0.62rem] uppercase tracking-[0.14em]">
        <span className="text-signal">{copy.id}</span>
        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <i className="size-1.5 rounded-full bg-positive" aria-hidden="true" />
          {copy.status}
        </span>
      </header>

      <div className="relative mt-12">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">
          Brief / 01
        </span>
        <h2 className="mt-3 max-w-[11ch] text-[clamp(2rem,4vw,3.65rem)] font-semibold leading-[0.98] tracking-[-0.05em]">
          {copy.title}
        </h2>
      </div>

      <div className="relative mt-10 grid grid-cols-[1fr_auto_1fr] items-stretch border-y border-border">
        <div className="py-4 pr-3">
          <span className="block font-mono text-[0.55rem] uppercase tracking-[0.14em] text-muted-foreground">
            {copy.inputLabel}
          </span>
          <strong className="mt-2 block text-sm leading-5">
            {copy.inputValue}
          </strong>
        </div>
        <span className="grid place-items-center border-x border-border px-3 text-signal">
          <ArrowRightIcon className="size-4" />
        </span>
        <div className="py-4 pl-3">
          <span className="block font-mono text-[0.55rem] uppercase tracking-[0.14em] text-muted-foreground">
            {copy.outputLabel}
          </span>
          <strong className="mt-2 block text-sm leading-5">
            {copy.outputValue}
          </strong>
        </div>
      </div>

      <ol className="relative mt-10 grid gap-0">
        {copy.stages.map((stage, index) => (
          <li
            key={stage}
            className="grid grid-cols-[2.25rem_1fr] items-center border-t border-border py-3 first:border-t-0"
          >
            <span className="grid size-6 place-items-center rounded-full border border-border-strong bg-background font-mono text-[0.6rem] text-signal">
              {index === 0 ? <CheckIcon className="size-3" /> : index + 1}
            </span>
            <span className="text-sm text-muted-foreground">{stage}</span>
          </li>
        ))}
      </ol>

      <footer className="relative mt-auto grid grid-cols-2 border-t border-border pt-4">
        <div>
          <span className="block font-mono text-[0.55rem] uppercase tracking-[0.14em] text-muted-foreground">
            {copy.ownerLabel}
          </span>
          <strong className="mt-1 block text-xs">{copy.ownerValue}</strong>
        </div>
        <div className="border-l border-border pl-4">
          <span className="block font-mono text-[0.55rem] uppercase tracking-[0.14em] text-muted-foreground">
            {copy.reviewLabel}
          </span>
          <strong className="mt-1 block text-xs">{copy.reviewValue}</strong>
        </div>
      </footer>
    </aside>
  );
}
