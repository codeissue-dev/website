import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { getSiteUrl } from "@/lib/env";

import "./globals.css";

const DESCRIPTION =
  "codeissue builds custom software from a written brief: submit your project, follow every status change, and talk to the engineers doing the work.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "codeissue: custom software development",
    template: "%s · codeissue",
  },
  description: DESCRIPTION,
  applicationName: "codeissue",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "codeissue",
    title: "codeissue: custom software development",
    description: DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "codeissue: custom software development",
    description: DESCRIPTION,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-canvas font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
