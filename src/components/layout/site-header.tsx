import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { ButtonLink } from "@/components/ui/button";
import type { Actor } from "@/lib/auth/actor";

const SECTIONS: Array<{ href: string; label: string }> = [
  { href: "/#capabilities", label: "Capabilities" },
  { href: "/#process", label: "Process" },
  { href: "/work", label: "Work" },
  { href: "/#faq", label: "FAQ" },
];

/** Public header with a no-JavaScript mobile disclosure. */
export function SiteHeader({ actor }: { actor: Actor | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line/85 bg-canvas/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center rounded-md transition-opacity hover:opacity-75"
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
                  className="inline-flex h-9 items-center rounded-lg px-2.5 text-sm text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
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
              <ButtonLink href="/dashboard" variant="ghost" size="sm">
                Dashboard
              </ButtonLink>
              <ButtonLink href="/orders/new" size="sm">
                Start a project
              </ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink href="/sign-in" variant="ghost" size="sm">
                Sign in
              </ButtonLink>
              <ButtonLink href="/register" size="sm">
                Start a project
              </ButtonLink>
            </>
          )}
        </div>
        <details className="group relative ml-auto md:hidden">
          <summary
            className="inline-flex h-9 cursor-pointer list-none items-center rounded-lg border border-line bg-surface px-3 text-sm font-medium text-ink shadow-sm transition-colors hover:bg-surface-muted"
            aria-label="Open menu"
          >
            Menu
          </summary>
          <div className="absolute right-0 z-50 mt-2 w-56 rounded-panel border border-line bg-surface p-2 shadow-[0_16px_32px_rgb(16_24_40/0.12)]">
            <ul className="flex flex-col">
              {SECTIONS.map((section) => (
                <li key={section.href}>
                  <Link
                    href={section.href}
                    className="block rounded-lg px-2.5 py-2 text-sm text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink"
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
                      className="block rounded-lg px-2.5 py-2 text-sm text-ink transition-colors hover:bg-surface-muted"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/orders/new"
                      className="block rounded-lg px-2.5 py-2 text-sm text-ink transition-colors hover:bg-surface-muted"
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
                      className="block rounded-lg px-2.5 py-2 text-sm text-ink transition-colors hover:bg-surface-muted"
                    >
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="block rounded-lg px-2.5 py-2 text-sm text-ink transition-colors hover:bg-surface-muted"
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
