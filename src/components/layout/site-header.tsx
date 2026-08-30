import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { buttonClass } from "@/components/ui/button";
import type { Actor } from "@/lib/auth/actor";

const SECTIONS: Array<{ href: string; label: string }> = [
  { href: "/#capabilities", label: "Capabilities" },
  { href: "/#process", label: "Process" },
  { href: "/work", label: "Work" },
  { href: "/#faq", label: "FAQ" },
];

/**
 * Public header.
 *
 * The mobile menu is a native `<details>` disclosure, so navigation works
 * before (and without) any client JavaScript.
 */
export function SiteHeader({ actor }: { actor: Actor | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center rounded-md"
          aria-label="codeissue home"
        >
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {SECTIONS.map((section) => (
              <li key={section.href}>
                <Link
                  href={section.href}
                  className="inline-flex h-8 items-center rounded-md px-2.5 text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {actor ? (
            <>
              <Link
                href="/dashboard"
                className={buttonClass({ variant: "ghost", size: "sm" })}
              >
                Dashboard
              </Link>
              <Link href="/orders/new" className={buttonClass({ size: "sm" })}>
                Start a project
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={buttonClass({ variant: "ghost", size: "sm" })}
              >
                Sign in
              </Link>
              <Link href="/register" className={buttonClass({ size: "sm" })}>
                Start a project
              </Link>
            </>
          )}
        </div>

        <details className="group relative ml-auto md:hidden">
          <summary
            className="inline-flex h-9 cursor-pointer list-none items-center rounded-md border border-line px-3 text-sm text-ink"
            aria-label="Open menu"
          >
            Menu
          </summary>
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-panel border border-line bg-surface p-2 shadow-lg">
            <ul className="flex flex-col">
              {SECTIONS.map((section) => (
                <li key={section.href}>
                  <Link
                    href={section.href}
                    className="block rounded-md px-2.5 py-2 text-sm text-ink-muted hover:bg-surface-muted hover:text-ink"
                  >
                    {section.label}
                  </Link>
                </li>
              ))}
              <li aria-hidden="true" className="my-1 border-t border-line" />
              {actor ? (
                <>
                  <li>
                    <Link
                      href="/dashboard"
                      className="block rounded-md px-2.5 py-2 text-sm text-ink hover:bg-surface-muted"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/orders/new"
                      className="block rounded-md px-2.5 py-2 text-sm text-ink hover:bg-surface-muted"
                    >
                      Start a project
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/sign-in"
                      className="block rounded-md px-2.5 py-2 text-sm text-ink hover:bg-surface-muted"
                    >
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="block rounded-md px-2.5 py-2 text-sm text-ink hover:bg-surface-muted"
                    >
                      Create an account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </details>
      </div>
    </header>
  );
}
