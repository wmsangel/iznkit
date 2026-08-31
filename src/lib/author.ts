import type { Locale } from "@/lib/i18n/config";

/**
 * Editorial identity used for guide bylines, author bios and Article JSON-LD.
 * Intentionally an editorial team (no personal name) — change here to update
 * every byline at once.
 */
export const AUTHOR = {
  name: { en: "iznkit editorial", ru: "Редакция iznkit" } as Record<Locale, string>,
  bio: {
    en: "The iznkit editorial team builds and documents free, no-sign-up tools for freelancers, small businesses and developers — and writes these guides to go with them.",
    ru: "Редакция iznkit создаёт и описывает бесплатные инструменты без регистрации — для фрилансеров, малого бизнеса и разработчиков — и пишет к ним эти гайды.",
  } as Record<Locale, string>,
  byLabel: { en: "By", ru: "Автор" } as Record<Locale, string>,
  aboutLabel: { en: "About the author", ru: "Об авторе" } as Record<Locale, string>,
};
