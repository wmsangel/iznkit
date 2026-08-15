import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { sections } from "@/lib/tools/registry";
import { absUrl, languageAlternates } from "@/lib/seo/site";
import { DONATE } from "@/lib/donate";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Home page, one entry per locale, cross-linked with hreflang alternates.
  for (const locale of locales) {
    entries.push({
      url: absUrl(locale),
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: languageAlternates() },
    });
  }

  // Donate page.
  for (const locale of locales) {
    entries.push({
      url: absUrl(locale, DONATE.path),
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: { languages: languageAlternates(DONATE.path) },
    });
  }

  // Live tools.
  for (const section of sections) {
    for (const tool of section.tools) {
      if (tool.status !== "live") continue;
      const path = `tools/${tool.slug}`;
      for (const locale of locales) {
        entries.push({
          url: absUrl(locale, path),
          changeFrequency: "monthly",
          priority: 0.8,
          alternates: { languages: languageAlternates(path) },
        });
      }
    }
  }

  return entries;
}
