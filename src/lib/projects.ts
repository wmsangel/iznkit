import type { Locale } from "@/lib/i18n/config";

/**
 * Sister projects — cross-promoted across the network while ads aren't running.
 * Shown in the footer and on the /projects page.
 */
export interface Project {
  name: string;
  url: string;
  /** Primary language of the destination site. */
  lang: string;
  tagline: Record<Locale, string>;
}

export const PROJECTS: Project[] = [
  {
    name: "TheCryptoTools",
    url: "https://thecryptotools.com/",
    lang: "EN",
    tagline: {
      en: "69+ free crypto calculators & tools — no sign-up.",
      ru: "69+ бесплатных крипто-калькуляторов и инструментов.",
    },
  },
  {
    name: "CalcLumen",
    url: "https://calclumen.com/",
    lang: "EN",
    tagline: {
      en: "60+ fast, free calculators for money, health & everyday math.",
      ru: "60+ быстрых калькуляторов: финансы, здоровье, математика.",
    },
  },
  {
    name: "CostTrek",
    url: "https://costtrek.com/",
    lang: "EN",
    tagline: {
      en: "Compare the cost of living between cities worldwide.",
      ru: "Сравнение стоимости жизни между городами мира.",
    },
  },
  {
    name: "izn.games",
    url: "https://izngames.com/",
    lang: "EN",
    tagline: {
      en: "Free browser games — play instantly, no install.",
      ru: "Бесплатные браузерные игры — сразу, без установки.",
    },
  },
  {
    name: "ДомЭксперт",
    url: "https://prodom-expert.ru/",
    lang: "RU",
    tagline: {
      en: "Home repair & interior design advice, with real numbers.",
      ru: "Ремонт и дизайн интерьера — советы и конкретные цифры.",
    },
  },
  {
    name: "24здоровье",
    url: "https://24zdorovie.com/",
    lang: "RU",
    tagline: {
      en: "Evidence-based health: nutrition, fitness, sleep, mind.",
      ru: "Доказательное здоровье: питание, движение, сон, психика.",
    },
  },
];
