import { ButtonLink } from "@/components/ui/button";

/** Shown for both a missing reference and an unavailable project. */
export default function OrderNotFound() {
  return (
    <div className="page-enter mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
      <p className="section-eyebrow">Not available</p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        This project is not available
      </h1>
      <p className="text-sm leading-relaxed text-ink-muted">
        Either the reference does not exist or it belongs to someone else. Check the
        reference from your project list and try again.
      </p>
      <ButtonLink href="/orders" size="sm" className="mt-2">
        Back to your projects
      </ButtonLink>
    </div>
  );
}
