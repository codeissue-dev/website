import { CheckIcon } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';

export function IssueIntakeAside({ copy }: { copy: Dictionary['newIssue'] }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:h-fit">
      <p className="font-mono text-sm text-signal-soft">{copy.eyebrow}</p>
      <h1 className="mt-5 max-w-[14ch] text-[clamp(2.3rem,5vw,4.4rem)] font-semibold leading-[1] tracking-[-0.06em]">
        {copy.title}
      </h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
        {copy.description}
      </p>
      <ol className="mt-8 grid gap-3 border-t border-border pt-6">
        {copy.steps.map((step, index) => (
          <li key={step} className="flex items-center gap-3 text-sm">
            <span className="grid size-7 place-items-center rounded-md border border-border bg-surface text-signal-soft">
              {index < 1 ? (
                <CheckIcon className="size-3.5" />
              ) : (
                <span className="font-mono text-sm">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
            </span>
            <span className="text-muted-foreground">{step}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
