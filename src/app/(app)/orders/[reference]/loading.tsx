export default function OrderDetailLoading() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-4">
      <span className="sr-only">Loading project</span>
      <div className="h-4 w-32 animate-pulse rounded bg-surface-muted motion-reduce:animate-none" />
      <div className="h-9 w-full max-w-md animate-pulse rounded bg-surface-muted motion-reduce:animate-none" />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-4">
          <div className="h-64 animate-pulse rounded-panel bg-surface-muted motion-reduce:animate-none" />
          <div className="h-80 animate-pulse rounded-panel bg-surface-muted motion-reduce:animate-none" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-40 animate-pulse rounded-panel bg-surface-muted motion-reduce:animate-none" />
          <div className="h-56 animate-pulse rounded-panel bg-surface-muted motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  );
}
