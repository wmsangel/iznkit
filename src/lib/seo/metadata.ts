import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { absUrl, languageAlternates, OG_LOCALE, SITE_NAME } from "./site";

interface PageSeo {
  locale: Locale;
  /** path without the locale prefix, e.g. "tools/invoice" or "" for home */
  path?: string;
  title: string;
  description: string;
}

/** Build a complete, consistent Metadata object (canonical, hreflang, OG, Twitter). */
export function pageMetadata({ locale, path = "", title, description }: PageSeo): Metadata {
  const url = absUrl(locale, path);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale: OG_LOCALE[locale],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
