import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { HashNavigation } from "@/components/motion/hash-navigation";
import { getSiteUrl } from "@/lib/env";

import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: t("title"),
      template: "%s - codeissue",
    },
    description: t("description"),
    applicationName: "codeissue",
    /*
     * No canonical here on purpose: metadata is inherited, and a root-level
     * canonical would make every page that forgets its own claim to be "/".
     * Each public page states its own canonical instead.
     */
    openGraph: {
      type: "website",
      siteName: "codeissue",
      title: t("title"),
      description: t("description"),
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  // The palette is OLED dark unless the visitor switches themes.
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

/**
 * Runs before paint: marks JavaScript as available for the reveal styles and
 * resolves the initial theme from the stored preference, falling back to the
 * system setting. Dark stays the default when storage is unavailable.
 */
const themeScript = `(function(){try{var d=document.documentElement;d.classList.add("js");var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}d.dataset.theme=t;}catch(e){}})();`;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [locale, messages, t] = await Promise.all([
    getLocale(),
    getMessages(),
    getTranslations("Header"),
  ]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh bg-canvas font-sans text-ink antialiased">
        <NextIntlClientProvider messages={messages}>
          <HashNavigation />
          {/* Keyboard users skip the navigation; every layout labels its main region. */}
          <a href="#main-content" className="skip-link">
            {t("skip")}
          </a>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
