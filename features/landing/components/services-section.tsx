import { ArrowUpRightIcon } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';

import { SectionHeading } from './section-heading';

export function ServicesSection({ copy }: { copy: Dictionary }) {
  return (
    <section className="services-section section-pad">
      <div className="section-frame">
        <SectionHeading
          eyebrow={copy.services.eyebrow}
          title={copy.services.title}
          description={copy.services.description}
        />

        <div className="services-index">
          {copy.services.items.map((item) => (
            <article key={item.number} className="service-row" data-reveal>
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <ArrowUpRightIcon className="size-5" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
