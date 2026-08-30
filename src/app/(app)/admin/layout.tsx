import type { ReactNode } from "react";

import { requireRoleForPage } from "@/lib/auth/actor";

/**
 * Administration is gated here as well as in every action underneath it.
 * Non-administrators get the not-found view, so the existence of these routes is
 * not confirmed to them.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireRoleForPage(["ADMIN"]);

  return <>{children}</>;
}
