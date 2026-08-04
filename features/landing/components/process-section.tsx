import Image from 'next/image';

import { CheckIcon } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';
import { pageFrame, reveal, sectionSpacing } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

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
                  className="rounded-full border border-border bg-white/[0.03] px-2.5 py-1 text-sm text-muted-foreground"
                >
                  {fact}
                </span>
              ))}
            </div>
          }
        />

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(18rem,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div
              className={cn(
                reveal,
                'relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-6',
              )}
              data-reveal
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-black">
                <div
                  className="absolute inset-0 [transform:translate3d(0,var(--parallax-y,0px),0)] transition-transform duration-200 motion-reduce:transform-none"
                  data-parallax="0.1"
                >
                  <Image
                    src="/images/avatar.png"
                    alt="Codeissue workflow illustration"
                    fill
                    sizes="(max-width: 1024px) 100vw, 36vw"
                    className="object-cover opacity-45 grayscale"
                  />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,#000_100%)]" />
                <div className="absolute inset-x-4 bottom-4 rounded-lg border border-white/10 bg-black/75 p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-sm text-muted-foreground">
                      {copy.process.currentLabel}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm text-positive">
                      <i className="size-1.5 rounded-full bg-positive" />
                      {copy.process.status}
                    </span>
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                    <span className="block h-full w-3/4 rounded-full bg-linear-to-r from-signal to-signal-soft" />
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-4 gap-2">
                {copy.process.steps.map((step, index) => (
                  <div
                    key={step.number}
                    className="rounded-md border border-border bg-black p-3 text-center"
                  >
                    <span className="font-mono text-sm text-signal-soft">
                      0{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ol className="relative border-l border-border pl-6 sm:pl-8">
            {copy.process.steps.map((step, index) => (
              <li
                key={step.number}
                className={cn(
                  reveal,
                  'group relative pb-12 last:pb-0 sm:pb-16',
                )}
                data-reveal
                data-process-step
              >
                <span
                  className="absolute -left-[1.93rem] top-1 grid size-4 place-items-center rounded-full border border-border-strong bg-black transition-colors group-[.is-current]:border-signal group-[.is-current]:bg-signal sm:-left-[2.43rem]"
                  aria-hidden="true"
                >
                  <i className="size-1 rounded-full bg-black" />
                </span>
                <div className="rounded-xl border border-border bg-card p-5 transition-[border-color,background-color,transform] duration-300 group-[.is-current]:translate-x-1 group-[.is-current]:border-signal/45 group-[.is-current]:bg-surface-soft sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-sm text-signal-soft">
                      {step.number}
                    </span>
                    <span className="font-mono text-sm text-muted-foreground">
                      {String(index + 1).padStart(2, '0')} / 04
                    </span>
                  </div>
                  <h3 className="mt-7 max-w-[18ch] text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                    {step.copy}
                  </p>
                  <div className="mt-7 border-t border-border pt-5">
                    <span className="text-sm font-medium text-foreground">
                      {copy.process.deliverablesLabel}
                    </span>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                      {step.deliverables.map((deliverable) => (
                        <li
                          key={deliverable}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <CheckIcon className="size-4 shrink-0 text-positive" />
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
