import { ArrowUpRightIcon } from '@/components/icons';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Dictionary } from '@/lib/i18n';
import { pageFrame, reveal, sectionSpacing } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { SectionHeading } from './section-heading';
import { ServiceVisual } from './service-visual';

export function ServicesSection({ copy }: { copy: Dictionary }) {
  return (
    <section
      className={cn(
        sectionSpacing,
        'border-y border-border/70 bg-white/[0.015]',
      )}
    >
      <div className={pageFrame}>
        <SectionHeading
          eyebrow={copy.services.eyebrow}
          title={copy.services.title}
          description={copy.services.description}
          aside={
            <span className="font-mono text-sm text-muted-foreground">
              PRODUCT / PLATFORM / OPERATIONS
            </span>
          }
        />

        <div className="mt-14 grid gap-3 md:grid-cols-2 lg:mt-16">
          {copy.services.items.map((item, index) => (
            <Card
              key={item.number}
              className={cn(
                reveal,
                'group overflow-hidden transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-soft',
              )}
              data-reveal
            >
              <ServiceVisual index={index} />
              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-sm text-signal-soft">
                    {item.number}
                  </span>
                  <ArrowUpRightIcon className="size-4 text-muted-foreground transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.035em] sm:text-2xl">
                  {item.title}
                </h3>
                <Separator className="my-4" />
                <p className="max-w-xl text-base leading-7 text-muted-foreground">
                  {item.copy}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
