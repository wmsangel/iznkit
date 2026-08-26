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

const freelanceTaxGuide: Guide = {
  slug: "freelance-tax-explained",
  toolSlug: "self-employed-tax",
  updated: "2026-08-23",
  content: {
    en: {
      title: "Freelance and self-employed tax, explained",
      description:
        "How freelancers and the self-employed estimate tax and take-home pay — what's taxed, common regimes, and a free calculator.",
      intro:
        "When you work for yourself, no one withholds tax for you — you have to estimate it, set money aside, and know your real take-home before you price a job. Here's how self-employed tax works in plain terms, and a free calculator to run your numbers.",
      sections: [
        {
          h: "What gets taxed",
          p: [
            "Depending on your country's regime, tax is charged either on your income (your revenue) or on your profit (income minus business expenses). Some regimes tax a flat percentage of turnover; others tax profit at a progressive rate. The regime you're on changes both the rate and what it's applied to.",
          ],
        },
        {
          h: "Gross, tax, and take-home",
          p: [
            "Your take-home is your income minus tax (and minus expenses, if they aren't deductible). The effective rate — tax divided by gross income — is the real share you lose, and it can differ from the headline rate once expenses and thresholds are counted.",
          ],
        },
        {
          h: "Set money aside as you earn",
          p: [
            "Because tax isn't withheld, move a percentage of every payment into a separate account the moment it arrives. Estimating your rate up front tells you exactly how much to hold back so there's no nasty surprise at tax time.",
          ],
        },
        {
          h: "Price with tax in mind",
          p: [
            "Quote rates that leave you the take-home you actually need after tax and expenses — not your gross. Working backwards from your target take-home is the difference between a rate that looks fine and one that pays your bills.",
          ],
        },
        {
          h: "This is an estimate, not advice",
          p: [
            "Rules, thresholds and deductions vary by country and change over time. Use a calculator to plan and to sanity-check a price, but confirm the specifics with an accountant before you rely on a figure.",
          ],
        },
      ],
      faq: [
        {
          q: "How much should I set aside for tax?",
          a: "Enough to cover your estimated rate — often 10–30% depending on your regime. Estimate it first, then move that share of each payment into savings as it arrives.",
        },
        {
          q: "Is tax on my income or my profit?",
          a: "It depends on your regime. Some tax turnover (gross income), others tax profit (income minus expenses). The calculator lets you choose which applies.",
        },
        {
          q: "What's the effective tax rate?",
          a: "Your total tax divided by your gross income — the real percentage you lose, which can differ from the nominal rate once expenses and thresholds apply.",
        },
      ],
      cta: "Estimate your tax free",
    },
    ru: {
      title: "Налог самозанятого и фрилансера: как рассчитать",
      description:
        "Как самозанятому и фрилансеру оценить налог и сумму «на руки» — что облагается, режимы (НПД/НДФЛ) и бесплатный калькулятор.",
      intro:
        "Когда работаешь на себя, налог за тебя никто не удерживает — его нужно оценить, отложить и знать сумму «на руки» ещё до того, как назвать цену. Ниже — как устроен налог самозанятого простыми словами и бесплатный калькулятор, чтобы посчитать свои цифры.",
      sections: [
        {
          h: "Что облагается налогом",
          p: [
            "В зависимости от режима налог берётся либо с дохода (выручки), либо с прибыли (доход минус расходы). Например, НПД (самозанятость) облагает выручку по ставке 4/6%, а НДФЛ — доход по прогрессивной ставке. Режим меняет и ставку, и то, к чему она применяется.",
          ],
        },
        {
          h: "Доход, налог и «на руки»",
          p: [
            "«На руки» — это доход минус налог (и минус расходы, если они не вычитаются). Эффективная ставка — налог, делённый на весь доход — реальная доля, которую вы теряете, и она может отличаться от «номинальной» после учёта расходов и лимитов.",
          ],
        },
        {
          h: "Откладывайте по мере поступления",
          p: [
            "Раз налог не удерживают, откладывайте процент с каждого поступления на отдельный счёт сразу же. Оценка ставки заранее подсказывает, сколько именно держать в резерве, чтобы к сроку уплаты не было сюрпризов.",
          ],
        },
        {
          h: "Закладывайте налог в цену",
          p: [
            "Называйте ставки так, чтобы после налога и расходов оставалась нужная сумма «на руки», а не «грязными». Расчёт от целевой суммы на руки — это разница между ставкой, которая выглядит нормально, и ставкой, которая реально покрывает расходы.",
          ],
        },
        {
          h: "Это оценка, а не консультация",
          p: [
            "Правила, лимиты и вычеты зависят от страны/региона и со временем меняются. Используйте калькулятор для планирования и проверки цены, но детали уточняйте у бухгалтера, прежде чем полагаться на цифру.",
          ],
        },
      ],
      faq: [
        {
          q: "Сколько откладывать на налог?",
          a: "Столько, чтобы покрыть оценённую ставку — часто 4–15% в зависимости от режима. Сначала оцените ставку, затем откладывайте эту долю с каждого поступления.",
        },
        {
          q: "Налог с дохода или с прибыли?",
          a: "Зависит от режима. Часть режимов облагает выручку (НПД), часть — прибыль (доход минус расходы). В калькуляторе можно выбрать нужный вариант.",
        },
        {
          q: "Что такое эффективная ставка?",
          a: "Весь налог, делённый на весь доход — реальный процент, который вы теряете; он может отличаться от номинального при учёте расходов и лимитов.",
        },
      ],
      cta: "Рассчитать налог бесплатно",
    },
  },
};

