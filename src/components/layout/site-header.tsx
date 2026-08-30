import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { ButtonLink } from "@/components/ui/button";
import type { Actor } from "@/lib/auth/actor";

const SECTIONS: Array<{ href: string; label: string }> = [
  { href: "/#capabilities", label: "What we build" },
  { href: "/#process", label: "How it works" },
  { href: "/#work", label: "Public projects" },
  { href: "/#testimonials", label: "Reviews" },
];

/** Public header with a no-JavaScript mobile disclosure. */
export function SiteHeader({ actor }: { actor: Actor | null }) {
  return (
    <header className="public-header sticky top-0 z-40 px-3 pt-3 sm:px-6">
      <div className="public-header-bar mx-auto flex h-12 w-full max-w-6xl items-center gap-3 px-3 sm:px-4">
        <Link
          href="/"
          className="flex items-center rounded-md transition-opacity hover:opacity-75"
          aria-label="codeissue home"
        >
          <Wordmark size="sm" />
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-0.5">
            {SECTIONS.map((section) => (
              <li key={section.href}>
                <Link href={section.href} className="public-nav-link">
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto hidden items-center gap-1.5 md:flex">
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
          <summary className="public-menu-trigger" aria-label="Open menu">
            Menu
          </summary>
          <div className="public-mobile-menu absolute right-0 z-50 mt-2 w-60 p-2">
            <ul className="flex flex-col">
              {SECTIONS.map((section) => (
                <li key={section.href}>
                  <Link href={section.href} className="public-mobile-link">
                    {section.label}
                  </Link>
                </li>
              ))}
              <li aria-hidden="true" className="my-1 border-t border-line" />
              {actor ? (
                <>
                  <li>
                    <Link href="/dashboard" className="public-mobile-link">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/orders/new" className="public-mobile-link">
                      Start a project
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/sign-in" className="public-mobile-link">
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="public-mobile-link">
                      Start a project
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
