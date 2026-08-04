import type { Dictionary } from '@/lib/i18n';

export function IssueCreatedNotice({
  created,
  copy,
}: {
  created?: string;
  copy: Dictionary['newIssue'];
}) {
  if (!created) return null;

  return (
    <div className="mb-8 rounded-lg border border-positive/30 bg-positive/10 p-5">
      <p className="font-mono text-sm text-positive">{copy.successLabel}</p>
      <h2 className="mt-2 text-xl font-semibold">{copy.successTitle}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {copy.successDescription}
      </p>
      <code className="mt-4 block font-mono text-sm text-signal-soft">
        {created}
      </code>
    </div>
  );
}
