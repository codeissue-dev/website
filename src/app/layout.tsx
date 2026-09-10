import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SITE } from "@/content/site";
import { getSiteUrl } from "@/lib/env";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE.title,
    template: SITE.titleTemplate,
  },
  description: SITE.description,
  applicationName: SITE.name,
  /*
   * No canonical here on purpose: metadata is inherited, and a root-level
   * canonical would make every page that forgets its own claim to be "/".
   * Each public page states its own canonical instead.
   */
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  // The palette is OLED dark; the browser chrome follows.
  colorScheme: "dark",
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-canvas font-sans text-ink antialiased">
        {/* Keyboard users skip the navigation; every layout labels its main region. */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