const quoteGuide: Guide = {
  slug: "how-to-write-a-quote",
  toolSlug: "quote",
  updated: "2026-08-23",
  content: {
    en: {
      title: "How to write a quote clients say yes to",
      description:
        "What a good quote (estimate) includes, how to price and present it, and how to win the work — plus a free quote generator.",
      intro:
        "A quote (or estimate) is your pitch with a price on it. A clear, professional quote makes it easy for a client to say yes — and protects you from scope creep later. Here's what to put in one and how to present it.",
      sections: [
        {
          h: "Quote vs invoice",
          p: [
            "A quote proposes a price before the work; an invoice requests payment after it. A good quote states the scope and a valid-until date, so both sides agree on what's included and for how long the price holds.",
          ],
        },
        {
          h: "What a good quote includes",
          p: [
            "Cover the essentials so there's nothing to query:",
            [
              "Your details and the client's",
              "A quote number and the date",
              "A valid-until date",
              "Line items with clear descriptions and prices",
              "Subtotal, any tax, and the total",
              "The scope of work — and what's excluded",
              "Payment terms",
            ],
          ],
        },
        {
          h: "Price it with confidence",
          p: [
            "Quote the value, not just the hours. Break the work into line items so the client sees exactly what they're paying for — a single lump sum with no breakdown is harder to say yes to and easier to haggle down.",
          ],
        },
        {
          h: "Add a valid-until date",
          p: [
            "A quote that expires nudges a decision and protects you if your costs change. Two to four weeks is common. It also gives you a natural, non-pushy reason to follow up.",
          ],
        },
        {
          h: "Make it easy to accept",
          p: [
            "Send a clean PDF, state the next steps, and offer to answer questions. A tidy, branded quote signals you're organised and reliable — which is half the decision.",
          ],
        },
      ],
      faq: [
        {
          q: "What's the difference between a quote and an estimate?",
          a: "They're often used interchangeably. An estimate is a rough figure that may change; a quote is a firm price. Say which you mean, and add a valid-until date either way.",
        },
        {
          q: "Should a quote include tax?",
          a: "If you charge VAT or sales tax, show it as a separate line so the total is clear. If you're not registered for it, leave it off.",
        },
        {
          q: "Can I turn a quote into an invoice?",
          a: "Yes — once the client accepts, reuse the same line items in an invoice to bill them.",
        },
      ],
      cta: "Create a quote free",
    },
    ru: {
      title: "Как составить КП, на которое согласятся",
      description:
        "Что должно быть в хорошем коммерческом предложении (КП/смете), как оценить и подать его и как выиграть заказ — плюс бесплатный генератор.",
      intro:
        "КП (коммерческое предложение) — это ваша презентация с ценой. Понятное, аккуратное КП облегчает клиенту ответить «да» и защищает вас от расширения объёма позже. Ниже — что в нём указать и как подать.",
      sections: [
        {
          h: "КП и счёт — это разное",
          p: [
            "КП предлагает цену до работы; счёт запрашивает оплату после. В хорошем КП указаны объём работ и срок действия — чтобы обе стороны понимали, что входит и как долго держится цена.",
          ],
        },
        {
          h: "Что должно быть в хорошем КП",
          p: [
            "Закройте главное, чтобы не осталось вопросов:",
            [
              "Ваши данные и данные клиента",
              "Номер КП и дата",
              "Срок действия предложения",
              "Позиции с понятными описаниями и ценами",
              "Подытог, налог (если есть) и итог",
              "Объём работ — и что не входит",
              "Условия оплаты",
            ],
          ],
        },
        {
          h: "Оценивайте уверенно",
          p: [
            "Продавайте ценность, а не только часы. Разбейте работу на позиции — клиент видит, за что именно платит. Одна сумма без расшифровки хуже: на неё труднее согласиться и легче поторговаться.",
          ],
        },
        {
          h: "Добавьте срок действия",
          p: [
            "КП, которое истекает, подталкивает к решению и защищает вас при изменении затрат. Обычно 2–4 недели. Заодно это естественный, не навязчивый повод напомнить о себе.",
          ],
        },
        {
          h: "Упростите согласование",
          p: [
            "Отправьте чистый PDF, обозначьте следующие шаги, предложите ответить на вопросы. Аккуратное брендированное КП говорит, что вы организованы и надёжны — а это половина решения.",
          ],
        },
      ],
      faq: [
        {
          q: "Чем КП отличается от сметы?",
          a: "Часто используют как синонимы. Смета — примерная сумма, которая может измениться; КП — фиксированная цена. Уточните, что имеете в виду, и в любом случае добавьте срок действия.",
        },
        {
          q: "Указывать ли налог в КП?",
          a: "Если вы плательщик НДС — покажите его отдельной строкой, чтобы итог был понятен. Если не зарегистрированы — не указывайте.",
        },
        {
          q: "Можно ли превратить КП в счёт?",
          a: "Да — после согласия клиента перенесите те же позиции в счёт для выставления оплаты.",
        },
      ],
      cta: "Создать КП бесплатно",
    },
  },
};

