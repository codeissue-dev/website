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
            <span className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground">
              <i className="size-1.5 rounded-full bg-positive" />
              {copy.network.channelsLabel}
            </span>
          }
        />

        <div className="mt-14 grid gap-2 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 xl:grid-cols-5">
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
