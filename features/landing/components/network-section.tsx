import type { Dictionary } from '@/lib/i18n';
import { socials } from '@/lib/site-data';

import { SectionHeading } from './section-heading';
import { SocialCard } from './social-card';

export function NetworkSection({ copy }: { copy: Dictionary }) {
  return (
    <section id="network" className="network-section section-pad">
      <div className="section-frame">
        <SectionHeading
          eyebrow={copy.network.eyebrow}
          title={copy.network.title}
          description={copy.network.description}
        />

        <div className="social-directory">
          {socials.map((social) => (
            <SocialCard key={social.id} social={social} copy={copy.network} />
          ))}
        </div>
      </div>
    </section>
  );
}
