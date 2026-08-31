import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { ButtonLink } from "@/components/ui/button";
import { ChevronDownIcon } from "@/components/ui/icon";
import { Container } from "@/components/ui/section";
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
 * Same bar, height and link treatment as the signed-in workspace. Links and
 * actions come from the navigation module, so the desktop row and the mobile
 * disclosure cannot drift apart, and the mobile menu is a `details` element:
 * it works before any JavaScript loads.
 */
export function SiteHeader({ actor }: { actor: Actor | null }) {
  const actions = headerActions(actor !== null);

  return (
    <header className="site-bar">
      <Container className="flex h-14 items-center gap-4">
        <Link href="/" className="flex items-center" aria-label="codeissue home">
          <Wordmark size="sm" />
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-0.5">
            {PUBLIC_SECTION_LINKS.map((section) => (
              <li key={section.href}>
                <Link href={section.href} className="nav-link">
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          {actions.map((action) => (
            <ActionButton key={action.href} action={action} />
          ))}
        </div>
        <details className="relative ml-auto md:hidden">
          <summary className="menu-trigger">
            Menu
            <ChevronDownIcon className="ml-1.5" />
          </summary>
          <nav
            aria-label="Main"
            className="menu-panel absolute right-0 z-50 mt-2 w-60 p-1.5"
          >
            <ul className="flex flex-col">
              {PUBLIC_SECTION_LINKS.map((section) => (
                <li key={section.href}>
                  <Link href={section.href} className="menu-link">
                    {section.label}
                  </Link>
                </li>
              ))}
              <li aria-hidden="true" className="my-1.5 border-t border-line" />
              {actions.map((action) => (
                <li key={action.href}>
                  <Link href={action.href} className="menu-link">
                    {action.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </Container>
    </header>
  );
}
