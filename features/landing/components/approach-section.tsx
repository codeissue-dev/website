import { CheckIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Dictionary } from '@/lib/i18n';
import { pageFrame, reveal, sectionSpacing } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { ApproachVisual } from './approach-visual';
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
            <Badge className="border-white/10 bg-black text-muted-foreground">
              {copy.approach.label}
            </Badge>
          }
        />

        <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)]">
          <div className="grid gap-3">
            {copy.approach.principles.map((principle) => (
              <Card
                key={principle.number}
                className={cn(
                  reveal,
                  'group p-5 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-soft sm:p-6',
                )}
                data-reveal
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-sm text-signal-soft">
                    {principle.number}
                  </span>
                  <span className="grid size-8 place-items-center rounded-md border border-border bg-black text-muted-foreground transition-colors group-hover:border-signal/40 group-hover:text-signal-soft">
                    <CheckIcon className="size-4" />
                  </span>
                </div>
                <h3 className="mt-7 text-xl font-semibold tracking-[-0.035em]">
                  {principle.title}
                </h3>
                <Separator className="my-4" />
                <p className="text-base leading-7 text-muted-foreground">
                  {principle.copy}
                </p>
              </Card>
            ))}
          </div>
          <ApproachVisual copy={copy.approach} />
        </div>
      </div>
    </section>
  );
}
