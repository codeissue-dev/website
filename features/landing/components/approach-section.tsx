import { CheckIcon } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';
import { pageFrame, reveal, sectionSpacing } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { SectionHeading } from './section-heading';

export function ApproachSection({ copy }: { copy: Dictionary }) {
  return (
    <section
      id="approach"
      className={cn(
        sectionSpacing,
        'border-y border-border/70 bg-white/[0.015]',
      )}
    >
      <div className={pageFrame}>
        <SectionHeading
          eyebrow={copy.approach.eyebrow}
          title={copy.approach.title}
          description={copy.approach.description}
          aside={
            <span className="font-mono text-sm text-muted-foreground">
              {copy.approach.label}
            </span>
          }
        />

        <div className="mt-12 grid gap-3 lg:mt-16 lg:grid-cols-3">
          {copy.approach.principles.map((principle) => (
            <article
              key={principle.number}
              className={cn(
                reveal,
                'group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 hover:border-border-strong hover:bg-surface-soft sm:p-7',
              )}
              data-reveal
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-signal-soft">
                  {principle.number}
                </span>
                <span className="grid size-8 place-items-center rounded-md border border-border bg-black text-muted-foreground transition-colors group-hover:border-signal/40 group-hover:text-signal-soft">
                  <CheckIcon className="size-4" />
                </span>
              </div>
              <h3 className="mt-10 max-w-[18ch] text-xl font-semibold tracking-[-0.035em] sm:text-2xl">
                {principle.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {principle.copy}
              </p>
              <span
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-linear-to-r from-signal to-transparent transition-transform duration-500 group-hover:scale-x-100"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
