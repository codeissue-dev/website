import { CheckIcon } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';
import { pageFrame, reveal, sectionSpacing } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { SectionHeading } from './section-heading';

export function ProcessSection({ copy }: { copy: Dictionary }) {
  return (
    <section id="process" className={cn(sectionSpacing, 'bg-surface-quiet')}>
      <div className={pageFrame}>
        <SectionHeading
          eyebrow={copy.process.eyebrow}
          title={copy.process.title}
          description={copy.process.description}
          aside={
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-signal">
              01 → 04 / one route
            </span>
          }
        />

        <ol className="relative mt-16 grid border border-border md:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {copy.process.steps.map((step, index) => (
            <li
              key={step.number}
              className={cn(
                reveal,
                'group relative flex min-h-[24rem] flex-col border-b border-border p-5 last:border-b-0 md:[&:nth-child(odd)]:border-r lg:border-r lg:border-b-0 lg:last:border-r-0',
              )}
              data-reveal
            >
              <div className="flex items-center justify-between border-b border-border pb-4 font-mono text-[0.62rem] uppercase tracking-[0.14em]">
                <span className="text-signal">{step.number}</span>
                <span className="text-muted-foreground">
                  {String(index + 1).padStart(2, '0')} / 04
                </span>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <span className="size-2.5 rounded-full border border-signal bg-background transition-colors group-hover:bg-signal" />
                <span className="h-px flex-1 bg-border transition-colors group-hover:bg-signal" />
              </div>
              <h3 className="mt-8 text-2xl font-semibold tracking-[-0.04em]">
                {step.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {step.copy}
              </p>
              <ul className="mt-auto space-y-3 border-t border-border pt-5">
                {step.deliverables.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-xs leading-5 text-muted-foreground"
                  >
                    <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-signal" />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
