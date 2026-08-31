import Link from "next/link";
import type { ReactNode } from "react";

import { Wordmark } from "@/components/brand/wordmark";
import { Container } from "@/components/ui/section";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="site-bar">
        <Container className="flex h-14 items-center">
          <Link href="/" className="flex items-center" aria-label="codeissue home">
            <Wordmark size="sm" />
          </Link>
        </Container>
      </header>
      <main
        id="main-content"
        className="page-enter mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12"
      >
        {children}
      </main>
    </div>
  );
}
