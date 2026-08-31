import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getActor } from "@/lib/auth/actor";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  // Only used to decide which header actions to show; every protected page and
  // action re-checks the session itself.
  const actor = await getActor();

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <SiteHeader actor={actor} />
      <main id="main-content" className="page-enter flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
