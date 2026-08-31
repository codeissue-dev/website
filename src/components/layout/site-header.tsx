import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { ButtonLink } from "@/components/ui/button";
import {
  headerActions,
  PUBLIC_SECTION_LINKS,
  type HeaderAction,
} from "@/content/navigation";
import type { Actor } from "@/lib/auth/actor";

function ActionButton({ action }: { action: HeaderAction }) {
  return (
    <ButtonLink
      href={action.href}
      size="sm"
      variant={action.emphasis === "strong" ? "primary" : "ghost"}
    >
      {action.label}
    </ButtonLink>
  );
}

/**
 * Public header.
 *
 * The links and actions come from the navigation module, so the desktop bar and
 * the mobile disclosure can never drift apart. The mobile menu is a `details`
 * element: it works before any JavaScript loads.
 */
export function SiteHeader({ actor }: { actor: Actor | null }) {
  const actions = headerActions(actor !== null);

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
            {PUBLIC_SECTION_LINKS.map((section) => (
              <li key={section.href}>
                <Link href={section.href} className="public-nav-link">
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto hidden items-center gap-1.5 md:flex">
          {actions.map((action) => (
            <ActionButton key={action.href} action={action} />
          ))}
        </div>
        <details className="group relative ml-auto md:hidden">
          <summary className="public-menu-trigger" aria-label="Open menu">
            Menu
          </summary>
          <nav
            aria-label="Main"
            className="public-mobile-menu absolute right-0 z-50 mt-2 w-60 p-2"
          >
            <ul className="flex flex-col">
              {PUBLIC_SECTION_LINKS.map((section) => (
                <li key={section.href}>
                  <Link href={section.href} className="public-mobile-link">
                    {section.label}
                  </Link>
                </li>
              ))}
              <li aria-hidden="true" className="my-1 border-t border-line" />
              {actions.map((action) => (
                <li key={action.href}>
                  <Link href={action.href} className="public-mobile-link">
                    {action.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
