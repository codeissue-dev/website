import {
  ArrowUpRightIcon,
  DatabaseIcon,
  LayersIcon,
  SparkIcon,
  TerminalIcon,
} from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';
import { pageFrame, reveal, sectionSpacing } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { SectionHeading } from './section-heading';

const icons = [LayersIcon, TerminalIcon, SparkIcon, DatabaseIcon] as const;

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
          {copy.services.items.map((item, index) => {
            const Icon = icons[index] ?? LayersIcon;
            return (
              <article
                key={item.number}
                className={cn(
                  reveal,
                  'group relative min-h-64 overflow-hidden rounded-xl border border-border bg-card p-6 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-1 hover:border-border-strong hover:bg-surface-soft sm:p-8',
                )}
                data-reveal
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-10 place-items-center rounded-lg border border-border bg-black text-muted-foreground transition-colors group-hover:border-signal/40 group-hover:text-signal-soft">
                    <Icon className="size-5" />
                  </span>
                  <ArrowUpRightIcon className="size-4 text-muted-foreground transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </div>
                <div className="mt-14">
                  <span className="font-mono text-sm text-signal-soft">
                    {item.number}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold tracking-[-0.035em] sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
                    {item.copy}
                  </p>
                </div>
                <div
                  className="pointer-events-none absolute -bottom-20 -right-16 size-48 rounded-full bg-signal/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
