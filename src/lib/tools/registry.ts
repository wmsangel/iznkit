import type { Locale } from "@/lib/i18n/config";

/** A localized string: same shape for every UI language we support. */
export type L10n = Record<Locale, string>;

export type ToolStatus = "live" | "soon";

export interface ToolDef {
  /** URL slug, used at /[locale]/tools/<slug> */
  slug: string;
  title: L10n;
  blurb: L10n;
  status: ToolStatus;
  popular?: boolean;
  /** one-time unlock price in cents (USD), for display; real pricing handled by payment provider */
  priceCents: number;
  /** optional affiliate category key (see src/lib/affiliates.ts) for a "You may like" block */
  affiliate?: string;
}

export type SectionId =
  | "documents"
  | "realestate"
  | "freelance"
  | "marketing"
  | "ecommerce"
  | "developer"
  | "utilities"
  | "everyday";

export interface SectionDef {
  id: SectionId;
  emoji: string;
  title: L10n;
  blurb: L10n;
  tools: ToolDef[];
}

export const sections: SectionDef[] = [
  {
    id: "documents",
    emoji: "📄",
    title: { en: "Documents", ru: "Документы" },
    blurb: {
      en: "Generate clean, ready-to-send business documents.",
      ru: "Генераторы аккуратных документов, готовых к отправке.",
    },
    tools: [
      {
        slug: "invoice",
        status: "live",
        popular: true,
        priceCents: 300,
        title: { en: "Invoice generator", ru: "Генератор счёта" },
        blurb: {
          en: "A polished PDF invoice in under a minute.",
          ru: "Аккуратный PDF-счёт меньше чем за минуту.",
        },
      },
      {
        slug: "quote",
        status: "live",
        priceCents: 500,
        title: { en: "Quote / estimate", ru: "Смета / КП" },
        blurb: {
          en: "Send a professional quote clients can say yes to.",
          ru: "Профессиональное КП, на которое легко согласиться.",
        },
      },
      {
        slug: "purchase-order",
        status: "live",
        priceCents: 300,
        title: { en: "Purchase order", ru: "Заказ поставщику" },
        blurb: {
          en: "Order from a supplier with a clean PO.",
          ru: "Закажите у поставщика аккуратным заказом.",
        },
      },
      {
        slug: "delivery-note",
        status: "live",
        priceCents: 300,
        title: { en: "Delivery note", ru: "Товарная накладная" },
        blurb: {
          en: "A clean delivery note with sign-off lines.",
          ru: "Аккуратная накладная с местом для подписей.",
        },
      },
      {
        slug: "gift-certificate",
        status: "live",
        popular: true,
        priceCents: 400,
        title: { en: "Gift certificate", ru: "Подарочный сертификат" },
        blurb: {
          en: "18 designs — a beautiful gift certificate or coupon.",
          ru: "18 дизайнов — красивый подарочный сертификат или купон.",
        },
      },
      {
        slug: "receipt",
        status: "live",
        priceCents: 200,
        title: { en: "Receipt generator", ru: "Генератор чека" },
        blurb: {
          en: "A clean proof-of-payment receipt in seconds.",
          ru: "Аккуратная квитанция об оплате за секунды.",
        },
      },
      {
        slug: "inspection-report",
        status: "live",
        popular: true,
        priceCents: 400,
        title: { en: "Inspection report", ru: "Акт осмотра" },
        blurb: {
          en: "Turn field notes and photos into a consistent report.",
          ru: "Заметки и фото с объекта — в единый отчёт.",
        },
      },
      {
        slug: "nda",
        status: "live",
        popular: true,
        priceCents: 500,
        title: { en: "NDA / contract", ru: "NDA / договор" },
        blurb: {
          en: "Fill a proven template, get a signed-ready PDF.",
          ru: "Заполните проверенный шаблон — получите готовый PDF.",
        },
      },
    ],
  },
  {
    id: "realestate",
    emoji: "🏠",
    title: { en: "Real estate", ru: "Недвижимость" },
    blurb: {
      en: "Decide with numbers before you sign.",
      ru: "Решайте цифрами до того, как подписать.",
    },
    tools: [
      {
        slug: "rental-yield",
        status: "live",
        popular: true,
        priceCents: 300,
        title: { en: "Rental yield calculator", ru: "Доходность аренды" },
        blurb: {
          en: "Is this property worth buying to rent out?",
          ru: "Стоит ли покупать эту квартиру под сдачу?",
        },
      },
    ],
  },
  {
    id: "freelance",
    emoji: "💼",
    title: { en: "Freelance & taxes", ru: "Фриланс и налоги" },
    blurb: {
      en: "Know what you keep and what to charge.",
      ru: "Понимайте, сколько останется и сколько брать.",
    },
    tools: [
      {
        slug: "self-employed-tax",
        status: "live",
        popular: true,
        priceCents: 300,
        title: { en: "Freelance tax estimate", ru: "Налог самозанятого" },
        blurb: {
          en: "Estimate your tax and take-home in seconds.",
          ru: "Оцените налог и «чистыми» за секунды.",
        },
      },
      {
        slug: "hourly-rate",
        status: "live",
        priceCents: 300,
        title: { en: "Hourly rate calculator", ru: "Калькулятор ставки" },
        blurb: {
          en: "Work out the rate that hits your income goal.",
          ru: "Ставка, которая закрывает вашу цель по доходу.",
        },
      },
      {
        slug: "timesheet",
        status: "live",
        priceCents: 300,
        title: { en: "Timesheet", ru: "Табель учёта часов" },
        blurb: {
          en: "Log hours and turn them into a clean PDF.",
          ru: "Учёт часов — в аккуратный PDF с итогом.",
        },
      },
    ],
  },
  {
    id: "marketing",
    emoji: "📈",
    title: { en: "Marketing & SEO", ru: "Маркетинг и SEO" },
    blurb: {
      en: "Small tools to plan and measure campaigns.",
      ru: "Мини-инструменты для планирования и замеров.",
    },
    tools: [
      {
        slug: "utm-builder",
        status: "live",
        priceCents: 0,
        title: { en: "UTM builder", ru: "UTM-генератор" },
        blurb: {
          en: "Consistent, trackable campaign links.",
          ru: "Единые ссылки с корректными метками.",
        },
      },
      {
        slug: "ad-roi",
        status: "live",
        priceCents: 300,
        title: { en: "Ad ROI calculator", ru: "ROI рекламы" },
        blurb: {
          en: "See if the spend actually pays off.",
          ru: "Понять, окупается ли рекламный бюджет.",
        },
      },
    ],
  },
  {
    id: "ecommerce",
    emoji: "🛒",
    title: { en: "E-commerce", ru: "E-commerce" },
    blurb: {
      en: "Unit economics for marketplace sellers.",
      ru: "Юнит-экономика для продавцов маркетплейсов.",
    },
    tools: [
      {
        slug: "unit-economics",
        status: "live",
        popular: true,
        priceCents: 500,
        title: {
          en: "Marketplace unit economics",
          ru: "Юнит-экономика маркетплейса",
        },
        blurb: {
          en: "Profit per sale across marketplaces, with a report.",
          ru: "Прибыль с продажи по площадкам, с отчётом.",
        },
      },
    ],
  },
  {
    id: "developer",
    emoji: "⚙️",
    title: { en: "Developer tools", ru: "Инструменты разработчика" },
    blurb: {
      en: "Fast, no-login utilities for everyday coding.",
      ru: "Быстрые утилиты для повседневной разработки, без входа.",
    },
    tools: [
      {
        slug: "json-formatter",
        status: "live",
        popular: true,
        priceCents: 0,
        affiliate: "developer-tools",
        title: { en: "JSON formatter", ru: "JSON-форматтер" },
        blurb: {
          en: "Format, validate and minify JSON in your browser.",
          ru: "Форматирование, проверка и минификация JSON в браузере.",
        },
      },
      {
        slug: "base64",
        status: "live",
        priceCents: 0,
        affiliate: "developer-tools",
        title: { en: "Base64 encoder / decoder", ru: "Base64: кодер и декодер" },
        blurb: {
          en: "Encode or decode Base64 text, UTF-8 safe.",
          ru: "Кодирование и декодирование Base64, с поддержкой UTF-8.",
        },
      },
      {
        slug: "jwt-decoder",
        status: "live",
        priceCents: 0,
        affiliate: "developer-tools",
        title: { en: "JWT decoder", ru: "JWT-декодер" },
        blurb: {
          en: "Decode a JWT's header and payload in your browser.",
          ru: "Декодируйте заголовок и payload JWT в браузере.",
        },
      },
      {
        slug: "regex-tester",
        status: "live",
        priceCents: 0,
        affiliate: "developer-tools",
        title: { en: "Regex tester", ru: "Regex-тестер" },
        blurb: {
          en: "Test regular expressions with live match highlighting.",
          ru: "Проверяйте регулярные выражения с подсветкой совпадений.",
        },
      },
      {
        slug: "url-encode",
        status: "live",
        priceCents: 0,
        affiliate: "developer-tools",
        title: { en: "URL encoder / decoder", ru: "URL-кодер и декодер" },
        blurb: {
          en: "Percent-encode or decode URLs and query strings.",
          ru: "Кодирование и декодирование URL и query-строк.",
        },
      },
      {
        slug: "uuid",
        status: "live",
        priceCents: 0,
        affiliate: "developer-tools",
        title: { en: "UUID generator", ru: "Генератор UUID" },
        blurb: {
          en: "Generate random UUID v4 identifiers in bulk.",
          ru: "Генерация случайных UUID v4, в том числе списком.",
        },
      },
      {
        slug: "hash",
        status: "live",
        priceCents: 0,
        affiliate: "developer-tools",
        title: { en: "Hash generator (SHA)", ru: "Генератор хешей (SHA)" },
        blurb: {
          en: "SHA-1, SHA-256, SHA-384 and SHA-512 of any text.",
          ru: "SHA-1, SHA-256, SHA-384 и SHA-512 для любого текста.",
        },
      },
      {
        slug: "timestamp",
        status: "live",
        priceCents: 0,
        affiliate: "developer-tools",
        title: { en: "Unix timestamp converter", ru: "Конвертер Unix-времени" },
        blurb: {
          en: "Convert Unix timestamps to dates and back.",
          ru: "Конвертация Unix-времени в дату и обратно.",
        },
      },
      {
        slug: "color",
        status: "live",
        priceCents: 0,
        affiliate: "developer-tools",
        title: { en: "Color converter", ru: "Конвертер цветов" },
        blurb: {
          en: "Convert colors between HEX, RGB and HSL.",
          ru: "Конвертация цветов между HEX, RGB и HSL.",
        },
      },
    ],
  },
  {
    id: "utilities",
    emoji: "🔧",
    title: { en: "Utilities", ru: "Утилиты" },
    blurb: {
      en: "Quick everyday converters and generators.",
      ru: "Быстрые повседневные конвертеры и генераторы.",
    },
    tools: [
      {
        slug: "email-signature",
        status: "live",
        priceCents: 0,
        title: { en: "Email signature", ru: "Подпись для почты" },
        blurb: {
          en: "A clean HTML signature for your team.",
          ru: "Аккуратная HTML-подпись для команды.",
        },
      },
      {
        slug: "qr-code",
        status: "live",
        priceCents: 0,
        title: { en: "QR code generator", ru: "QR-генератор" },
        blurb: {
          en: "Make a QR for a link, Wi-Fi or text.",
          ru: "QR для ссылки, Wi-Fi или текста.",
        },
      },
      {
        slug: "password-generator",
        status: "live",
        popular: true,
        priceCents: 0,
        affiliate: "password-managers",
        title: { en: "Password generator", ru: "Генератор паролей" },
        blurb: {
          en: "Strong, random passwords — right in your browser.",
          ru: "Надёжные случайные пароли — прямо в браузере.",
        },
      },
    ],
  },
  {
    id: "everyday",
    emoji: "🧮",
    title: { en: "Everyday calculators", ru: "Повседневные калькуляторы" },
    blurb: {
      en: "Quick, free calculators for daily life.",
      ru: "Быстрые бесплатные калькуляторы на каждый день.",
    },
    tools: [
      {
        slug: "loan-calculator",
        status: "live",
        priceCents: 0,
        title: { en: "Loan calculator", ru: "Кредитный калькулятор" },
        blurb: {
          en: "Monthly payment, total interest and cost.",
          ru: "Ежемесячный платёж, переплата и итог.",
        },
      },
      {
        slug: "tip-calculator",
        status: "live",
        priceCents: 0,
        title: { en: "Tip calculator", ru: "Калькулятор чаевых" },
        blurb: {
          en: "Tip and split the bill in seconds.",
          ru: "Чаевые и деление счёта за секунды.",
        },
      },
      {
        slug: "percentage-calculator",
        status: "live",
        priceCents: 0,
        title: { en: "Percentage calculator", ru: "Калькулятор процентов" },
        blurb: {
          en: "Percent of, change and share — all in one.",
          ru: "Процент от, изменение и доля — всё сразу.",
        },
      },
    ],
  },
];

export function getTool(slug: string): { section: SectionDef; tool: ToolDef } | null {
  for (const section of sections) {
    const tool = section.tools.find((t) => t.slug === slug);
    if (tool) return { section, tool };
  }
  return null;
}

export function allTools(): ToolDef[] {
  return sections.flatMap((s) => s.tools);
}
