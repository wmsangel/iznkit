import type { Locale } from "@/lib/i18n/config";

export interface GuideBody {
  title: string;
  /** meta description + card blurb */
  description: string;
  intro: string;
  sections: { h: string; p: (string | string[])[] }[];
  faq: { q: string; a: string }[];
  /** call-to-action label linking to the related tool */
  cta: string;
}

export interface Guide {
  slug: string;
  /** the tool this guide funnels readers to */
  toolSlug: string;
  updated: string;
  content: Record<Locale, GuideBody>;
}

const invoiceGuide: Guide = {
  slug: "how-to-make-an-invoice",
  toolSlug: "invoice",
  updated: "2026-08-18",
  content: {
    en: {
      title: "How to make an invoice (free template)",
      description:
        "A simple guide to creating a professional invoice — what to include, how to number it, and how to get paid faster. Free invoice generator included.",
      intro:
        "An invoice is a request for payment you send after delivering work or goods. A clear, professional invoice gets you paid faster and keeps your records straight. Here is exactly what to put on one — and a free tool to turn it into a clean PDF in about a minute.",
      sections: [
        {
          h: "What every invoice must include",
          p: [
            "A complete invoice has a handful of parts. Miss one and a client may delay payment or bounce it back:",
            [
              "Your name or company and contact details (and tax ID if you have one)",
              "The client's name and billing details",
              "A unique invoice number",
              "The issue date and the due date",
              "Line items: a description, quantity, unit price and amount for each",
              "The subtotal, any tax, and the grand total",
              "Payment details — how and by when to pay",
            ],
          ],
        },
        {
          h: "How to number your invoices",
          p: [
            "Give every invoice a unique, sequential number with no gaps — it keeps your bookkeeping and taxes clean and makes each invoice easy to reference. A common format is INV-0001, or a year prefix like 2026-001. Pick one style and stay consistent.",
          ],
        },
        {
          h: "Set clear payment terms",
          p: [
            "State a due date (for example “Net 14” or “Net 30” means payment is due 14 or 30 days after the issue date), which payment methods you accept, and any late fee. Clear, upfront terms are one of the simplest ways to get paid on time.",
          ],
        },
        {
          h: "Handle tax correctly",
          p: [
            "If you are registered for VAT or sales tax, show the rate and the tax amount as a separate line, and make sure the grand total includes it. If you are not registered, you usually leave tax off entirely — check the rules where you operate.",
          ],
        },
        {
          h: "Make it look professional",
          p: [
            "Presentation matters. Add your logo, use a clean layout, and send a PDF rather than an editable document — it looks reliable and can’t be accidentally changed. A tidy, branded invoice quietly tells a client you are organised and worth paying promptly.",
          ],
        },
      ],
      faq: [
        {
          q: "Do I need to be a registered business to send an invoice?",
          a: "No. Freelancers and individuals can invoice too — just include your own name and contact details instead of a company. Check your local rules on whether a tax ID is required.",
        },
        {
          q: "What's the difference between an invoice and a receipt?",
          a: "An invoice requests payment before it's made; a receipt confirms payment was received. Send the invoice first, then a receipt once the client has paid.",
        },
        {
          q: "How do I get paid faster?",
          a: "Send the invoice promptly, set a short and specific due date, offer easy payment methods, and follow up politely a few days before it's due.",
        },
      ],
      cta: "Create your invoice free",
    },
    ru: {
      title: "Как выставить инвойс (счёт): гайд и шаблон",
      description:
        "Простой гайд по созданию профессионального счёта (инвойса) — что указать, как нумеровать и как получать оплату быстрее. Плюс бесплатный генератор.",
      intro:
        "Инвойс (счёт) — это запрос на оплату, который вы отправляете после выполнения работы или поставки товара. Понятный, аккуратный счёт ускоряет оплату и держит учёт в порядке. Ниже — что именно на нём указать и бесплатный инструмент, который за минуту превратит его в чистый PDF.",
      sections: [
        {
          h: "Что обязательно должно быть в счёте",
          p: [
            "Полный счёт состоит из нескольких частей. Пропустите одну — и клиент может задержать оплату или вернуть документ:",
            [
              "Ваше имя или компания и контакты (и ИНН, если есть)",
              "Название и реквизиты клиента",
              "Уникальный номер счёта",
              "Дата выставления и срок оплаты",
              "Позиции: описание, количество, цена и сумма по каждой",
              "Подытог, налог (если есть) и итоговая сумма",
              "Реквизиты оплаты — как и до какого числа платить",
            ],
          ],
        },
        {
          h: "Как нумеровать счета",
          p: [
            "Каждому счёту — уникальный последовательный номер без пропусков: так проще вести учёт и налоги, и на любой счёт легко сослаться. Частые форматы: INV-0001 или с годом — 2026-001. Выберите один стиль и придерживайтесь его.",
          ],
        },
        {
          h: "Задайте понятные условия оплаты",
          p: [
            "Укажите срок оплаты (например, «Net 14» или «Net 30» — оплата в течение 14 или 30 дней с даты выставления), какие способы оплаты принимаете и штраф за просрочку, если есть. Чёткие условия заранее — простейший способ получать оплату вовремя.",
          ],
        },
        {
          h: "Правильно учтите налог",
          p: [
            "Если вы плательщик НДС, покажите ставку и сумму налога отдельной строкой и убедитесь, что итог её включает. Если налог не применяется — обычно его просто не указывают. Сверяйтесь с правилами вашей юрисдикции.",
          ],
        },
        {
          h: "Сделайте вид профессиональным",
          p: [
            "Подача важна. Добавьте логотип, используйте аккуратную вёрстку и отправляйте PDF, а не редактируемый документ — это выглядит надёжно и защищает от случайных правок. Опрятный брендированный счёт ненавязчиво говорит клиенту, что вы организованы и вам стоит платить вовремя.",
          ],
        },
      ],
      faq: [
        {
          q: "Нужно ли быть ИП или компанией, чтобы выставить счёт?",
          a: "Нет. Фрилансеры и физлица тоже могут выставлять счёт — просто укажите своё имя и контакты вместо компании. Уточните местные правила о необходимости ИНН.",
        },
        {
          q: "Чем счёт отличается от квитанции (чека)?",
          a: "Счёт запрашивает оплату до её совершения; квитанция подтверждает, что оплата получена. Сначала отправляют счёт, затем — квитанцию после оплаты.",
        },
        {
          q: "Как получать оплату быстрее?",
          a: "Отправляйте счёт сразу, ставьте короткий конкретный срок, предлагайте удобные способы оплаты и вежливо напоминайте за пару дней до срока.",
        },
      ],
      cta: "Создать счёт бесплатно",
    },
  },
};

