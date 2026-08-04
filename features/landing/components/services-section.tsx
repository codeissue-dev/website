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
        />

        <div className="mt-14 border-t border-border sm:mt-20">
          {copy.services.items.map((item) => (
            <article
              key={item.number}
              className={cn(
                reveal,
                'group grid gap-4 border-b border-border py-6 md:grid-cols-[4.5rem_minmax(12rem,0.75fr)_minmax(0,1.25fr)_2rem] md:items-center md:gap-8 md:py-8',
              )}
              data-reveal
            >
              <span className="font-mono text-[0.65rem] text-signal">
                {item.number}
              </span>
              <h3 className="text-xl font-semibold tracking-[-0.035em] transition-transform duration-200 group-hover:translate-x-2 sm:text-2xl">
                {item.title}
              </h3>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                {item.copy}
              </p>
              <ArrowUpRightIcon className="size-5 text-muted-foreground transition-colors group-hover:text-signal" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
