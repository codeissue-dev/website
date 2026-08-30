import Link from "next/link";

import { buttonClass } from "@/components/ui/button";

/**
 * Shown both for a reference that does not exist and for one the signed-in user
 * is not allowed to see. The wording is identical on purpose: a visitor must not
 * be able to tell the two apart.
 */
export default function OrderNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
      <p className="font-mono text-xs tracking-wide text-ink-subtle uppercase">
        Not available
      </p>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        This project is not available
      </h1>
      <p className="text-sm text-ink-muted">
        Either the reference does not exist or it belongs to someone else. Check the
        reference from your project list and try again.
      </p>
      <Link href="/orders" className={buttonClass({ size: "sm", className: "mt-2" })}>
        Back to your projects
      </Link>
    </div>
  );
}
