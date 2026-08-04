import type { CSSProperties } from 'react';

import type { Dictionary } from '@/lib/i18n';
import { socials } from '@/lib/site-data';

import { SocialCard } from './social-card';

export function NetworkSection({ copy }: { copy: Dictionary }) {
  return (
    <section id="network" className="network-section section-pad">
      <div className="section-frame">
        <div className="section-heading network-heading">
          <div>
            <p className="eyebrow" data-reveal>
              {copy.network.eyebrow}
            </p>
            <h2 data-reveal>{copy.network.title}</h2>
          </div>
          <p data-reveal>{copy.network.description}</p>
        </div>

        <div className="social-grid">
          {socials.map((social, index) => (
            <div
              key={social.id}
              data-reveal
              style={
                {
                  '--reveal-delay': `${(index % 4) * 70}ms`,
                } as CSSProperties
              }
            >
              <SocialCard social={social} copy={copy.network} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
