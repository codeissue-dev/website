import Link from "next/link";
import type { ReactNode } from "react";

import { Wordmark } from "@/components/brand/wordmark";
import { Container } from "@/components/ui/section";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden bg-canvas">
      <div aria-hidden="true" className="grid-backdrop absolute inset-0" />
      <div aria-hidden="true" className="hero-aurora -right-32 -top-48 opacity-70" />
      <Container as="header" className="relative py-5">
        <Link
          href="/"
          className="inline-flex items-center rounded-md transition-opacity hover:opacity-75"
          aria-label="codeissue home"
        >
          <Wordmark />
        </Link>
      </Container>
      <main
        id="main-content"
        className="page-enter relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 pb-16 sm:px-0"
      >
        {children}
      </main>
    </div>
  );
}
