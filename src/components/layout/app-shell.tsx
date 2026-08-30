import Link from "next/link";
import type { ReactNode } from "react";

import { signOutAction } from "@/actions/auth";
import { Wordmark } from "@/components/brand/wordmark";
import { AppNav, type NavItem } from "@/components/layout/app-nav";
import { buttonClass } from "@/components/ui/button";
import { RoleBadge } from "@/components/ui/status-badge";
import type { Actor } from "@/lib/auth/actor";
import { displayName } from "@/lib/utils";

function navItemsFor(actor: Actor): NavItem[] {
  const shared: NavItem[] = [{ href: "/dashboard", label: "Dashboard" }];

  if (actor.role === "ADMIN") {
    return [
      { href: "/admin", label: "Overview" },
      { href: "/admin/orders", label: "Projects" },
      { href: "/admin/users", label: "People" },
      { href: "/admin/portfolio", label: "Portfolio" },
      { href: "/admin/testimonials", label: "Testimonials" },
      { href: "/account", label: "Account" },
    ];
  }

  if (actor.role === "EXECUTOR") {
    return [
      ...shared,
      { href: "/orders", label: "Assigned work" },
      { href: "/account", label: "Account" },
    ];
  }

  return [
    ...shared,
    { href: "/orders", label: "My projects" },
    { href: "/orders/new", label: "New request" },
    { href: "/account", label: "Account" },
  ];
}

/**
 * Chrome for every signed-in page.
 *
 * The navigation is derived from the session role, and each destination is a
 * route that exists. Visibility is convenience only: every page and action
 * checks permissions again on the server.
 */
export function AppShell({ actor, children }: { actor: Actor; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center" aria-label="codeissue home">
            <Wordmark size="sm" />
          </Link>

          <div className="order-3 w-full sm:order-2 sm:w-auto">
            <AppNav items={navItemsFor(actor)} />
          </div>

          <div className="order-2 ml-auto flex items-center gap-3 sm:order-3">
            <span className="hidden text-sm text-ink-muted sm:inline">
              {displayName(actor.name, actor.email)}
            </span>
            <RoleBadge role={actor.role} />
            <form action={signOutAction}>
              <button
                type="submit"
                className={buttonClass({ variant: "secondary", size: "sm" })}
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