const jwtGuide: Guide = {
  slug: "what-is-a-jwt",
  toolSlug: "jwt-decoder",
  updated: "2026-08-23",
  content: {
    en: {
      title: "What is a JWT? A plain-English guide",
      description:
        "What a JSON Web Token is, how its three parts work, when to use one, and a free decoder to inspect any token.",
      intro:
        "A JWT (JSON Web Token) is a compact, self-contained way to carry claims — like who a user is — between two parties, signed so it can't be tampered with. Here's how it's built and what each part does, with a free decoder to look inside any token.",
      sections: [
        {
          h: "The three parts",
          p: [
            "A JWT is three Base64URL parts separated by dots: a header (the signing algorithm and token type), a payload (the claims, like sub, iat and exp), and a signature (which proves the token wasn't changed). Only the signature needs the secret — the header and payload are just encoded.",
          ],
        },
        {
          h: "Encoded, not encrypted",
          p: [
            "This is the part people miss: a JWT's payload is readable by anyone who has the token — it's Base64, not encryption. Never put passwords, secrets or sensitive personal data in a JWT payload.",
          ],
        },
        {
          h: "Common claims",
          p: [
            "Standard fields you'll see in the payload:",
            [
              "sub — the subject (usually the user)",
              "iat — issued-at time",
              "exp — expiry time",
              "nbf — not valid before",
              "iss — the issuer",
              "aud — the intended audience",
            ],
            "iat, exp and nbf are Unix timestamps you can convert to a readable date.",
          ],
        },
        {
          h: "How signing works",
          p: [
            "The server signs the header and payload with a secret (HMAC) or a private key (RSA/EC). Anyone with the matching secret or public key can verify the signature — that's how a server trusts a token it receives without storing anything.",
          ],
        },
        {
          h: "When to use a JWT",
          p: [
            "Stateless authentication and authorization: after login the server issues a signed JWT, the client sends it with each request, and the server verifies it without a database lookup. Keep them short-lived and pair them with refresh tokens.",
          ],
        },
      ],
      faq: [
        {
          q: "Is a JWT secure?",
          a: "The signature makes it tamper-evident, but the payload is readable by anyone holding the token. Use HTTPS, keep tokens short-lived, and never store secrets inside them.",
        },
        {
          q: "Can I trust a decoded JWT?",
          a: "Decoding only reads the token — it does not verify the signature. To trust a token you must verify its signature with the secret or public key, which you should never paste into a public website.",
        },
        {
          q: "Why is my JWT expired?",
          a: "If the exp claim is in the past, the token has expired and should be rejected. Convert exp from a Unix timestamp to see the exact time it lapsed.",
        },
      ],
      cta: "Decode a JWT free",
    },
    ru: {
      title: "Что такое JWT? Понятный гайд",
      description:
        "Что такое JSON Web Token, как устроены его три части, когда его применять и бесплатный декодер для проверки любого токена.",
      intro:
        "JWT (JSON Web Token) — компактный самодостаточный способ передавать «утверждения» (например, кто пользователь) между двумя сторонами, подписанный так, что его нельзя подделать. Ниже — как он устроен и что делает каждая часть, плюс бесплатный декодер, чтобы заглянуть внутрь любого токена.",
      sections: [
        {
          h: "Три части",
          p: [
            "JWT — это три части Base64URL через точки: заголовок (алгоритм подписи и тип токена), payload (утверждения — sub, iat, exp) и подпись (доказывает, что токен не меняли). Секрет нужен только для подписи — заголовок и payload просто закодированы.",
          ],
        },
        {
          h: "Закодировано, а не зашифровано",
          p: [
            "Главное, что упускают: payload читается любым, у кого есть токен — это Base64, а не шифрование. Никогда не кладите в payload пароли, секреты или чувствительные персональные данные.",
          ],
        },
        {
          h: "Частые поля (claims)",
          p: [
            "Стандартные поля в payload:",
            [
              "sub — субъект (обычно пользователь)",
              "iat — время выпуска",
              "exp — время истечения",
              "nbf — недействителен ранее",
              "iss — издатель",
              "aud — целевая аудитория",
            ],
            "iat, exp и nbf — это Unix-метки времени, их можно перевести в читаемую дату.",
          ],
        },
        {
          h: "Как работает подпись",
          p: [
            "Сервер подписывает заголовок и payload секретом (HMAC) или приватным ключом (RSA/EC). Любой с подходящим секретом или публичным ключом может проверить подпись — так сервер доверяет полученному токену, ничего не храня.",
          ],
        },
        {
          h: "Когда применять JWT",
          p: [
            "Аутентификация и авторизация без состояния: после входа сервер выдаёт подписанный JWT, клиент шлёт его с каждым запросом, а сервер проверяет без обращения к базе. Держите их короткоживущими и сочетайте с refresh-токенами.",
          ],
        },
      ],
      faq: [
        {
          q: "JWT — это безопасно?",
          a: "Подпись делает подделку заметной, но payload читается любым, у кого есть токен. Используйте HTTPS, короткое время жизни и никогда не храните секреты внутри.",
        },
        {
          q: "Можно ли доверять декодированному JWT?",
          a: "Декодирование только читает токен — оно не проверяет подпись. Чтобы доверять токену, нужно проверить подпись секретом или публичным ключом, которые нельзя вставлять на публичном сайте.",
        },
        {
          q: "Почему JWT «истёк»?",
          a: "Если поле exp в прошлом, токен истёк и должен отклоняться. Переведите exp из Unix-времени, чтобы увидеть точный момент истечения.",
        },
      ],
      cta: "Декодировать JWT бесплатно",
    },
  },
};

