import type { Dictionary } from '@/lib/i18n';
import { pageFrame, reveal, sectionSpacing } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { SectionHeading } from './section-heading';

export function ApproachSection({ copy }: { copy: Dictionary }) {
  return (
    <section id="approach" className={sectionSpacing}>
      <div className={pageFrame}>
        <SectionHeading
          eyebrow={copy.approach.eyebrow}
          title={copy.approach.title}
          description={copy.approach.description}
          aside={
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-signal">
              Operating principles / 03
            </span>
          }
        />

        <div className="mt-14 border-y border-border sm:mt-20">
          {copy.approach.principles.map((principle) => (
            <article
              key={principle.number}
              className={cn(
                reveal,
                'group grid gap-5 border-b border-border px-0 py-7 last:border-b-0 md:grid-cols-[5rem_minmax(12rem,0.8fr)_minmax(0,1.2fr)] md:items-start md:gap-8 md:py-9',
              )}
              data-reveal
            >
              <span className="grid size-10 place-items-center border border-border font-mono text-[0.65rem] text-signal transition-colors group-hover:border-signal group-hover:bg-signal group-hover:text-primary-foreground">
                {principle.number}
              </span>
              <h3 className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                {principle.title}
              </h3>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                {principle.copy}
              </p>
              <span
                className="hidden h-px bg-signal transition-[width] duration-300 group-hover:w-full md:col-span-2 md:col-start-2 md:block md:w-12"
                aria-hidden="true"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