const ndaGuide: Guide = {
  slug: "one-way-vs-mutual-nda",
  toolSlug: "nda",
  updated: "2026-08-18",
  content: {
    en: {
      title: "One-way vs mutual NDA: which do you need?",
      description:
        "A plain-English guide to non-disclosure agreements — one-way vs mutual, the clauses that matter, and how to create one free.",
      intro:
        "An NDA (non-disclosure agreement) is a contract that keeps shared information confidential. The first decision is direction: one-way or mutual. Here is how to choose, what a solid NDA includes, and how to generate a signature-ready one free.",
      sections: [
        {
          h: "One-way NDA",
          p: [
            "In a one-way (or unilateral) NDA, one party shares confidential information and the other agrees to protect it. Use it when only you disclose — for example, pitching an idea to a contractor, showing numbers to a potential investor, or handing work to a freelancer.",
          ],
        },
        {
          h: "Mutual NDA",
          p: [
            "In a mutual (or bilateral) NDA, both parties share and protect each other's information. Use it for partnerships, joint ventures, or any conversation where both sides will reveal something sensitive — it's the fairer choice when the exchange goes both ways.",
          ],
        },
        {
          h: "What a good NDA includes",
          p: [
            "Whichever direction you pick, a solid NDA covers the same essentials:",
            [
              "The parties to the agreement",
              "A clear definition of what counts as “confidential information”",
              "The purpose — why the information is being shared",
              "The term — how long the confidentiality obligation lasts",
              "Exclusions — public info, or what the other side already knew or developed independently",
              "The governing law and signature blocks",
            ],
          ],
        },
        {
          h: "How long should confidentiality last?",
          p: [
            "Most NDAs set a term of one to five years. Genuine trade secrets can be protected indefinitely. Match the term to how sensitive and long-lived the information really is — an unreasonably long term can make an NDA harder to enforce.",
          ],
        },
        {
          h: "Is an NDA legally binding?",
          p: [
            "Yes — once both parties sign, a clear and reasonable NDA is binding in most jurisdictions, and usually doesn't need to be notarized. This is general information, not legal advice: for high-stakes or unusual deals, have a qualified lawyer review it.",
          ],
        },
      ],
      faq: [
        {
          q: "Can I use an NDA template?",
          a: "Yes — a clear, standard template covers most everyday situations. For unusual or high-value deals, have a lawyer adapt it to your needs.",
        },
        {
          q: "Does an NDA need to be notarized?",
          a: "Usually not. A signature from each party is enough to make it binding in most jurisdictions.",
        },
        {
          q: "What can't an NDA protect?",
          a: "Information that is already public, that the other party already knew, or that they develop independently — standard NDAs explicitly exclude these.",
        },
      ],
      cta: "Create an NDA free",
    },
    ru: {
      title: "Одностороннее и взаимное NDA: какое нужно вам?",
      description:
        "Понятный гайд по соглашениям о неразглашении — одностороннее и взаимное NDA, какие пункты важны и как создать документ бесплатно.",
      intro:
        "NDA (соглашение о неразглашении) — это договор, который сохраняет переданную информацию конфиденциальной. Первый выбор — направление: одностороннее или взаимное. Ниже — как выбрать, что должно быть в хорошем NDA и как сгенерировать готовый к подписи документ бесплатно.",
      sections: [
        {
          h: "Одностороннее NDA",
          p: [
            "В одностороннем NDA одна сторона раскрывает конфиденциальную информацию, а другая обязуется её защищать. Подходит, когда раскрываете только вы — например, показываете идею подрядчику, цифры инвестору или передаёте работу фрилансеру.",
          ],
        },
        {
          h: "Взаимное NDA",
          p: [
            "Во взаимном NDA обе стороны раскрывают и защищают информацию друг друга. Подходит для партнёрств, совместных проектов и любых переговоров, где обе стороны делятся чем-то чувствительным — это честнее, когда обмен идёт в обе стороны.",
          ],
        },
        {
          h: "Что должно быть в хорошем NDA",
          p: [
            "Независимо от направления, в надёжном NDA есть одни и те же ключевые пункты:",
            [
              "Стороны соглашения",
              "Чёткое определение, что считается «конфиденциальной информацией»",
              "Цель — зачем передаётся информация",
              "Срок — как долго действует обязательство о неразглашении",
              "Исключения — публичная информация или то, что сторона уже знала или разработала сама",
              "Применимое право и блоки для подписей",
            ],
          ],
        },
        {
          h: "Как долго должна длиться конфиденциальность?",
          p: [
            "Чаще всего срок NDA — от одного до пяти лет. Настоящую коммерческую тайну можно защищать бессрочно. Соотносите срок с тем, насколько информация чувствительна и долговечна — необоснованно длинный срок может усложнить исполнение соглашения.",
          ],
        },
        {
          h: "Имеет ли NDA юридическую силу?",
          p: [
            "Да — после подписания обеими сторонами понятное и разумное NDA обязательно в большинстве юрисдикций и обычно не требует нотариуса. Это общая информация, а не юридическая консультация: для крупных или нестандартных сделок покажите документ квалифицированному юристу.",
          ],
        },
      ],
      faq: [
        {
          q: "Можно ли использовать шаблон NDA?",
          a: "Да — понятный стандартный шаблон покрывает большинство повседневных ситуаций. Для нестандартных или дорогих сделок попросите юриста адаптировать его под вас.",
        },
        {
          q: "Нужно ли заверять NDA у нотариуса?",
          a: "Обычно нет. В большинстве юрисдикций достаточно подписи каждой стороны, чтобы документ стал обязательным.",
        },
        {
          q: "Что NDA не может защитить?",
          a: "Информацию, которая уже публична, которую сторона уже знала или разработала самостоятельно — стандартные NDA прямо исключают такие случаи.",
        },
      ],
      cta: "Создать NDA бесплатно",
    },
  },
};

