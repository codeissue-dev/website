import { useTranslations } from "next-intl";
import Link from "next/link";

import { Wordmark } from "@/components/brand/wordmark";
import { ButtonLink } from "@/components/ui/button";
import { ChevronDownIcon } from "@/components/ui/icon";
import { Container } from "@/components/ui/section";
import { LocaleSwitch } from "@/components/layout/locale-switch";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  headerActions,
  PUBLIC_SECTION_LINKS,
  type HeaderAction,
} from "@/content/navigation";
import type { Actor } from "@/lib/auth/actor";

function ActionButton({ action, label }: { action: HeaderAction; label: string }) {
  return (
    <ButtonLink
      href={action.href}
      size="sm"
      variant={action.emphasis === "strong" ? "primary" : "ghost"}
    >
      {label}
    </ButtonLink>
  );
}

/**
 * Public header.
 *
 * Same bar, height and link treatment as the signed-in workspace. Links and
 * actions come from the navigation module, labels from the intl dictionary,
 * and the mobile menu is a `details` element: it works before any JavaScript.
 */
export function SiteHeader({ actor }: { actor: Actor | null }) {
  const t = useTranslations("Header");
  const actions = headerActions(actor !== null);

  return (
    <header className="site-bar">
      <Container className="flex h-14 items-center gap-4">
        <Link href="/" className="flex items-center" aria-label={t("home")}>
          <Wordmark size="sm" />
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-0.5">
            {PUBLIC_SECTION_LINKS.map((section) => (
              <li key={section.href}>
                <Link href={section.href} className="nav-link">
                  {t(section.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <div className="pref-cluster">
            <LocaleSwitch />
            <ThemeToggle />
          </div>
          {actions.map((action) => (
            <ActionButton
              key={action.href}
              action={action}
              label={t(action.labelKey)}
            />
          ))}
        </div>
        <details className="relative ml-auto md:hidden">
          <summary className="menu-trigger">
            {t("menu")}
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
                    {t(section.labelKey)}
                  </Link>
                </li>
              ))}
              <li aria-hidden="true" className="my-1.5 border-t border-line" />
              {actions.map((action) => (
                <li key={action.href}>
                  <Link href={action.href} className="menu-link">
                    {t(action.labelKey)}
                  </Link>
                </li>
              ))}
              <li aria-hidden="true" className="my-1.5 border-t border-line" />
              <li className="flex items-center justify-between gap-2 px-1 py-1">
                <LocaleSwitch />
                <ThemeToggle />
              </li>
            </ul>
          </nav>
        </details>
      </Container>
    </header>
  );
}
