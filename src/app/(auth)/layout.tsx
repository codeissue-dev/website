import type { ReactNode } from "react";

import { SiteHeader } from "@/components/layout/site-header";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <SiteHeader />
      <main
        id="main-content"
        className="page-enter mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12"
      >
        {children}
      </main>
    </div>
  );
}
