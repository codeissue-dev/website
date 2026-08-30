import Link from "next/link";

import { buttonClass } from "@/components/ui/button";

export function Cta() {
  return (
    <section aria-labelledby="cta-heading" className="relative overflow-hidden">
      <div aria-hidden="true" className="grid-backdrop absolute inset-0" />
      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-2xl">
          <h2
            id="cta-heading"
            className="text-2xl font-semibold tracking-tight text-balance text-ink sm:text-3xl"
          >
            Write the brief while the problem is still fresh
          </h2>
          <p className="mt-3 text-ink-muted">
            Creating an account takes a moment, and the request form is the same one our
            engineers read. You will have a project page, a reference and a place to
            talk to us before the day is out.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/register" className={buttonClass({ size: "lg" })}>
              Create an account
            </Link>
            <Link
              href="/sign-in"
              className={buttonClass({ variant: "secondary", size: "lg" })}
            >
              I already have one
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
