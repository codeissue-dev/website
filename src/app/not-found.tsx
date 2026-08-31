import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="page-enter mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="section-eyebrow">404</p>
      <h1 className="section-title">We could not find that page</h1>
      <p className="max-w-lg text-sm leading-relaxed text-ink-muted">
        The link may be out of date, or the page may belong to a project you do not have
        access to.
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" size="sm">
          Go to the home page
        </ButtonLink>
        <ButtonLink href="/dashboard" variant="secondary" size="sm">
          Go to your dashboard
        </ButtonLink>
      </div>
    </div>
  );
}
