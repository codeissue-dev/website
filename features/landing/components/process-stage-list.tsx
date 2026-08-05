import {
  ChartIcon,
  CursorIcon,
  FileTextIcon,
  GitBranchIcon,
} from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const icons = [FileTextIcon, CursorIcon, GitBranchIcon, ChartIcon] as const;

export function ProcessStageList({ copy }: { copy: Dictionary['process'] }) {
  return (
    <ol className="grid gap-2" aria-label={copy.title}>
      {copy.steps.map((step, index) => {
        const Icon = icons[index] ?? FileTextIcon;
        return (
          <li
            key={step.number}
            className={cn(
              'group relative overflow-hidden rounded-xl border border-border bg-white/[0.018] p-4 opacity-45 transition-[opacity,transform,border-color,background-color] duration-500 sm:p-5',
              index === 0 && 'is-current opacity-100',
            )}
            data-process-step
          >
            <div className="flex items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-black text-signal-soft transition-colors group-[.is-current]:border-signal/40 group-[.is-current]:bg-signal/10">
                <Icon className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-sm text-signal-soft">
                    {step.number}
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">
                    {String(index + 1).padStart(2, '0')} /{' '}
                    {String(copy.steps.length).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-semibold tracking-[-0.035em] sm:text-xl">
                  {step.title}
                </h3>
                <p className="mt-2 hidden text-sm leading-6 text-muted-foreground group-[.is-current]:block lg:block lg:max-h-0 lg:overflow-hidden lg:opacity-0 lg:transition-[max-height,opacity,margin] lg:duration-500 lg:group-[.is-current]:mt-3 lg:group-[.is-current]:max-h-24 lg:group-[.is-current]:opacity-100">
                  {step.copy}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
