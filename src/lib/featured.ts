import type { Locale } from "@/lib/i18n/config";

/**
 * House-ad / self-promo rotation (IDEAS §H).
 *
 * One of OUR own things is surfaced per ISO week in a thin slot under the
 * homepage hero — separate from the affiliate slot (partners), related-tools
 * (same category) and the footer network (other sites). Edit this list freely;
 * its order defines the weekly cycle. `href` is an internal path WITHOUT the
 * locale prefix (e.g. "tools/schet-faktura"); the slot prepends /{locale}/.
 */
export interface FeaturedItem {
  href: string;
  badge: Record<Locale, string>;
  title: Record<Locale, string>;
  blurb: Record<Locale, string>;
}

export const FEATURED: FeaturedItem[] = [
  {
    href: "tools/schet-faktura",
    badge: { en: "New", ru: "Новинка" },
    title: { en: "Счёт-фактура generator", ru: "Генератор счёта-фактуры" },
    blurb: {
      en: "A Russian VAT invoice (form 1137) as a free PDF — fill it in and download.",
      ru: "Счёт-фактура по форме 1137 в PDF бесплатно — заполните и скачайте.",
    },
  },
  {
    href: "tools/marketplace-taxes",
    badge: { en: "New", ru: "Новинка" },
    title: { en: "Marketplace tax calculator", ru: "Калькулятор налогов маркетплейса" },
    blurb: {
      en: "Compare УСН, АУСН and НПД for a marketplace seller and see the cheapest.",
      ru: "Сравните УСН, АУСН и НПД для продавца и найдите выгодный режим.",
    },
  },
  {
    href: "tools/sql-formatter",
    badge: { en: "New", ru: "Новинка" },
    title: { en: "SQL formatter", ru: "Форматтер SQL" },
    blurb: {
      en: "Clean, indent and case SQL for 10+ dialects — right in your browser.",
      ru: "Чистый SQL с отступами и регистром для 10+ диалектов — в браузере.",
    },
  },
  {
    href: "guides/marketplace-seller-taxes-usn-ausn-npd-2026",
    badge: { en: "Guide", ru: "Гайд" },
    title: { en: "Marketplace taxes in 2026", ru: "Налоги маркетплейса в 2026" },
    blurb: {
      en: "УСН vs АУСН vs НПД, the VAT change and the НПД resale ban — explained.",
      ru: "УСН vs АУСН vs НПД, НДС-2026 и запрет перепродажи на НПД — разбор.",
    },
  },
  {
    href: "tools/unit-economics",
    badge: { en: "Popular", ru: "Популярное" },
    title: { en: "Marketplace unit economics", ru: "Юнит-экономика маркетплейса" },
    blurb: {
      en: "Profit per sale across marketplaces after every fee, with a report.",
      ru: "Прибыль с продажи по площадкам после всех сборов, с отчётом.",
    },
  },
  {
    href: "tools/compound-interest",
    badge: { en: "Weekly tip", ru: "Совет недели" },
    title: { en: "Compound interest, month by month", ru: "Сложный процент по месяцам" },
    blurb: {
      en: "A deposit with monthly top-ups and capitalisation — with a schedule.",
      ru: "Вклад с ежемесячным пополнением и капитализацией — с таблицей по месяцам.",
    },
  },
];

/** ISO-8601 week number (1–53) for a date. */
export function isoWeek(d: Date): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = (date.getUTCDay() + 6) % 7; // Mon=0 … Sun=6
  date.setUTCDate(date.getUTCDate() - dayNum + 3); // to the week's Thursday
  const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  return 1 + Math.round((date.getTime() - firstThursday.getTime()) / (7 * 864e5));
}

/** Deterministic weekly pick; safe for any (even negative) week number. */
export function featuredForWeek(week: number): FeaturedItem {
  const n = FEATURED.length;
  return FEATURED[((week % n) + n) % n];
}
