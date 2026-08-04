import type { Dictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

import { ProcessPanel } from './process-panel';

export function ProcessSection({
  copy,
  activeProcess,
}: {
  copy: Dictionary;
  activeProcess: number;
}) {
  return (
    <section id="process" className="process-section section-pad">
      <div className="section-frame process-grid">
        <div className="process-copy">
          <p className="eyebrow" data-reveal>
            {copy.process.eyebrow}
          </p>
          <h2 data-reveal>{copy.process.title}</h2>
          <p className="process-copy__intro" data-reveal>
            {copy.process.description}
          </p>

          <div className="process-steps">
            {copy.process.steps.map((step, index) => (
              <article
                key={step.number}
                className={cn(
                  'process-step',
                  activeProcess === index && 'is-active',
                )}
                data-process-step
                data-step={index}
              >
                <span>{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="process-sticky" data-reveal>
          <ProcessPanel copy={copy.process} active={activeProcess} />
        </div>
      </div>
    </section>
  );
}
