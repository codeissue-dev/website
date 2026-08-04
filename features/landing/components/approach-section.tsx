import type { Dictionary } from '@/lib/i18n';

import { SectionHeading } from './section-heading';

export function ApproachSection({ copy }: { copy: Dictionary }) {
  return (
    <section id="approach" className="approach-section section-pad">
      <div className="section-frame">
        <SectionHeading
          eyebrow={copy.approach.eyebrow}
          title={copy.approach.title}
          description={copy.approach.description}
        />

        <div className="principles-list">
          {copy.approach.principles.map((principle) => (
            <article
              key={principle.number}
              className="principle-row"
              data-reveal
            >
              <span className="principle-row__number">{principle.number}</span>
              <h3>{principle.title}</h3>
              <p>{principle.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
