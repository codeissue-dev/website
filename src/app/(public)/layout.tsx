import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JsonLd } from "@/components/seo/json-ld";
import { SITE } from "@/content/site";
import { getActor } from "@/lib/auth/actor";
import { getSiteUrl } from "@/lib/env";

/**
 * Organization and WebSite structured data for every public page. The studio
 * has no physical address or social profiles yet, so the graph states only
 * what the site itself proves.
 */
function organizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: SITE.name,
        url: siteUrl,
        description: SITE.description,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE.name,
        description: SITE.description,
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };
}

export default async function PublicLayout({ children }: { children: ReactNode }) {
  // Only used to decide which header actions to show; every protected page and
  // action re-checks the session itself.
  const actor = await getActor();

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <JsonLd data={organizationJsonLd()} />
      <SiteHeader actor={actor} />
      <main id="main-content" className="page-enter flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
