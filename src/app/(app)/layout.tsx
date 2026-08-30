import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { requireActorForPage } from "@/lib/auth/actor";

/**
 * Everything in this group is per-user data.
 *
 * `force-dynamic` guarantees no response is ever reused across users, and the
 * layout re-establishes the session for each request instead of trusting the
 * client.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AppLayout({ children }: { children: ReactNode }) {
  const actor = await requireActorForPage();

  return <AppShell actor={actor}>{children}</AppShell>;
}
