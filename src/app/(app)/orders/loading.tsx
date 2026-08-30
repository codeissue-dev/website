export default function OrdersLoading() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-4">
      <span className="sr-only">Loading projects</span>
      <div className="h-8 w-48 animate-pulse rounded bg-surface-muted motion-reduce:animate-none" />
      <div className="h-16 animate-pulse rounded-panel bg-surface-muted motion-reduce:animate-none" />
      <div className="flex flex-col gap-px overflow-hidden rounded-panel bg-line">
        {[0, 1, 2, 3, 4].map((row) => (
          <div
            key={row}
            className="h-24 animate-pulse bg-surface-muted motion-reduce:animate-none"
          />
        ))}
      </div>
    </div>
  );
}
