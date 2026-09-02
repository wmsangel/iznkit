import { locales } from "@/lib/i18n/config";
import { sections } from "@/lib/tools/registry";
import { absUrl } from "@/lib/seo/site";
import { DONATE } from "@/lib/donate";
import { GUIDES } from "@/lib/guides";

/**
 * IndexNow key. The matching file `public/<key>.txt` must contain exactly this
 * value so search engines (Bing, Yandex, Seznam) can verify ownership.
 */
export const INDEXNOW_KEY = "742849f8e1f24086cf98762a7274b3a8";

const STATIC_PATHS = [
  "",
  DONATE.path,
  "about",
  "contact",
  "projects",
  "privacy",
  "terms",
  "disclosure",
  "guides",
  "tools",
];

/** Every indexable URL on the site (both locales), matching the sitemap. */
export function allUrls(): string[] {
  const urls: string[] = [];
  for (const path of STATIC_PATHS) {
    for (const locale of locales) urls.push(absUrl(locale, path));
  }
  for (const section of sections) {
    for (const locale of locales) urls.push(absUrl(locale, `tools/${section.id}`));
  }
  for (const section of sections) {
    for (const tool of section.tools) {
      if (tool.status !== "live") continue;
      for (const locale of locales) urls.push(absUrl(locale, `tools/${tool.slug}`));
    }
  }
  for (const guide of GUIDES) {
    for (const locale of locales) urls.push(absUrl(locale, `guides/${guide.slug}`));
  }
  return urls;
}
