import { ArrowRightIcon, CheckIcon } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function IssueTicket({ copy }: { copy: Dictionary['hero']['ticket'] }) {
  return (
    <div className="issue-ticket" aria-label={copy.title}>
      <div className="issue-ticket__topline">
        <span className="issue-ticket__id">{copy.id}</span>
        <span className="issue-ticket__status">
          <i aria-hidden="true" />
          {copy.status}
        </span>
      </div>

      <h2>{copy.title}</h2>

      <div className="issue-ticket__io">
        <div>
          <span>{copy.inputLabel}</span>
          <strong>{copy.inputValue}</strong>
        </div>
        <ArrowRightIcon className="size-5" />
        <div>
          <span>{copy.outputLabel}</span>
          <strong>{copy.outputValue}</strong>
        </div>
      </div>

      <ol className="issue-ticket__stages">
        {copy.stages.map((stage, index) => (
          <li
            key={stage}
            className={cn(
              index === 0 && 'is-complete',
              index === 1 && 'is-current',
            )}
          >
            <span className="issue-ticket__stage-mark">
              {index === 0 ? <CheckIcon className="size-3.5" /> : index + 1}
            </span>
            <span>{stage}</span>
          </li>
        ))}
      </ol>

      <div className="issue-ticket__footer">
        <div>
          <span>{copy.ownerLabel}</span>
          <strong>{copy.ownerValue}</strong>
        </div>
        <div>
          <span>{copy.reviewLabel}</span>
          <strong>{copy.reviewValue}</strong>
        </div>
      </div>
    </div>
  );
}
