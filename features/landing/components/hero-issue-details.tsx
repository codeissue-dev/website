import type { Dictionary } from '@/lib/i18n';

export function HeroIssueDetails({
  copy,
}: {
  copy: Dictionary['hero']['ticket'];
}) {
  const items = [
    [copy.inputLabel, copy.inputValue, false],
    [copy.outputLabel, copy.outputValue, true],
    [copy.ownerLabel, copy.ownerValue, false],
  ] as const;

  return (
    <aside className="grid content-between gap-8 bg-black/35 p-5 sm:p-7">
      <div>
        <p className="font-mono text-sm text-muted-foreground">ISSUE DETAILS</p>
        <dl className="mt-5 grid gap-5">
          {items.map(([label, value, accent]) => (
            <div key={label}>
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd
                className={
                  accent
                    ? 'mt-1 text-sm font-medium text-signal-soft'
                    : 'mt-1 text-sm font-medium'
                }
              >
                {value}
              </dd>
            </div>
          ))}
          <div>
            <dt className="text-sm text-muted-foreground">
              {copy.reviewLabel}
            </dt>
            <dd className="mt-1 inline-flex items-center gap-2 text-sm font-medium">
              <i className="size-1.5 rounded-full bg-positive" />
              {copy.reviewValue}
            </dd>
          </div>
        </dl>
      </div>
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <i className="size-1.5 rounded-full bg-signal" />
          Live workflow
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
          <span className="block h-full w-[58%] rounded-full bg-linear-to-r from-signal to-signal-soft" />
        </div>
        <p className="mt-3 font-mono text-sm text-muted-foreground">
          58% / release path
        </p>
      </div>
    </aside>
  );
}
