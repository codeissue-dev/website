import type { Dictionary } from '@/lib/i18n';
import { pageFrame, sectionSpacing } from '@/lib/ui/styles';

import { ProcessTimeline } from './process-timeline';
import { ProcessVisual } from './process-visual';
import { SectionHeading } from './section-heading';

export function ProcessSection({ copy }: { copy: Dictionary }) {
  return (
    <section id="process" className={sectionSpacing}>
      <div className={pageFrame}>
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
        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
          <ProcessVisual copy={copy.process} />
          <ProcessTimeline copy={copy.process} />
        </div>
      </div>
    </section>
  );
}
