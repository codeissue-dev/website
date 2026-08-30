import Link from "next/link";

import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-xs tracking-wide text-ink-subtle uppercase">404</p>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        We could not find that page
      </h1>
      <p className="text-sm text-ink-muted">
        The link may be out of date, or the page may belong to a project you do not have
        access to.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonClass({ size: "sm" })}>
          Go to the home page
        </Link>
        <Link
          href="/dashboard"
          className={buttonClass({ variant: "secondary", size: "sm" })}
        >
          Go to your dashboard
        </Link>
      </div>
    </div>
  );
}
