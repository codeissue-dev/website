import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getActor } from "@/lib/auth/actor";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  // Only used to decide which header actions to show; every protected page and
  // action re-checks the session itself.
  const actor = await getActor();

  return (
    <div className="public-shell flex min-h-dvh flex-col">
      <div aria-hidden="true" className="public-star-layer" />
      <SiteHeader actor={actor} />
      <main id="main-content" className="relative z-10 flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
