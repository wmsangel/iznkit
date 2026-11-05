import type { NextConfig } from "next";

// Security / trust headers applied to every route. These are safe for a static
// site with no cross-origin embedding and improve the trust signals crawlers
// and scanners look for. (A strict Content-Security-Policy is intentionally
// left out — it needs per-script nonces/hashes for GA + inline JSON-LD and
// should be added in its own tested pass.)
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Canonical host: redirect the www apex to the bare domain, preserving path and
  // query (Next forwards the query string automatically). Runs in the Worker via
  // OpenNext, so it covers every path — unlike the locale middleware (src/proxy.ts),
  // whose matcher skips already-localized paths to save Edge Requests. Without this,
  // www.iznkit.com serves a duplicate of the site.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.iznkit.com" }],
        destination: "https://iznkit.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
