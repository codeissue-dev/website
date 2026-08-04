export type EndpointItem = {
  type: string;
  label: string;
  endpoint: string;
};

export function EndpointGrid({ items }: { items: EndpointItem[] }) {
  return (
    <section className="mt-8 grid gap-3 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.type}
          className="rounded-xl border border-border bg-card p-5 shadow-[0_1px_0_rgba(255,255,255,0.035)_inset]"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm text-signal-soft">
              {item.type}
            </span>
            <i className="size-1.5 rounded-full bg-positive" />
          </div>
          <strong className="mt-5 block text-sm font-medium">
            {item.label}
          </strong>
          <code className="mt-2 block truncate font-mono text-sm text-muted-foreground">
            {item.endpoint}
          </code>
        </article>
      ))}
    </section>
  );
}
