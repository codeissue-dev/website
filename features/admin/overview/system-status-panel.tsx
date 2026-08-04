import { Panel, PanelHeader } from '@/components/ui/panel';

export type SystemStatusItem = {
  label: string;
  value: string;
  tone: 'positive' | 'warning';
};

export function SystemStatusPanel({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: SystemStatusItem[];
}) {
  return (
    <Panel>
      <PanelHeader eyebrow={eyebrow} title={title} />
      <div className="divide-y divide-border">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm sm:px-6"
          >
            <span className="inline-flex items-center gap-2.5">
              <i
                className={
                  item.tone === 'positive'
                    ? 'size-1.5 rounded-full bg-positive'
                    : 'size-1.5 rounded-full bg-warning'
                }
              />
              {item.label}
            </span>
            <strong className="text-sm font-medium text-muted-foreground">
              {item.value}
            </strong>
          </div>
        ))}
      </div>
    </Panel>
  );
}
