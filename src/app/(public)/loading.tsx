export default function PublicLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6"
    >
      <span className="sr-only">Loading</span>
      <div className="h-3 w-40 animate-pulse rounded bg-surface-muted motion-reduce:animate-none" />
      <div className="mt-6 h-10 w-full max-w-2xl animate-pulse rounded bg-surface-muted motion-reduce:animate-none" />
      <div className="mt-3 h-10 w-full max-w-xl animate-pulse rounded bg-surface-muted motion-reduce:animate-none" />
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="h-24 animate-pulse rounded-panel bg-surface-muted motion-reduce:animate-none" />
        <div className="h-24 animate-pulse rounded-panel bg-surface-muted motion-reduce:animate-none" />
        <div className="h-24 animate-pulse rounded-panel bg-surface-muted motion-reduce:animate-none" />
      </div>
    </div>
  );
}
