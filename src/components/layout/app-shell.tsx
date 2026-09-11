import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/ui/section";
import type { Actor } from "@/lib/auth/actor";

/**
 * Chrome for every signed-in page.
 *
 * The header is the same component the public site uses, with workspace
 * navigation: one bar, one set of controls, one ecosystem.
 */
export function AppShell({ actor, children }: { actor: Actor; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <SiteHeader actor={actor} variant="workspace" />
      <Container as="main" id="main-content" className="page-enter flex-1 py-8">
        {children}
      </Container>
    </div>
  );
}
