import Image from 'next/image';

import type { Dictionary } from '@/lib/i18n';
import { eyebrow, pageFrame, reveal, sectionSpacing } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

export function ProcessSection({ copy }: { copy: Dictionary }) {
  return (
    <section id="process" className={cn(sectionSpacing, 'bg-black')}>
      <div className={pageFrame}>
        <div className="border-y border-border">
          <div className="grid min-h-12 grid-cols-[1fr_auto] items-center border-b border-border px-4 font-mono text-sm tracking-[0.08em] text-muted-foreground sm:px-6">
            <span>{copy.process.currentLabel}</span>
            <span className="flex items-center gap-2 text-positive">
              <i className="size-2 bg-positive" aria-hidden="true" />
              {copy.process.status}
            </span>
          </div>

          <header className="grid gap-8 border-b border-border p-5 sm:p-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(24rem,1.18fr)] lg:p-10">
            <div>
              <p className={cn(eyebrow, reveal)} data-reveal>
                {copy.process.eyebrow}
              </p>
              <h2
                className={cn(
                  reveal,
                  'mt-6 max-w-[14ch] text-[clamp(2rem,3.5vw,3.55rem)] font-medium leading-[1.02] tracking-[-0.045em]',
                )}
                data-reveal
              >
                {copy.process.title}
              </h2>
              <p
                className={cn(
                  reveal,
                  'mt-6 max-w-xl text-base leading-7 text-muted-foreground',
                )}
                data-reveal
              >
                {copy.process.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t border-border pt-5 font-mono text-sm text-muted-foreground">
                {copy.process.facts.map((fact) => (
                  <span key={fact}>+ {fact}</span>
                ))}
              </div>
            </div>

            <div className="relative min-h-64 overflow-hidden border border-border bg-surface sm:min-h-80">
              <div
                className="absolute inset-0 [transform:translate3d(0,var(--parallax-y,0px),0)] transition-transform duration-200 motion-reduce:transform-none"
                data-parallax="0.11"
              >
                <Image
                  src="/images/avatar.png"
                  alt="Codeissue workflow illustration"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-55 grayscale"
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,#000_0%,transparent_34%,transparent_70%,#000_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,#000_0%,transparent_28%,#000_100%)]" />
              <div className="absolute inset-x-5 bottom-5 grid grid-cols-4 border border-border bg-black/80 backdrop-blur-sm sm:inset-x-7 sm:bottom-7">
                {copy.process.steps.map((step, index) => (
                  <div
                    key={step.number}
                    className="border-r border-border p-3 last:border-r-0 sm:p-4"
                  >
                    <span className="font-mono text-sm text-signal">
                      0{index + 1}
                    </span>
                    <span className="mt-2 hidden text-sm text-muted-foreground sm:block">
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <ol className="grid lg:grid-cols-2">
            {copy.process.steps.map((step, index) => (
              <li
                key={step.number}
                className={cn(
                  reveal,
                  'group relative grid min-h-72 content-between gap-8 border-b border-border p-5 opacity-65 transition-[opacity,background-color] duration-500 last:border-b-0 [&.is-current]:bg-surface/70 [&.is-current]:opacity-100 sm:p-8 lg:border-r lg:[&:nth-child(2n)]:border-r-0 lg:[&:nth-last-child(-n+2)]:border-b-0 lg:p-10',
                )}
                data-reveal
                data-process-step
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="font-mono text-sm text-signal">
                    {step.number}
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">
                    {String(index + 1).padStart(2, '0')} / 04
                  </span>
                </div>

                <div>
                  <h3 className="max-w-[18ch] text-2xl font-medium leading-tight tracking-[-0.035em] sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                    {step.copy}
                  </p>
                </div>

                <div className="border-t border-border pt-5">
                  <span className="font-mono text-sm tracking-[0.08em] text-muted-foreground">
                    {copy.process.deliverablesLabel}
                  </span>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                    {step.deliverables.map((deliverable) => (
                      <span
                        key={deliverable}
                        className="text-sm text-foreground"
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
    </section>
  );
}
