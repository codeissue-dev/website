import type { NextConfig } from "next";

/**
 * Headers applied to every response. They are intentionally conservative: the
 * app renders no third-party embeds and needs no cross-origin framing.
 */
const baseSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // `pg` and `ws` use Node built-ins and native protocol handling; keep them
  // outside the bundler so the server runtime loads them directly.
  serverExternalPackages: ["pg", "ws"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: baseSecurityHeaders,
      },
      {
        // Authenticated surfaces must never be indexed, even if a URL leaks.
        source: "/:path(dashboard|orders|admin|account)/:rest*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path(dashboard|orders|admin|account)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
