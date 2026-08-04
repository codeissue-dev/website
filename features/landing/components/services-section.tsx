import type { CSSProperties } from 'react';

import type { Dictionary } from '@/lib/i18n';

export function ServicesSection({ copy }: { copy: Dictionary }) {
  return (
    <section className="services-section section-pad">
      <div className="section-frame">
        <div className="section-heading services-heading">
          <div>
            <p className="eyebrow" data-reveal>
              {copy.services.eyebrow}
            </p>
            <h2 data-reveal>{copy.services.title}</h2>
          </div>
          <p data-reveal>{copy.services.description}</p>
        </div>

        <div className="services-grid">
          {copy.services.items.map((item, index) => (
            <article
              key={item.number}
              className="service-card"
              data-reveal
              style={{ '--reveal-delay': `${index * 70}ms` } as CSSProperties}
            >
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <div className="service-card__line" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
