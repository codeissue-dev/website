import type { MetadataRoute } from "next";

import { listPublishedPortfolioItems } from "@/lib/content/queries";
import { getSiteUrl } from "@/lib/env";

/**
 * Generated per request so that `next build` never needs the database, and so
 * that newly published case studies appear without a redeploy.
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const items = await listPublishedPortfolioItems(200);

  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/work`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...items.map((item) => ({
      url: `${siteUrl}/work/${item.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
