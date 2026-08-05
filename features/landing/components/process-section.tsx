import type { Dictionary } from '@/lib/i18n';
import { pageFrame } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { ProcessStageList } from './process-stage-list';
import { ProcessTimeline } from './process-timeline';
import { ProcessVisual } from './process-visual';
import { SectionHeading } from './section-heading';

export function ProcessSection({ copy }: { copy: Dictionary }) {
  return (
    <section
      id="process"
      className="relative border-y border-border/70 bg-black lg:h-[430vh]"
      data-process-section
    >
      <div className="py-20 lg:sticky lg:top-0 lg:flex lg:min-h-screen lg:items-center lg:overflow-hidden lg:py-10">
        <div className={cn(pageFrame, 'w-full')}>
          <SectionHeading
            eyebrow={copy.process.eyebrow}
            title={copy.process.title}
            description={copy.process.description}
            aside={
              <div className="flex flex-wrap gap-2">
                {copy.process.facts.map((fact) => (
                  <span
                    key={fact}
                    className="rounded-full border border-border bg-white/3 px-2.5 py-1 text-sm text-muted-foreground"
                  >
                    {fact}
                  </span>
                ))}
              </div>
            }
          />

          <div className="mt-12 hidden min-h-[32rem] grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)] items-stretch gap-5 lg:grid xl:mt-14 xl:gap-8">
            <ProcessVisual copy={copy.process} />
            <div className="flex flex-col justify-center">
              <ProcessStageList copy={copy.process} />
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:hidden">
            <ProcessVisual copy={copy.process} compact />
            <ProcessTimeline copy={copy.process} />
          </div>
        </div>
      </div>
    </section>
  );
}
