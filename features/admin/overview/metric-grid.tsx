export type MetricItem = {
  code: string;
  label: string;
  value: number;
};

export function MetricGrid({
  items,
  label,
}: {
  items: MetricItem[];
  label: string;
}) {
  return (
    <section
      className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      aria-label={label}
    >
      {items.map((metric, index) => (
        <article
          key={metric.code}
          className="rounded-xl border border-border bg-card p-5 shadow-[0_1px_0_rgba(255,255,255,0.035)_inset]"
        >
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{metric.code}</span>
            <span className="font-mono">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <strong className="mt-7 block text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
            {metric.value.toString().padStart(2, '0')}
          </strong>
          <p className="mt-2 text-sm leading-5 text-muted-foreground">
            {metric.label}
          </p>
        </article>
      ))}
    </section>
  );
}