const passwordGuide: Guide = {
  slug: "how-to-create-a-strong-password",
  toolSlug: "password-generator",
  updated: "2026-08-18",
  content: {
    en: {
      title: "How to create a strong password",
      description:
        "What actually makes a password strong — length, randomness and entropy — plus the common mistakes to avoid and a free generator.",
      intro:
        "Most “strong” passwords aren't. What matters isn't really symbols and capital letters — it's length and true randomness. Here is how password strength actually works, and how to make one that resists guessing and brute force.",
      sections: [
        {
          h: "Length beats complexity",
          p: [
            "Every extra character multiplies the number of possible passwords, so length does more for security than sprinkling in symbols. A long random password is far harder to crack than a short “complex” one. Aim for at least 16 characters, and more for anything important.",
          ],
        },
        {
          h: "Randomness is everything",
          p: [
            "A password you invented isn't random — attackers use patterns, common substitutions and leaked wordlists to guess exactly the kind of password people think is clever. The only reliable fix is genuine randomness from a generator that uses your device's cryptographic random source.",
          ],
        },
        {
          h: "What is entropy?",
          p: [
            "Entropy measures how unpredictable a password is, in bits — and each extra bit doubles the number of possibilities. As a rough guide, around 60 bits is okay, 75+ is strong, and 100+ is very strong. A good generator shows the entropy so you can see the effect of length and character sets.",
          ],
        },
        {
          h: "Common mistakes to avoid",
          p: [
            [
              "Reusing the same password across sites — one breach then unlocks many accounts",
              "Basing it on a name, date or word",
              "Simple substitutions like P@ssw0rd — cracking tools know them all",
              "A short password, even a “complex” one",
            ],
          ],
        },
        {
          h: "Use a password manager",
          p: [
            "No one can remember dozens of long random passwords — and you shouldn't try. A password manager generates and stores a unique strong password for every account, so a leak on one site never touches the others. Generate the password, save it, and let the manager fill it in.",
          ],
        },
      ],
      faq: [
        {
          q: "Are random passwords safe if I can't remember them?",
          a: "Yes — store them in a password manager rather than memorising them. The important rule is never to reuse one password across sites.",
        },
        {
          q: "Do I need symbols in my password?",
          a: "They help, but length matters more. If a site won't accept symbols, add a few more characters to make up for it.",
        },
        {
          q: "How often should I change my password?",
          a: "Only when there's a reason — a breach, or a suspicion it was compromised. Forcing frequent changes tends to make passwords weaker, not stronger.",
        },
      ],
      cta: "Generate a strong password free",
    },
    ru: {
      title: "Как придумать надёжный пароль",
      description:
        "Что на самом деле делает пароль надёжным — длина, случайность и энтропия — плюс частые ошибки и бесплатный генератор.",
      intro:
        "Большинство «надёжных» паролей на деле слабые. Важны не столько символы и заглавные буквы, сколько длина и настоящая случайность. Ниже — как надёжность пароля работает на самом деле и как сделать пароль, устойчивый к подбору и перебору.",
      sections: [
        {
          h: "Длина важнее сложности",
          p: [
            "Каждый дополнительный символ умножает число возможных паролей, поэтому длина даёт больше, чем добавление символов. Длинный случайный пароль взломать куда труднее, чем короткий «сложный». Цельтесь минимум в 16 символов, а для важного — больше.",
          ],
        },
        {
          h: "Случайность решает всё",
          p: [
            "Пароль, который вы придумали, не случаен — атакующие используют шаблоны, типовые замены и утёкшие словари, чтобы угадать ровно то, что люди считают хитрым. Единственное надёжное решение — настоящая случайность из генератора, использующего криптостойкий источник случайности устройства.",
          ],
        },
        {
          h: "Что такое энтропия",
          p: [
            "Энтропия измеряет непредсказуемость пароля в битах — каждый дополнительный бит удваивает число вариантов. Грубо: около 60 бит — нормально, 75+ — надёжно, 100+ — очень надёжно. Хороший генератор показывает энтропию, чтобы видеть эффект длины и наборов символов.",
          ],
        },
        {
          h: "Частые ошибки",
          p: [
            [
              "Один и тот же пароль на разных сайтах — одна утечка открывает много аккаунтов",
              "Пароль на основе имени, даты или слова",
              "Простые замены вроде P@ssw0rd — инструменты подбора их знают",
              "Короткий пароль, даже «сложный»",
            ],
          ],
        },
        {
          h: "Используйте менеджер паролей",
          p: [
            "Никто не запомнит десятки длинных случайных паролей — и не нужно. Менеджер паролей создаёт и хранит уникальный надёжный пароль для каждого аккаунта, поэтому утечка на одном сайте не затрагивает другие. Сгенерируйте пароль, сохраните его и позвольте менеджеру подставлять его.",
          ],
        },
      ],
      faq: [
        {
          q: "Безопасны ли случайные пароли, если их не запомнить?",
          a: "Да — храните их в менеджере паролей, а не в памяти. Главное правило — никогда не переиспользовать один пароль на разных сайтах.",
        },
        {
          q: "Нужны ли символы в пароле?",
          a: "Они помогают, но длина важнее. Если сайт не принимает символы, добавьте ещё несколько символов длины взамен.",
        },
        {
          q: "Как часто менять пароль?",
          a: "Только при причине — утечке или подозрении на компрометацию. Принудительная частая смена обычно делает пароли слабее, а не сильнее.",
        },
      ],
      cta: "Сгенерировать надёжный пароль",
    },
  },
};

export const GUIDES: Guide[] = [invoiceGuide, ndaGuide, passwordGuide];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** The guide (if any) that a given tool funnels from — for tool → guide links. */
export function getGuideForTool(toolSlug: string): Guide | undefined {
  return GUIDES.find((g) => g.toolSlug === toolSlug);
}
