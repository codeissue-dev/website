import { CheckIcon } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';

export function IssueTicket({ copy }: { copy: Dictionary['hero']['ticket'] }) {
  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-[0_1px_0_rgba(255,255,255,0.035)_inset] sm:p-6">
      <header className="flex items-center justify-between border-b border-border pb-4 text-sm">
        <span className="font-mono text-signal-soft">{copy.id}</span>
        <span className="inline-flex items-center gap-2 text-positive">
          <i className="size-1.5 rounded-full bg-positive" />
          {copy.status}
        </span>
      </header>

      <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">
        {copy.title}
      </h3>

      <dl className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-black p-4">
          <dt className="text-sm text-muted-foreground">{copy.inputLabel}</dt>
          <dd className="mt-2 text-sm font-medium">{copy.inputValue}</dd>
        </div>
        <div className="rounded-lg border border-border bg-black p-4">
          <dt className="text-sm text-muted-foreground">{copy.outputLabel}</dt>
          <dd className="mt-2 text-sm font-medium text-signal-soft">
            {copy.outputValue}
          </dd>
        </div>
      </dl>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {copy.stages.map((stage, index) => (
          <div
            key={stage}
            className="rounded-md border border-border bg-black p-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-muted-foreground">
                0{index + 1}
              </span>
              {index === 0 ? (
                <CheckIcon className="size-4 text-positive" />
              ) : null}
            </div>
            <span className="mt-3 block text-sm">{stage}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
