import { CheckIcon } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';

export function ProcessPanel({
  copy,
  active,
}: {
  copy: Dictionary['process'];
  active: number;
}) {
  const step = copy.steps[active] ?? copy.steps[0];

  return (
    <div className="process-panel" key={active}>
      <div className="process-panel__topline">
        <span>{copy.currentLabel}</span>
        <span className="process-panel__status">
          <i aria-hidden="true" />
          {copy.status}
        </span>
      </div>

      <div className="process-panel__number">{step.number}</div>
      <h3>{step.title}</h3>
      <p>{step.copy}</p>

      <div className="process-panel__deliverables">
        <span>{copy.deliverablesLabel}</span>
        <ul>
          {step.deliverables.map((item) => (
            <li key={item}>
              <CheckIcon className="size-4" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="process-panel__progress" aria-hidden="true">
        {copy.steps.map((item, index) => (
          <span
            key={item.number}
            className={index <= active ? 'is-active' : ''}
          />
        ))}
      </div>
    </div>
  );
}
