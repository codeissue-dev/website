import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { getActor } from "@/lib/auth/actor";
import { getSiteUrl } from "@/lib/env";

/**
 * Organization and WebSite structured data for every public page, written in
 * the language of the current request. The studio has no physical address or
 * social profiles yet, so the graph states only what the site itself proves.
 */
async function organizationJsonLd() {
  const [t, siteUrl] = await Promise.all([
    getTranslations("Meta"),
    Promise.resolve(getSiteUrl()),
  ]);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "codeissue",
        url: siteUrl,
        description: t("description"),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "codeissue",
        description: t("description"),
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };
}

export default async function PublicLayout({ children }: { children: ReactNode }) {
  // Only used to decide which header actions to show; every protected page and
  // action re-checks the session itself. A database blip must not take the
  // marketing site down, so a failed lookup degrades to the guest header.
  const [actor, jsonLd] = await Promise.all([
    getActor().catch(() => null),
    organizationJsonLd(),
  ]);

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <JsonLd data={jsonLd} />
      <SiteHeader actor={actor} />
      <main id="main-content" className="page-enter flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
