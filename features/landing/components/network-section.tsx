import type { Dictionary } from '@/lib/i18n';
import { socials } from '@/lib/site-data';
import { pageFrame, sectionSpacing } from '@/lib/ui/styles';
import { cn } from '@/lib/utils';

import { SectionHeading } from './section-heading';
import { SocialCard } from './social-card';

export function NetworkSection({ copy }: { copy: Dictionary }) {
  return (
    <section id="network" className={cn(sectionSpacing, 'bg-black')}>
      <div className={pageFrame}>
        <SectionHeading
          eyebrow={copy.network.eyebrow}
          title={copy.network.title}
          description={copy.network.description}
          aside={
            <span className="font-mono text-[0.6rem] tracking-[0.1em] text-signal">
              {copy.network.channelsLabel}
            </span>
          }
        />

        <div className="mt-14 grid border-t border-border lg:mt-16 lg:grid-cols-2 lg:gap-x-10">
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
