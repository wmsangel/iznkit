import { locales, type Locale } from "@/lib/i18n/config";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://iznkit.com"
).replace(/\/$/, "");

export const SITE_NAME = "iznkit";

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
