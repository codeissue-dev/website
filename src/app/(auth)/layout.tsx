import Link from "next/link";
import type { ReactNode } from "react";

import { Wordmark } from "@/components/brand/wordmark";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-canvas">
      <div aria-hidden="true" className="grid-backdrop absolute inset-0" />
      <header className="relative mx-auto w-full max-w-6xl px-4 py-5 sm:px-6">
        <Link href="/" className="inline-flex items-center" aria-label="codeissue home">
          <Wordmark />
        </Link>
      </header>
      <main className="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 pb-16 sm:px-0">
        {children}
      </main>
    </div>
  );
}
