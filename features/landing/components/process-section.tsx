import { CheckIcon } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';

import { SectionHeading } from './section-heading';

export function ProcessSection({ copy }: { copy: Dictionary }) {
  return (
    <section id="process" className="process-section section-pad">
      <div className="section-frame">
        <SectionHeading
          eyebrow={copy.process.eyebrow}
          title={copy.process.title}
          description={copy.process.description}
          aside={<span className="section-index">01—04</span>}
        />

        <ol className="process-list">
          {copy.process.steps.map((step) => (
            <li key={step.number} className="process-row" data-reveal>
              <span className="process-row__number">{step.number}</span>
              <div className="process-row__copy">
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
              <ul className="process-row__deliverables">
                {step.deliverables.map((item) => (
                  <li key={item}>
                    <CheckIcon className="size-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
