import { locales, type Locale } from "@/lib/i18n/config";

const FALLBACK_SITE_URL = "https://iznkit.com";

/**
 * Absolute site origin. Resilient to a missing, empty, or malformed
 * NEXT_PUBLIC_SITE_URL — an invalid value here would otherwise crash the build
 * (metadataBase does `new URL(SITE_URL)`). Falls back unless it's a real http(s) URL.
 */
export const SITE_URL = (() => {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().replace(/\/$/, "");
  return /^https?:\/\/[^\s]+$/.test(raw) ? raw : FALLBACK_SITE_URL;
})();

export const SITE_NAME = "iznkit";

/** Public contact addresses. */
export const CONTACT_EMAIL = "info@iznkit.com";
export const ADS_EMAIL = "ads@iznkit.com";

/** OpenGraph locale codes for our UI locales. */
export const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  ru: "ru_RU",
};

/** Absolute URL for a locale + path (path without leading locale). */
export function absUrl(locale: Locale, path = ""): string {
  const clean = path.replace(/^\//, "");
  return `${SITE_URL}/${locale}${clean ? `/${clean}` : ""}`;
}

/** hreflang alternates map for a given path (same path across locales). */
export function languageAlternates(path = ""): Record<string, string> {
  return Object.fromEntries(locales.map((l) => [l, absUrl(l, path)]));
}
