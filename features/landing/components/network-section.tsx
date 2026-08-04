import type { Dictionary } from '@/lib/i18n';
import { socials } from '@/lib/site-data';
import { pageFrame, sectionSpacing } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { SectionHeading } from './section-heading';
import { SocialCard } from './social-card';

export function NetworkSection({ copy }: { copy: Dictionary }) {
  return (
    <section id="network" className={cn(sectionSpacing, 'bg-surface-quiet')}>
      <div className={pageFrame}>
        <SectionHeading
          eyebrow={copy.network.eyebrow}
          title={copy.network.title}
          description={copy.network.description}
          aside={
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-signal">
              10 active destinations
            </span>
          }
        />

        <div className="mt-14 grid border-t border-l border-border sm:grid-cols-2 lg:mt-20 lg:grid-cols-5">
          {socials.map((social, index) => (
            <SocialCard
              key={social.id}
              social={social}
              copy={copy.network}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
