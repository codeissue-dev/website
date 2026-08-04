import type { Dictionary } from '@/lib/i18n';
import { eyebrow, pageFrame, reveal, sectionSpacing } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

export function ProcessSection({ copy }: { copy: Dictionary }) {
  return (
    <section id="process" className={cn(sectionSpacing, 'bg-black')}>
      <div className={pageFrame}>
        <div className="border-y border-border">
          <div className="grid min-h-11 grid-cols-[1fr_auto] items-center border-b border-border px-4 font-mono text-[0.58rem] tracking-[0.1em] text-muted-foreground sm:px-6">
            <span>{copy.process.currentLabel}</span>
            <span className="flex items-center gap-2 text-positive">
              <i className="size-1.5 bg-positive" aria-hidden="true" />
              {copy.process.status}
            </span>
          </div>

          <div className="grid lg:grid-cols-[minmax(18rem,0.7fr)_minmax(0,1.3fr)]">
            <header className="border-b border-border p-5 sm:p-8 lg:sticky lg:top-[4.5rem] lg:h-[calc(100vh-4.5rem)] lg:border-r lg:border-b-0 lg:p-10">
              <p className={cn(eyebrow, reveal)} data-reveal>
                {copy.process.eyebrow}
              </p>
              <h2
                className={cn(
                  reveal,
                  'mt-7 max-w-[12ch] text-[clamp(2.1rem,3.8vw,4rem)] font-medium leading-[0.99] tracking-[-0.05em]',
                )}
                data-reveal
              >
                {copy.process.title}
              </h2>
              <p
                className={cn(
                  reveal,
                  'mt-7 max-w-md text-base leading-7 text-muted-foreground',
                )}
                data-reveal
              >
                {copy.process.description}
              </p>
              <div className="mt-10 hidden border-t border-border pt-4 font-mono text-[0.58rem] leading-5 text-muted-foreground lg:block">
                {copy.process.facts.map((fact) => (
                  <span key={fact} className="block">
                    {fact}
                  </span>
                ))}
              </div>
            </header>

            <ol>
              {copy.process.steps.map((step, index) => (
                <li
                  key={step.number}
                  className={cn(
                    reveal,
                    'group grid gap-5 border-b border-border p-5 last:border-b-0 sm:p-8 md:grid-cols-[4rem_minmax(12rem,0.72fr)_minmax(0,1fr)] md:gap-8 lg:min-h-56 lg:p-10',
                  )}
                  data-reveal
                >
                  <div className="flex items-start justify-between md:block">
                    <span className="font-mono text-[0.64rem] text-signal">
                      {step.number}
                    </span>
                    <span className="font-mono text-[0.55rem] text-border-strong md:mt-16 md:block">
                      {String(index + 1).padStart(2, '0')} / 04
                    </span>
                  </div>
                  <h3 className="max-w-[16ch] text-2xl font-medium leading-tight tracking-[-0.035em] sm:text-3xl">
                    {step.title}
                  </h3>
                  <div className="flex flex-col justify-between gap-6">
                    <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                      {step.copy}
                    </p>
                    <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4">
                      <span className="font-mono text-[0.56rem] tracking-[0.08em] text-muted-foreground">
                        {copy.process.deliverablesLabel}
                      </span>
                      {step.deliverables.map((deliverable) => (
                        <span
                          key={deliverable}
                          className="font-mono text-[0.58rem] text-foreground"
                        >
                          + {deliverable}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
