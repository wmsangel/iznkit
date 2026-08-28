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
    url: "https://calclumen.com/en",
    lang: "EN",
    tagline: {
      en: "60+ fast, free calculators for money, health & everyday math.",
      ru: "60+ быстрых калькуляторов: финансы, здоровье, математика.",
    },
  },
  {
    name: "CostTrek",
    url: "https://costtrek.com/en",
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
    name: "IZN Tools",
    url: "https://izntools.com/",
    lang: "EN",
    tagline: {
      en: "100+ small browser tools — images, JSON, SEO and dev. Nothing uploaded.",
      ru: "100+ небольших браузерных инструментов — картинки, JSON, SEO и разработка.",
    },
  },
  {
    name: "TestSweep",
    url: "https://testsweep.com/",
    lang: "EN",
    tagline: {
      en: "Free in-browser tests for your screen and hardware — nothing to install.",
      ru: "Бесплатные браузерные тесты экрана и железа — без установки.",
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
    url: "https://24zdorovie.com/ru/",
    lang: "RU",
    tagline: {
      en: "Evidence-based health: nutrition, fitness, sleep, mind.",
      ru: "Доказательное здоровье: питание, движение, сон, психика.",
    },
  },
  {
    name: "Bilimjol",
    url: "https://bilimjol.com/",
    lang: "RU",
    tagline: {
      en: "Learning exercises for kids — preschool to grade 11, with helper characters.",
      ru: "Обучающие задания для детей — от садика до 11 класса, с героями-помощниками.",
    },
  },
];