const hashGuide: Guide = {
  slug: "what-is-hashing",
  toolSlug: "hash",
  updated: "2026-08-26",
  content: {
    en: {
      title: "What is hashing? SHA-256 in plain English",
      description:
        "How a hash function works — one-way, fixed-length and deterministic — what SHA-256 is for, and a free tool to hash any text.",
      intro:
        "A hash function turns any input — a word, a file, a password — into a short fixed-length string of characters. The same input always gives the same hash, but you can't reverse it back to the original. Here's what that's good for, how the SHA family fits in, and a free tool to hash any text yourself.",
      sections: [
        {
          h: "What a hash actually is",
          p: [
            "A hash is a fingerprint of data. Feed in a million-word book or a single letter and a hash function returns a fixed-length value — SHA-256 always returns 64 hex characters, no matter the input size. It's built to be fast to compute one way and practically impossible to reverse.",
          ],
        },
        {
          h: "Three properties that make it useful",
          p: [
            "Every good cryptographic hash has three traits:",
            [
              "Deterministic — the same input always produces the same hash",
              "One-way — you can't work backwards from the hash to the input",
              "Collision-resistant — it's infeasible to find two inputs with the same hash",
            ],
            "Change a single character of the input and the hash changes completely — this is the avalanche effect, and it's why hashes are good at detecting even tiny tampering.",
          ],
        },
        {
          h: "Hashing is not encryption",
          p: [
            "This is the point people mix up. Encryption is two-way: with the key you can decrypt it back to the original. Hashing is one-way — there is no key and no “unhash”. So a hash is for verifying data, not for storing something you need to read back later.",
          ],
        },
        {
          h: "The SHA family",
          p: [
            "SHA (Secure Hash Algorithm) is a family of standard hash functions. SHA-256, SHA-384 and SHA-512 are part of SHA-2 and are the modern default — the number is the output size in bits. SHA-1 is older and considered weak for security use, so treat it as legacy: fine for a non-security checksum, not for anything that must resist attackers.",
          ],
        },
        {
          h: "What hashing is used for",
          p: [
            [
              "File integrity — publish a checksum so a download can be verified as unmodified",
              "Password storage — sites store a hash, not your actual password (with a salt, see below)",
              "Digital signatures and certificates — the data is hashed, then the hash is signed",
              "Deduplication and quick comparisons — compare short hashes instead of large files",
            ],
          ],
        },
        {
          h: "Why passwords need a salt",
          p: [
            "Hashing a password plainly isn't enough — attackers precompute hashes of common passwords (rainbow tables) and match them instantly. A salt is a unique random value added to each password before hashing, so identical passwords get different hashes and precomputed tables are useless. Real password systems also use a slow, purpose-built function like bcrypt or Argon2 rather than a plain fast SHA.",
          ],
        },
      ],
      faq: [
        {
          q: "Can a hash be reversed?",
          a: "No — hashing is one-way by design. You can only confirm a guess by hashing it and comparing. So-called “hash decrypters” are just databases of precomputed hashes for common inputs, not actual reversal.",
        },
        {
          q: "Which SHA should I use?",
          a: "For anything security-related, use SHA-256 or stronger (SHA-384/512). Avoid SHA-1 except for non-security checksums, and never rely on it where an attacker could try to forge a match.",
        },
        {
          q: "Is it safe to hash text on a website?",
          a: "Hashing itself is safe, but never paste real secrets or passwords into any online tool. Our generator runs in your browser, but the safe habit is to hash only non-sensitive text or test data.",
        },
      ],
      cta: "Hash any text free",
    },
    ru: {
      title: "Что такое хеширование? SHA-256 простыми словами",
      description:
        "Как работает хеш-функция — односторонняя, фиксированной длины, детерминированная — зачем нужен SHA-256 и бесплатный инструмент для хеширования текста.",
      intro:
        "Хеш-функция превращает любой ввод — слово, файл, пароль — в короткую строку фиксированной длины. Один и тот же ввод всегда даёт один и тот же хеш, но обратно к исходнику его не развернуть. Ниже — зачем это нужно, при чём тут семейство SHA и бесплатный инструмент, чтобы захешировать любой текст самому.",
      sections: [
        {
          h: "Что такое хеш на самом деле",
          p: [
            "Хеш — это отпечаток данных. Подайте на вход книгу в миллион слов или одну букву — хеш-функция вернёт значение фиксированной длины: SHA-256 всегда выдаёт 64 hex-символа независимо от размера входа. Он устроен так, чтобы быстро считаться в одну сторону и практически не разворачиваться обратно.",
          ],
        },
        {
          h: "Три свойства, которые делают его полезным",
          p: [
            "У любой хорошей криптографической хеш-функции три черты:",
            [
              "Детерминированность — один и тот же ввод всегда даёт один и тот же хеш",
              "Односторонность — из хеша нельзя восстановить исходный ввод",
              "Стойкость к коллизиям — практически невозможно найти два входа с одинаковым хешем",
            ],
            "Измените один символ входа — и хеш меняется полностью. Это лавинный эффект, из-за него хеши хорошо ловят даже крошечные изменения данных.",
          ],
        },
        {
          h: "Хеширование — это не шифрование",
          p: [
            "Именно здесь чаще всего путаются. Шифрование двустороннее: с ключом можно расшифровать обратно в исходник. Хеширование одностороннее — ключа нет и «расхешировать» нельзя. Поэтому хеш нужен, чтобы проверять данные, а не хранить то, что потом нужно прочитать.",
          ],
        },
        {
          h: "Семейство SHA",
          p: [
            "SHA (Secure Hash Algorithm) — семейство стандартных хеш-функций. SHA-256, SHA-384 и SHA-512 входят в SHA-2 и сегодня являются выбором по умолчанию — число означает длину результата в битах. SHA-1 старше и считается слабым для защиты, поэтому относитесь к нему как к легаси: годится для несекьюрити-контрольной суммы, но не для того, что должно противостоять атакующим.",
          ],
        },
        {
          h: "Где применяют хеширование",
          p: [
            [
              "Целостность файлов — публикуют контрольную сумму, чтобы проверить, что загрузка не изменена",
              "Хранение паролей — сайты хранят хеш, а не сам пароль (с солью, см. ниже)",
              "Цифровые подписи и сертификаты — данные хешируют, а затем подписывают хеш",
              "Дедупликация и быстрые сравнения — сравнивают короткие хеши вместо больших файлов",
            ],
          ],
        },
        {
          h: "Зачем паролю нужна соль",
          p: [
            "Просто захешировать пароль недостаточно — атакующие заранее считают хеши популярных паролей (радужные таблицы) и мгновенно находят совпадение. Соль — это уникальное случайное значение, добавляемое к каждому паролю перед хешированием, поэтому одинаковые пароли дают разные хеши, а заранее посчитанные таблицы бесполезны. Настоящие системы хранения паролей используют медленную специализированную функцию — bcrypt или Argon2, а не быстрый обычный SHA.",
          ],
        },
      ],
      faq: [
        {
          q: "Можно ли развернуть хеш обратно?",
          a: "Нет — хеширование одностороннее по замыслу. Догадку можно только проверить: захешировать и сравнить. «Расшифровщики хешей» — это просто базы заранее посчитанных хешей для популярных входов, а не настоящее обращение.",
        },
        {
          q: "Какой SHA выбрать?",
          a: "Для всего, что связано с безопасностью, — SHA-256 или сильнее (SHA-384/512). SHA-1 — только для несекьюрити-контрольных сумм, и никогда там, где атакующий может попытаться подделать совпадение.",
        },
        {
          q: "Безопасно ли хешировать текст на сайте?",
          a: "Само хеширование безопасно, но никогда не вставляйте реальные секреты и пароли в онлайн-инструменты. Наш генератор работает у вас в браузере, но безопасная привычка — хешировать только нечувствительный текст или тестовые данные.",
        },
      ],
      cta: "Захешировать текст бесплатно",
    },
  },
};

export const GUIDES: Guide[] = [
  invoiceGuide,
  ndaGuide,
  passwordGuide,
  freelanceTaxGuide,
  quoteGuide,
  jwtGuide,
  hashGuide,
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

/** The guide (if any) that a given tool funnels from — for tool → guide links. */
export function getGuideForTool(toolSlug: string): Guide | undefined {
  return GUIDES.find((g) => g.toolSlug === toolSlug);
}
