import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/env";

/**
 * Public pages are indexable. Everything behind authentication, the auth
 * screens and the API surface are excluded: none of them are useful in a search
 * index, and private pages must never be crawled.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/orders",
          "/account",
          "/admin",
          "/sign-in",
          "/register",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
