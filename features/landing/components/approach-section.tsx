import type { Dictionary } from '@/lib/i18n';
import { eyebrow, pageFrame, reveal, sectionSpacing } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

export function ApproachSection({ copy }: { copy: Dictionary }) {
  return (
    <section id="approach" className={sectionSpacing}>
      <div className={pageFrame}>
        <div className="grid border-t border-border lg:grid-cols-[minmax(18rem,0.78fr)_minmax(0,1.22fr)]">
          <header className="border-b border-border py-6 lg:border-r lg:border-b-0 lg:pr-10">
            <p className={cn(eyebrow, reveal)} data-reveal>
              {copy.approach.eyebrow}
            </p>
            <h2
              className={cn(
                reveal,
                'mt-7 max-w-[12ch] text-[clamp(2.15rem,4vw,4.3rem)] font-medium leading-[0.98] tracking-[-0.05em]',
              )}
              data-reveal
            >
              {copy.approach.title}
            </h2>
            <p
              className={cn(
                reveal,
                'mt-7 max-w-lg text-base leading-7 text-muted-foreground',
              )}
              data-reveal
            >
              {copy.approach.description}
            </p>
          </header>

          <div className="lg:pl-10">
            <div className="border-b border-border py-5 font-mono text-sm tracking-[0.1em] text-muted-foreground">
              {copy.approach.label}
            </div>
            {copy.approach.principles.map((principle) => (
              <article
                key={principle.number}
                className={cn(
                  reveal,
                  'grid gap-4 border-b border-border py-7 sm:grid-cols-[3rem_minmax(12rem,0.72fr)_minmax(0,1fr)] sm:gap-6 sm:py-8',
                )}
                data-reveal
              >
                <span className="font-mono text-sm text-signal">
                  {principle.number}
                </span>
                <h3 className="max-w-[18ch] text-xl font-medium tracking-[-0.025em] sm:text-2xl">
                  {principle.title}
                </h3>
                <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  {principle.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
