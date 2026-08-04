import type { CSSProperties } from 'react';

import { Card } from '@/components/ui/card';
import type { Dictionary } from '@/lib/i18n';

export function ApproachSection({ copy }: { copy: Dictionary }) {
  return (
    <section id="approach" className="approach-section section-pad">
      <div className="section-frame">
        <div className="approach-intro">
          <div>
            <p className="eyebrow" data-reveal>
              {copy.approach.eyebrow}
            </p>
            <h2 data-reveal>{copy.approach.title}</h2>
          </div>
          <p className="approach-intro__description" data-reveal>
            {copy.approach.description}
          </p>
        </div>

        <div className="principles-grid">
          {copy.approach.principles.map((principle, index) => (
            <Card
              key={principle.number}
              className="principle-card"
              data-reveal
              style={{ '--reveal-delay': `${index * 80}ms` } as CSSProperties}
            >
              <span className="principle-card__number">{principle.number}</span>
              <div>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
