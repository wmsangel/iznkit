import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo/site";

/**
 * Web app manifest — improves mobile/PWA signals and sets the theme colour.
 * Served at /manifest.webmanifest; Next injects the <link rel="manifest">.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "iznkit — calculators & document generators",
    short_name: SITE_NAME,
    description:
      "A quiet set of calculators and document generators that hand you a clean, branded PDF.",
    start_url: "/en",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4faa82",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/favicon.ico", sizes: "any" },
    ],
  };
}
