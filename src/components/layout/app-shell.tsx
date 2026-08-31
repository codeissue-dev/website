import Link from "next/link";
import type { ReactNode } from "react";

import { signOutAction } from "@/actions/auth";
import { Wordmark } from "@/components/brand/wordmark";
import { AppNav } from "@/components/layout/app-nav";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/section";
import { RoleBadge } from "@/components/ui/status-badge";
import { workspaceNavLinks } from "@/content/navigation";
import type { Actor } from "@/lib/auth/actor";
import { displayName } from "@/lib/utils";

/**
 * Chrome for every signed-in page.
 *
 * It is the public header with a different set of links: same bar, same height,
 * same wordmark and the same link treatment, so moving between the site and the
 * workspace does not feel like moving between two products.
 */
export function AppShell({ actor, children }: { actor: Actor; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="site-bar">
        <Container className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3 sm:h-14 sm:flex-nowrap sm:py-0">
          <Link href="/" className="flex items-center" aria-label="codeissue home">
            <Wordmark size="sm" />
          </Link>
          <div className="order-3 w-full sm:order-2 sm:w-auto">
            <AppNav items={workspaceNavLinks(actor.role)} />
          </div>
          <div className="order-2 ml-auto flex items-center gap-3 sm:order-3">
            <span className="hidden text-sm text-ink-muted sm:inline">
              {displayName(actor.name, actor.email)}
            </span>
            <RoleBadge role={actor.role} />
            <form action={signOutAction}>
              <Button type="submit" variant="secondary" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </Container>
      </header>
      <Container as="main" id="main-content" className="page-enter flex-1 py-8">
        {children}
      </Container>
    </div>
  );
}
