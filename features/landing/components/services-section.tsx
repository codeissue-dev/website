import { ArrowUpRightIcon } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';
import { pageFrame, reveal, sectionSpacing } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { SectionHeading } from './section-heading';

export function ServicesSection({ copy }: { copy: Dictionary }) {
  return (
    <section className={sectionSpacing}>
      <div className={pageFrame}>
        <SectionHeading
          eyebrow={copy.services.eyebrow}
          title={copy.services.title}
          description={copy.services.description}
          aside={
            <span className="font-mono text-sm tracking-[0.1em] text-muted-foreground">
              PRODUCT / PLATFORM / OPERATIONS
            </span>
          }
        />

        <div className="mt-14 border-t border-border sm:mt-16">
          {copy.services.items.map((item) => (
            <article
              key={item.number}
              className={cn(
                reveal,
                'group grid gap-4 border-b border-border py-6 md:grid-cols-[4rem_minmax(12rem,0.72fr)_minmax(0,1.28fr)_2rem] md:items-center md:gap-8 md:py-8',
              )}
              data-reveal
            >
              <span className="font-mono text-sm text-signal">
                {item.number}
              </span>
              <h3 className="text-xl font-medium tracking-[-0.03em] sm:text-2xl">
                {item.title}
              </h3>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                {item.copy}
              </p>
              <ArrowUpRightIcon className="size-5 text-border-strong transition-colors group-hover:text-signal" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
