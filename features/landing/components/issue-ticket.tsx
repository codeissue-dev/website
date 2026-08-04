import { ArrowRightIcon, CheckIcon } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n';

export function IssueTicket({ copy }: { copy: Dictionary['hero']['ticket'] }) {
  return (
    <aside className="issue-ticket" aria-label={copy.title} data-reveal>
      <header className="issue-ticket__topline">
        <span className="issue-ticket__id">{copy.id}</span>
        <span className="issue-ticket__status">
          <i aria-hidden="true" />
          {copy.status}
        </span>
      </header>

      <div className="issue-ticket__statement">
        <span>Brief</span>
        <h2>{copy.title}</h2>
      </div>

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
          <li key={stage}>
            <span className="issue-ticket__stage-mark">
              {index === 0 ? <CheckIcon className="size-3.5" /> : index + 1}
            </span>
            <span>{stage}</span>
          </li>
        ))}
      </ol>

      <footer className="issue-ticket__footer">
        <div>
          <span>{copy.ownerLabel}</span>
          <strong>{copy.ownerValue}</strong>
        </div>
        <div>
          <span>{copy.reviewLabel}</span>
          <strong>{copy.reviewValue}</strong>
        </div>
      </footer>
    </aside>
  );
}
