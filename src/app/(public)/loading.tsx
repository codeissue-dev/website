import { Container } from "@/components/ui/section";

/** Skeleton with the same measure and rhythm as the page it stands in for. */
export default function PublicLoading() {
  return (
    <Container className="py-16 sm:py-20">
      <div role="status" aria-live="polite">
        <span className="sr-only">Loading</span>
        <div className="h-3 w-40 animate-pulse rounded-control bg-surface-muted motion-reduce:animate-none" />
        <div className="mt-6 h-9 w-full max-w-2xl animate-pulse rounded-control bg-surface-muted motion-reduce:animate-none" />
        <div className="mt-3 h-9 w-full max-w-xl animate-pulse rounded-control bg-surface-muted motion-reduce:animate-none" />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="h-24 animate-pulse rounded-panel bg-surface-muted motion-reduce:animate-none" />
          <div className="h-24 animate-pulse rounded-panel bg-surface-muted motion-reduce:animate-none" />
          <div className="h-24 animate-pulse rounded-panel bg-surface-muted motion-reduce:animate-none" />
        </div>
      </div>
    </Container>
  );
}
