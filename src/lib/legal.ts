import type { Locale } from "@/lib/i18n/config";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/seo/site";

export interface LegalSection {
  h: string;
  /** Paragraphs (strings) or bullet lists (string arrays). */
  p: (string | string[])[];
}
export interface LegalDoc {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

/** Last meaningful edit — bump when the text changes. */
const UPDATED = "2026-08-17";

export function privacyDoc(locale: Locale): LegalDoc {
  if (locale === "ru") {
    return {
      title: "Политика конфиденциальности",
      updated: UPDATED,
      intro: `Эта политика описывает, какие данные обрабатывает ${SITE_NAME} (сайт iznkit.com) и как мы относимся к вашей приватности. Коротко: аккаунтов нет, персональные данные мы не собираем.`,
      sections: [
        {
          h: "Какие данные мы собираем",
          p: [
            "Мы не просим вас регистрироваться или вводить персональные данные. То, что вы вводите в инструменты (суммы, тексты, реквизиты), остаётся в вашем браузере (localStorage) и используется только для того, чтобы построить документ или результат. Эти данные не отправляются на наши серверы и не хранятся у нас.",
            "Файлы (например PDF) генерируются по вашему запросу и отдаются вам напрямую; их содержимое мы не сохраняем.",
          ],
        },
        {
          h: "Файлы cookie и аналитика",
          p: [
            "Мы используем Google Analytics, чтобы понимать обобщённую статистику посещений (какие страницы смотрят, примерный регион, тип устройства). Google Analytics устанавливает файлы cookie и обрабатывает данные в агрегированном виде.",
            "Эти данные не позволяют идентифицировать вас лично и используются только для улучшения сайта.",
          ],
        },
        {
          h: "Реклама (в будущем)",
          p: [
            "Мы планируем показывать рекламу через Google AdSense и других сторонних поставщиков. Сторонние поставщики, включая Google, используют файлы cookie для показа объявлений на основе ваших прошлых посещений этого и других сайтов.",
            "Использование Google рекламных cookie позволяет ему и его партнёрам показывать объявления на основе ваших посещений. Вы можете отключить персонализированную рекламу в настройках Google (adssettings.google.com), а сторонние cookie — на www.aboutads.info/choices.",
          ],
        },
        {
          h: "Согласие (ЕЭЗ и Великобритания)",
          p: [
            "Для посетителей из Европейской экономической зоны и Великобритании мы запрашиваем согласие до установки необязательных (аналитических и рекламных) cookie. Вы можете принять или отклонить их в баннере согласия; отказ не влияет на работу инструментов.",
          ],
        },
        {
          h: "Ссылки на другие сайты",
          p: [
            "В футере и на странице «Проекты» есть ссылки на наши другие сайты и внешние сервисы. Их политики конфиденциальности действуют отдельно от нашей — ознакомьтесь с ними на соответствующих ресурсах.",
          ],
        },
        {
          h: "Дети",
          p: [
            "Сайт не предназначен для детей младше 13 лет, и мы сознательно не собираем их данные.",
          ],
        },
        {
          h: "Ваши права и выбор",
          p: [
            "Вы в любой момент можете очистить локальные данные инструментов, очистив данные сайта в браузере, и управлять cookie в настройках браузера. Для управления рекламными предпочтениями используйте ссылки выше.",
          ],
        },
        {
          h: "Изменения",
          p: [
            "Мы можем обновлять эту политику. Дата последнего изменения указана вверху страницы.",
          ],
        },
        {
          h: "Контакты",
          p: [
            `По вопросам о конфиденциальности пишите на ${CONTACT_EMAIL}.`,
          ],
        },
      ],
    };
  }
  return {
    title: "Privacy Policy",
    updated: UPDATED,
    intro: `This policy explains what data ${SITE_NAME} (iznkit.com) processes and how we treat your privacy. In short: there are no accounts and we don't collect personal information.`,
    sections: [
      {
        h: "Information we collect",
        p: [
          "We don't ask you to sign up or submit personal information. What you type into the tools (amounts, text, details) stays in your browser (localStorage) and is used only to build your document or result. It is not sent to or stored on our servers.",
          "Files such as PDFs are generated on request and delivered directly to you; we don't keep their contents.",
        ],
      },
      {
        h: "Cookies and analytics",
        p: [
          "We use Google Analytics to understand aggregate traffic (which pages are viewed, approximate region, device type). Google Analytics sets cookies and processes data in aggregate.",
          "This data does not identify you personally and is used only to improve the site.",
        ],
      },
      {
        h: "Advertising (planned)",
        p: [
          "We plan to display ads served by Google AdSense and other third-party vendors. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites.",
          "Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet. You may opt out of personalized advertising by visiting Google Ads Settings (adssettings.google.com), or opt out of third-party cookies at www.aboutads.info/choices.",
        ],
      },
      {
        h: "Consent (EEA and UK)",
        p: [
          "For visitors in the European Economic Area and the UK, we ask for consent before non-essential (analytics and advertising) cookies are set. You can accept or decline in the consent banner; declining does not affect the tools.",
        ],
      },
      {
        h: "Links to other sites",
        p: [
          "Our footer and Projects page link to our other websites and to external services. Their privacy practices are governed by their own policies — please review them on those sites.",
        ],
      },
      {
        h: "Children",
        p: [
          "The site is not directed at children under 13, and we do not knowingly collect their data.",
        ],
      },
      {
        h: "Your choices",
        p: [
          "You can clear the tools' local data any time by clearing site data in your browser, and manage cookies in your browser settings. Use the links above to manage advertising preferences.",
        ],
      },
      {
        h: "Changes",
        p: ["We may update this policy. The last-updated date is shown at the top of this page."],
      },
      {
        h: "Contact",
        p: [`For any privacy question, email ${CONTACT_EMAIL}.`],
      },
    ],
  };
}

export function termsDoc(locale: Locale): LegalDoc {
  if (locale === "ru") {
    return {
      title: "Условия использования",
      updated: UPDATED,
      intro: `Используя ${SITE_NAME} (iznkit.com), вы соглашаетесь с этими условиями.`,
      sections: [
        {
          h: "Сервис",
          p: [
            "iznkit предоставляет бесплатные онлайн-инструменты: калькуляторы и генераторы документов. Сервис предоставляется «как есть», без гарантий бесперебойной работы или отсутствия ошибок.",
          ],
        },
        {
          h: "Не профессиональная консультация",
          p: [
            "Документы и расчёты (счета, договоры, NDA, налоговые и финансовые калькуляторы и т.п.) — это шаблоны и оценки для удобства, а не юридическая, бухгалтерская, налоговая или финансовая консультация. Перед использованием в важных целях проверяйте результат и при необходимости обращайтесь к специалисту.",
          ],
        },
        {
          h: "Допустимое использование",
          p: [
            "Не используйте сайт незаконно, не пытайтесь нарушить его работу или безопасность, не выдавайте автоматически сгенерированные документы за официальные там, где это запрещено.",
          ],
        },
        {
          h: "Интеллектуальная собственность",
          p: [
            "Название, оформление и код сайта принадлежат его владельцу. Документы, которые вы создаёте с помощью инструментов и наполняете своими данными, принадлежат вам.",
          ],
        },
        {
          h: "Ограничение ответственности",
          p: [
            "Мы не несём ответственности за убытки, возникшие в результате использования сайта или созданных с его помощью документов, в пределах, допустимых законом.",
          ],
        },
        {
          h: "Изменения",
          p: ["Мы можем обновлять эти условия; дата изменения указана вверху страницы."],
        },
        {
          h: "Контакты",
          p: [`Вопросы — на ${CONTACT_EMAIL}.`],
        },
      ],
    };
  }
  return {
    title: "Terms of Service",
    updated: UPDATED,
    intro: `By using ${SITE_NAME} (iznkit.com) you agree to these terms.`,
    sections: [
      {
        h: "The service",
        p: [
          'iznkit provides free online tools: calculators and document generators. The service is provided "as is", without warranty of uninterrupted or error-free operation.',
        ],
      },
      {
        h: "Not professional advice",
        p: [
          "Documents and calculations (invoices, contracts, NDAs, tax and financial calculators, etc.) are templates and estimates for convenience — not legal, accounting, tax or financial advice. Review the output and consult a qualified professional before relying on it for anything important.",
        ],
      },
      {
        h: "Acceptable use",
        p: [
          "Don't use the site unlawfully, don't attempt to disrupt its operation or security, and don't present auto-generated documents as official where that is not permitted.",
        ],
      },
      {
        h: "Intellectual property",
        p: [
          "The site's name, design and code belong to its owner. Documents you create with the tools and fill with your own data belong to you.",
        ],
      },
      {
        h: "Limitation of liability",
        p: [
          "To the extent permitted by law, we are not liable for any loss arising from your use of the site or of documents created with it.",
        ],
      },
      {
        h: "Changes",
        p: ["We may update these terms; the last-updated date is shown at the top of this page."],
      },
      {
        h: "Contact",
        p: [`Questions: ${CONTACT_EMAIL}.`],
      },
    ],
  };
}
