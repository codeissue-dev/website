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

/** Chrome for every signed-in page. */
export function AppShell({ actor, children }: { actor: Actor; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="sticky top-0 z-30 border-b border-line/85 bg-surface/85 backdrop-blur-md">
        <Container className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3">
          <Link
            href="/"
            className="flex items-center rounded-md transition-opacity hover:opacity-75"
            aria-label="codeissue home"
          >
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
      <Container as="main" className="page-enter flex-1 py-6 sm:py-8">
        <div id="main-content">{children}</div>
      </Container>
    </div>
  );
}
