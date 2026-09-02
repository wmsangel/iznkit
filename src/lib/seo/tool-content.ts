import type { Locale } from "@/lib/i18n/config";

export interface FaqItem {
  q: string;
  a: string;
}

export interface ToolContent {
  /** One-paragraph SEO intro shown under the tool. */
  intro: string;
  /** Short benefit bullets. */
  benefits: string[];
  /** "How it works" ordered steps. */
  steps: string[];
  /** FAQ — also emitted as FAQPage JSON-LD. */
  faq: FaqItem[];
  /** "Who it's for" scenarios. */
  useCases: string[];
  /** Extra keyword-rich sentence for meta description fallback. */
  metaExtra: string;
}

type Content = Record<Locale, ToolContent>;

const invoice: Content = {
  en: {
    intro:
      "Create a professional invoice online and download it as a clean PDF in under a minute. This free invoice generator is built for freelancers, contractors, and small businesses who need a good-looking, ready-to-send invoice without signing up or installing anything. Fill in your details, add line items, set a tax rate, and watch the live preview update instantly.",
    benefits: [
      "No sign-up, no account — start typing and download",
      "Add your own logo and pick from multiple currencies",
      "Automatic subtotal, tax, and total calculation",
      "Clean, branded PDF you can email straight to your client",
      "Your draft is saved in your browser, not on our servers",
    ],
    steps: [
      "Enter your details and your client's billing information.",
      "Add line items with quantity and unit price — totals update live.",
      "Set the invoice number, dates, currency, and optional tax rate.",
      "Preview it for free, then unlock a clean PDF for a small one-time fee.",
    ],
    faq: [
      {
        q: "Is the invoice generator free?",
        a: "Yes — building the invoice and previewing it is completely free. You only pay a small one-time fee when you want to download the clean, watermark-free PDF.",
      },
      {
        q: "Do I need to create an account?",
        a: "No. There is no sign-up. Your invoice draft is stored locally in your browser, so nothing is uploaded until you generate the PDF.",
      },
      {
        q: "Can I add my company logo?",
        a: "Yes. Upload a logo (PNG or JPG) and it appears in the invoice header, both in the live preview and in the downloaded PDF.",
      },
      {
        q: "Which currencies are supported?",
        a: "USD, EUR, GBP, RUB and several more. Pick your currency from the dropdown and every amount is formatted accordingly.",
      },
      {
        q: "Does it work in Russian?",
        a: "Yes. The whole tool and the generated PDF are fully bilingual (English and Russian), including Cyrillic text and the ruble symbol.",
      },
    ],
    useCases: [
      "Freelancers and contractors billing clients per project or per hour",
      "Small agencies and studios sending monthly retainers",
      "Online sellers and consultants who need a quick one-off invoice",
      "Anyone who wants a branded invoice without accounting software",
    ],
    metaExtra:
      "Free online invoice generator with logo, tax, multiple currencies and instant PDF download.",
  },
  ru: {
    intro:
      "Создайте профессиональный счёт (инвойс) онлайн и скачайте его чистым PDF меньше чем за минуту. Этот бесплатный генератор счетов сделан для фрилансеров, самозанятых и малого бизнеса, которым нужен аккуратный, готовый к отправке счёт без регистрации и установки программ. Заполните реквизиты, добавьте позиции, укажите ставку налога — и следите за живым превью, которое обновляется мгновенно.",
    benefits: [
      "Без регистрации и аккаунта — просто заполняйте и скачивайте",
      "Свой логотип и выбор из нескольких валют",
      "Автоматический расчёт подытога, налога и итоговой суммы",
      "Чистый брендированный PDF — можно сразу отправить клиенту",
      "Черновик хранится в вашем браузере, а не на наших серверах",
    ],
    steps: [
      "Укажите свои данные и реквизиты клиента.",
      "Добавьте позиции с количеством и ценой — суммы считаются на лету.",
      "Задайте номер счёта, даты, валюту и при необходимости ставку налога.",
      "Посмотрите превью бесплатно, затем разблокируйте чистый PDF за небольшую разовую плату.",
    ],
    faq: [
      {
        q: "Генератор счетов бесплатный?",
        a: "Да — собрать счёт и посмотреть превью можно совершенно бесплатно. Небольшая разовая плата берётся только за скачивание чистого PDF без водяного знака.",
      },
      {
        q: "Нужно ли регистрироваться?",
        a: "Нет. Регистрации нет. Черновик счёта хранится локально в вашем браузере, ничего не загружается на сервер до момента генерации PDF.",
      },
      {
        q: "Можно ли добавить логотип компании?",
        a: "Да. Загрузите логотип (PNG или JPG) — он появится в шапке счёта и в превью, и в скачанном PDF.",
      },
      {
        q: "Какие валюты поддерживаются?",
        a: "USD, EUR, GBP, RUB и ещё несколько. Выберите валюту из списка — все суммы отформатируются соответственно.",
      },
      {
        q: "Работает ли на русском?",
        a: "Да. Весь инструмент и итоговый PDF полностью двуязычные (русский и английский), включая кириллицу и символ рубля.",
      },
    ],
    useCases: [
      "Фрилансеры и самозанятые, выставляющие счета за проект или час",
      "Небольшие агентства и студии на ежемесячных платежах",
      "Продавцы и консультанты, которым нужен разовый счёт",
      "Все, кому нужен брендированный счёт без бухгалтерской программы",
    ],
    metaExtra:
      "Бесплатный онлайн генератор счёта (инвойса) — создать инвойс с логотипом, налогом, валютами и мгновенно скачать PDF.",
  },
};

const rentalYield: Content = {
  en: {
    intro:
      "Work out whether a property is worth buying to rent out. This rental yield calculator turns the purchase price, expected rent, running costs, and an optional mortgage into the numbers that actually matter: gross yield, net yield (cap rate), monthly cash flow, cash-on-cash return, and payback period. See the result instantly and download a clean PDF report to keep or share.",
    benefits: [
      "Gross and net rental yield in one place",
      "Monthly cash flow after expenses and mortgage",
      "Cash-on-cash return and simple payback period",
      "Accounts for vacancy, running costs, and one-off purchase costs",
      "Downloadable PDF report for your records or your agent",
    ],
    steps: [
      "Enter the purchase price and one-off buying costs.",
      "Add the expected monthly rent and your running costs.",
      "Optionally add a mortgage (down payment, rate, term).",
      "Read the yields and cash flow, then download the PDF report.",
    ],
    faq: [
      {
        q: "What is a good rental yield?",
        a: "It depends on the market, but many investors look for a gross yield above 5–7%. What matters more is the net yield after costs and your monthly cash flow — this calculator shows both.",
      },
      {
        q: "What's the difference between gross and net yield?",
        a: "Gross yield is annual rent divided by the property price. Net yield (cap rate) subtracts running costs and vacancy first, so it reflects what you actually keep.",
      },
      {
        q: "What is cash-on-cash return?",
        a: "It's your annual pre-tax cash flow divided by the cash you actually put in (down payment plus buying costs). It shows the return on the money you invested, not the full price.",
      },
      {
        q: "Does it include the mortgage?",
        a: "Yes, optionally. Add the down payment, interest rate, and term, and the calculator factors the loan repayment into your monthly cash flow and cash-on-cash return.",
      },
    ],
    useCases: [
      "First-time buy-to-let investors comparing properties",
      "Landlords checking whether to keep or sell a rental",
      "Agents showing clients the numbers behind a listing",
      "Anyone weighing a mortgage against renting the place out",
    ],
    metaExtra:
      "Free rental yield calculator: gross and net yield, cash flow, cash-on-cash and payback with a PDF report.",
  },
  ru: {
    intro:
      "Разберитесь, стоит ли покупать квартиру под сдачу. Этот калькулятор доходности аренды превращает цену покупки, ожидаемую арендную плату, расходы и (по желанию) ипотеку в цифры, которые действительно важны: валовую и чистую доходность, ежемесячный денежный поток, доходность на вложенные средства (cash-on-cash) и срок окупаемости. Результат виден сразу, а чистый PDF-отчёт можно скачать и сохранить или отправить.",
    benefits: [
      "Валовая и чистая доходность аренды в одном месте",
      "Ежемесячный денежный поток после расходов и ипотеки",
      "Доходность на вложенные средства и срок окупаемости",
      "Учёт простоя, текущих расходов и разовых затрат на покупку",
      "PDF-отчёт для себя или для риелтора",
    ],
    steps: [
      "Укажите цену покупки и разовые расходы на сделку.",
      "Добавьте ожидаемую месячную аренду и текущие расходы.",
      "При желании добавьте ипотеку (первый взнос, ставку, срок).",
      "Посмотрите доходность и денежный поток, затем скачайте PDF-отчёт.",
    ],
    faq: [
      {
        q: "Какая доходность аренды считается хорошей?",
        a: "Зависит от рынка, но многие инвесторы ориентируются на валовую доходность выше 5–7%. Важнее чистая доходность после расходов и ваш ежемесячный денежный поток — калькулятор показывает и то, и другое.",
      },
      {
        q: "Чем отличается валовая доходность от чистой?",
        a: "Валовая доходность — это годовая аренда, делённая на цену объекта. Чистая доходность (cap rate) сначала вычитает расходы и простой, поэтому отражает то, что вы реально оставляете себе.",
      },
      {
        q: "Что такое доходность на вложенные средства (cash-on-cash)?",
        a: "Это годовой денежный поток до налогов, делённый на реально вложенные деньги (первый взнос плюс расходы на покупку). Показывает отдачу на вложенные средства, а не на полную стоимость.",
      },
      {
        q: "Учитывается ли ипотека?",
        a: "Да, по желанию. Добавьте первый взнос, ставку и срок — калькулятор учтёт платёж по кредиту в денежном потоке и в доходности на вложенные средства.",
      },
    ],
    useCases: [
      "Начинающие инвесторы, сравнивающие квартиры под сдачу",
      "Собственники, решающие — держать или продать",
      "Риелторы, показывающие клиенту цифры по объекту",
      "Все, кто взвешивает ипотеку против сдачи в аренду",
    ],
    metaExtra:
      "Бесплатный калькулятор доходности аренды: валовая и чистая доходность, денежный поток, окупаемость и PDF-отчёт.",
  },
};

const nda: Content = {
  en: {
    intro:
      "Create a non-disclosure agreement in minutes. This NDA generator fills a clear, proven template with your parties, purpose, term and governing law, and hands you a signed-ready PDF — one-way or mutual. Ideal for early conversations with contractors, partners, and potential clients before anything confidential changes hands.",
    benefits: [
      "One-way or mutual NDA from a single form",
      "Plain-English clauses covering the essentials",
      "Your parties, purpose, term and jurisdiction filled in",
      "Signature blocks and a clean, printable PDF",
      "Bilingual (English and Russian), Cyrillic included",
    ],
    steps: [
      "Choose one-way or mutual, then enter both parties.",
      "Describe the purpose and set the confidentiality term.",
      "Add the effective date and governing law.",
      "Preview for free, then unlock the clean PDF to sign.",
    ],
    faq: [
      {
        q: "Is this NDA legally binding?",
        a: "It's a solid, commonly used template that becomes binding once both parties sign. It is not legal advice — for high-stakes deals, have a qualified lawyer review it.",
      },
      {
        q: "What's the difference between one-way and mutual?",
        a: "A one-way NDA protects information one party shares; a mutual NDA protects information both parties share. Toggle 'Mutual NDA' to switch.",
      },
      {
        q: "Can I set how long confidentiality lasts?",
        a: "Yes. Set the term in months — the agreement states how long the obligations remain in effect from the effective date.",
      },
      {
        q: "Does it work under Russian law?",
        a: "You can set any governing law or jurisdiction, and the whole document (including Cyrillic) renders correctly in Russian.",
      },
    ],
    useCases: [
      "Freelancers and contractors before sharing work or code",
      "Startups talking to potential partners or investors",
      "Agencies onboarding a new client or subcontractor",
      "Anyone sharing an idea before a formal agreement",
    ],
    metaExtra:
      "Free NDA generator, creator and maker — create a one-way or mutual non-disclosure agreement with clear clauses and a signed-ready PDF.",
  },
  ru: {
    intro:
      "Создайте соглашение о неразглашении за минуты. Этот генератор NDA заполняет понятный проверенный шаблон вашими сторонами, целью, сроком и применимым правом и выдаёт готовый к подписанию PDF — одностороннее или взаимное. Идеально для первых переговоров с подрядчиками, партнёрами и потенциальными клиентами до передачи конфиденциальной информации.",
    benefits: [
      "Одностороннее или взаимное NDA из одной формы",
      "Понятные пункты, покрывающие главное",
      "Ваши стороны, цель, срок и юрисдикция подставляются",
      "Блоки для подписей и чистый PDF для печати",
      "Двуязычно (русский и английский), с кириллицей",
    ],
    steps: [
      "Выберите одностороннее или взаимное, укажите обе стороны.",
      "Опишите цель и задайте срок конфиденциальности.",
      "Добавьте дату вступления в силу и применимое право.",
      "Посмотрите превью бесплатно, затем разблокируйте чистый PDF для подписи.",
    ],
    faq: [
      {
        q: "Имеет ли это NDA юридическую силу?",
        a: "Это надёжный распространённый шаблон, который становится обязательным после подписания обеими сторонами. Это не юридическая консультация — для важных сделок покажите документ квалифицированному юристу.",
      },
      {
        q: "Чем отличается одностороннее от взаимного?",
        a: "Одностороннее NDA защищает информацию, которую раскрывает одна сторона; взаимное — информацию обеих сторон. Переключите «Взаимное NDA».",
      },
      {
        q: "Можно ли задать срок конфиденциальности?",
        a: "Да. Укажите срок в месяцах — в соглашении будет указано, как долго действуют обязательства с даты вступления в силу.",
      },
      {
        q: "Подойдёт ли под российское право?",
        a: "Вы можете указать любое применимое право и юрисдикцию, а весь документ (включая кириллицу) корректно отображается на русском.",
      },
    ],
    useCases: [
      "Фрилансеры и подрядчики перед передачей работы или кода",
      "Стартапы в переговорах с партнёрами или инвесторами",
      "Агентства при подключении клиента или субподрядчика",
      "Все, кто делится идеей до формального договора",
    ],
    metaExtra:
      "Бесплатный генератор NDA: одностороннее или взаимное соглашение о неразглашении с понятными пунктами и готовым PDF.",
  },
};

const inspection: Content = {
  en: {
    intro:
      "Write a clean inspection report on the spot. Add what you checked with a status, snap or upload photos with captions, and get a consistent, professional PDF — ideal for property handovers, vehicle checks, equipment audits and site visits. Everything stays on your device until you download.",
    benefits: [
      "Checklist with OK / Issue / N/A statuses",
      "Attach photos with captions, resized automatically",
      "Object, inspector, date and report number filled in",
      "A tidy, signature-ready PDF report",
      "Bilingual (English and Russian), Cyrillic included",
    ],
    steps: [
      "Enter the object, inspector and report details.",
      "Add checklist items and mark each OK, Issue or N/A.",
      "Attach photos and caption them.",
      "Write a summary, preview free, then download the PDF.",
    ],
    faq: [
      {
        q: "Can I add photos to the report?",
        a: "Yes — upload up to ten photos with captions. They're downscaled in your browser so the PDF stays small, and embedded directly in the report.",
      },
      {
        q: "Where are my photos stored?",
        a: "Only in your browser while you work. Nothing is uploaded to a server until you generate the PDF, and photos aren't kept in the saved draft.",
      },
      {
        q: "What is it good for?",
        a: "Apartment and property handovers, rental move-in/move-out, vehicle condition checks, equipment and site inspections — anywhere you need a documented, photo-backed report.",
      },
      {
        q: "Does it work in Russian?",
        a: "Yes. The tool and the generated PDF (акт осмотра) are fully bilingual, including Cyrillic text.",
      },
    ],
    useCases: [
      "Landlords and agents documenting handovers",
      "Car buyers and sellers recording condition",
      "Contractors and surveyors on site visits",
      "Anyone who needs a photo-backed report",
    ],
    metaExtra:
      "Free inspection report generator with a checklist and photos — a clean, signature-ready PDF (акт осмотра).",
  },
  ru: {
    intro:
      "Составьте аккуратный акт осмотра прямо на месте. Добавьте, что проверяли, со статусом, приложите фото с подписями — и получите единый профессиональный PDF. Идеально для приёмки жилья, осмотра авто, проверки оборудования и выездов на объект. Всё остаётся на вашем устройстве до момента скачивания.",
    benefits: [
      "Чек-лист со статусами Норма / Замечание / Н/П",
      "Фото с подписями, автоматически уменьшаются",
      "Объект, осматривающий, дата и номер акта — в шапке",
      "Аккуратный PDF-акт с местом для подписи",
      "Двуязычно (русский и английский), с кириллицей",
    ],
    steps: [
      "Укажите объект, кто осматривал и реквизиты акта.",
      "Добавьте позиции чек-листа и отметьте Норма/Замечание/Н/П.",
      "Приложите фотографии и подпишите их.",
      "Напишите заключение, посмотрите превью и скачайте PDF.",
    ],
    faq: [
      {
        q: "Можно ли добавить фото в акт?",
        a: "Да — до десяти фотографий с подписями. Они уменьшаются прямо в браузере, чтобы PDF оставался лёгким, и встраиваются в акт.",
      },
      {
        q: "Где хранятся мои фото?",
        a: "Только в вашем браузере во время работы. Ничего не загружается на сервер до генерации PDF, а в сохранённый черновик фото не попадают.",
      },
      {
        q: "Для чего это подходит?",
        a: "Приёмка квартиры и жилья, заезд/выезд арендатора, осмотр авто, проверка оборудования и объектов — везде, где нужен документ с фотофиксацией.",
      },
      {
        q: "Работает ли на русском?",
        a: "Да. Инструмент и итоговый PDF (акт осмотра) полностью двуязычны, включая кириллицу.",
      },
    ],
    useCases: [
      "Собственники и риелторы при приёмке-передаче",
      "Покупатели и продавцы авто — фиксация состояния",
      "Подрядчики и инженеры на выездах",
      "Все, кому нужен акт с фотофиксацией",
    ],
    metaExtra:
      "Бесплатный генератор акта осмотра с чек-листом и фото — аккуратный PDF с местом для подписи.",
  },
};

const hourly: Content = {
  en: {
    intro:
      "Stop guessing your freelance rate. This calculator works backwards from the income you actually want to keep — factoring in tax, business expenses, time off and a profit buffer — to the hourly and day rate you should charge. Set your target, your billable hours, and see the number in real time.",
    benefits: [
      "Rate derived from your real take-home goal",
      "Accounts for tax, expenses and unpaid time",
      "Hourly and day rate, plus yearly revenue target",
      "Adjustable profit buffer so you're not scraping by",
      "A tidy PDF you can keep or share with a client",
    ],
    steps: [
      "Enter the yearly income you want to keep.",
      "Add business expenses and your tax rate.",
      "Set billable hours per week and working weeks per year.",
      "Read your rate, then download the PDF.",
    ],
    faq: [
      {
        q: "Why is my rate higher than my salary equivalent?",
        a: "Freelancers pay their own tax and expenses and don't bill every hour. This calculator grosses your take-home goal up for all of that, which is why the rate looks higher than an hourly salary.",
      },
      {
        q: "What should I put for billable hours?",
        a: "Only the hours you actually invoice — admin, marketing and breaks aren't billable. Many full-time freelancers bill 20–30 hours a week, not 40.",
      },
      {
        q: "What's the profit buffer for?",
        a: "It's a margin on top so slow months, bad debt and surprises don't wipe out your target. A 10–20% buffer is a sensible starting point.",
      },
    ],
    useCases: [
      "New freelancers setting their first rate",
      "Contractors deciding whether a project pays enough",
      "Anyone raising rates and wanting the target number",
      "Agencies sanity-checking a day rate",
    ],
    metaExtra:
      "Free hourly rate calculator for freelancers — find the rate that hits your income goal after tax and expenses.",
  },
  ru: {
    intro:
      "Хватит гадать со ставкой. Калькулятор идёт от дохода, который вы реально хотите оставить себе — с учётом налога, расходов на дело, отпуска и запаса прибыли — к часовой и дневной ставке, которую стоит выставлять. Задайте цель и оплачиваемые часы и смотрите цифру в реальном времени.",
    benefits: [
      "Ставка от реальной цели «на руки»",
      "Учитывает налог, расходы и неоплачиваемое время",
      "Часовая и дневная ставка плюс цель по выручке",
      "Настраиваемый запас прибыли, чтобы не выживать",
      "Аккуратный PDF — сохранить или показать клиенту",
    ],
    steps: [
      "Укажите желаемый доход в год «чистыми».",
      "Добавьте расходы на дело и ставку налога.",
      "Задайте оплачиваемые часы в неделю и рабочие недели.",
      "Посмотрите ставку и скачайте PDF.",
    ],
    faq: [
      {
        q: "Почему ставка выше, чем «как в найме»?",
        a: "Фрилансер сам платит налог и расходы и оплачивает не каждый час. Калькулятор «догоняет» вашу цель на руки под всё это — поэтому ставка выше почасовой зарплаты.",
      },
      {
        q: "Сколько ставить оплачиваемых часов?",
        a: "Только те, что реально выставляете в счёт — админка, маркетинг и перерывы не в счёт. Многие фрилансеры на фултайме бьют 20–30 часов в неделю, а не 40.",
      },
      {
        q: "Зачем запас прибыли?",
        a: "Это margin сверху, чтобы простои, неплатежи и сюрпризы не съели цель. 10–20% — разумная точка старта.",
      },
    ],
    useCases: [
      "Начинающие фрилансеры и первая ставка",
      "Подрядчики: хватает ли денег в проекте",
      "Все, кто поднимает ставку и хочет цифру-цель",
      "Агентства — проверить дневную ставку",
    ],
    metaExtra:
      "Бесплатный калькулятор часовой ставки для фрилансеров — ставка под вашу цель по доходу после налога и расходов.",
  },
};

const tax: Content = {
  en: {
    intro:
      "See what you actually keep. This freelance tax estimator takes your income and expenses, applies a regime or your own rate, and shows the tax, your take-home and your effective rate. Pick a quick preset or type any rate — great for pricing, budgeting and setting money aside.",
    benefits: [
      "Tax, after-tax income and take-home at a glance",
      "Quick presets or your own custom rate",
      "Choose tax on gross or on profit",
      "Monthly or yearly view",
      "A clean PDF estimate to keep",
    ],
    steps: [
      "Pick a regime preset or enter your own rate.",
      "Enter your income and expenses.",
      "Choose whether expenses reduce the taxable base.",
      "Read the take-home, then download the PDF.",
    ],
    faq: [
      {
        q: "Is this official tax advice?",
        a: "No — it's a planning estimate. Real rules, thresholds and deductions vary by country and change over time. Confirm the specifics with an accountant.",
      },
      {
        q: "Should expenses be deducted?",
        a: "It depends on your regime. Some tax the gross income (turn the toggle off); profit-based regimes tax income minus expenses (turn it on).",
      },
      {
        q: "What's the effective rate?",
        a: "Your tax divided by your gross income — the real share of your income that goes to tax, which can differ from the headline rate once expenses are involved.",
      },
    ],
    useCases: [
      "Self-employed and freelancers estimating tax",
      "Pricing a project with tax in mind",
      "Setting aside the right amount each month",
      "Comparing regimes before registering",
    ],
    metaExtra:
      "Free freelance tax estimate — tax, take-home and effective rate with quick regime presets.",
  },
  ru: {
    intro:
      "Посмотрите, сколько реально останется. Калькулятор берёт доход и расходы, применяет режим или вашу ставку и показывает налог, сумму «на руки» и эффективную ставку. Выберите быстрый пресет или впишите любую ставку — удобно для ценообразования, бюджета и откладывания на налог.",
    benefits: [
      "Налог, доход после налога и «на руки» сразу",
      "Быстрые пресеты или своя ставка",
      "Налог с оборота или с прибыли",
      "Вид за месяц или за год",
      "Чистый PDF-расчёт на память",
    ],
    steps: [
      "Выберите пресет режима или впишите свою ставку.",
      "Укажите доход и расходы.",
      "Выберите, уменьшают ли расходы налоговую базу.",
      "Посмотрите «на руки» и скачайте PDF.",
    ],
    faq: [
      {
        q: "Это официальная налоговая консультация?",
        a: "Нет — это оценка для планирования. Реальные правила, лимиты и вычеты зависят от страны и меняются. Уточняйте детали у бухгалтера.",
      },
      {
        q: "Вычитать ли расходы?",
        a: "Зависит от режима. Часть режимов облагает весь доход (выключите переключатель); режимы «с прибыли» облагают доход за вычетом расходов (включите).",
      },
      {
        q: "Что такое эффективная ставка?",
        a: "Это налог, делённый на весь доход — реальная доля дохода, уходящая на налог, которая может отличаться от «номинальной» ставки при учёте расходов.",
      },
    ],
    useCases: [
      "Самозанятые и фрилансеры — оценка налога",
      "Цена проекта с учётом налога",
      "Откладывать нужную сумму каждый месяц",
      "Сравнить режимы до регистрации",
    ],
    metaExtra:
      "Калькулятор налога самозанятого и фрилансера — рассчитать онлайн НДФЛ/НПД, сумму «на руки» и эффективную ставку. Бесплатно.",
  },
};

const receipt: Content = {
  en: {
    intro:
      "Give your customer a clean receipt the moment they pay. This receipt generator turns a few details — who paid, for what, how, and how much — into a tidy, branded PDF with a clear PAID mark. No sign-up, no spreadsheet; just fill in and download.",
    benefits: [
      "A clear PAID proof-of-payment your customer trusts",
      "Cash, card or bank transfer — your payment method shown",
      "Add your logo and pick from multiple currencies",
      "Automatic line totals and optional tax",
      "Your draft stays in your browser, not on our servers",
    ],
    steps: [
      "Enter who received the payment and who paid.",
      "Add the items, quantities and prices.",
      "Set the receipt number, date and payment method.",
      "Preview for free, then download the clean PDF.",
    ],
    faq: [
      {
        q: "What's the difference between a receipt and an invoice?",
        a: "An invoice requests payment; a receipt confirms it was paid. This tool marks the document PAID and shows the payment method, so it works as proof of payment.",
      },
      {
        q: "Is it free?",
        a: "Building and previewing is free. A small one-time fee unlocks the clean, watermark-free PDF.",
      },
      {
        q: "Can I add my logo and currency?",
        a: "Yes — upload a logo and choose from USD, EUR, GBP, RUB and more. Everything is formatted for you.",
      },
    ],
    useCases: [
      "Freelancers confirming a client's payment",
      "Small shops and market sellers giving receipts",
      "Landlords issuing a rent-received receipt",
      "Anyone who needs proof a payment was made",
    ],
    metaExtra:
      "Free receipt generator — a clean, branded proof-of-payment PDF with a PAID mark and payment method.",
  },
  ru: {
    intro:
      "Выдайте клиенту аккуратную квитанцию сразу после оплаты. Генератор превращает несколько полей — кто платил, за что, как и сколько — в опрятный брендированный PDF с пометкой «ОПЛАЧЕНО». Без регистрации и таблиц: заполните и скачайте.",
    benefits: [
      "Понятное подтверждение оплаты с пометкой «ОПЛАЧЕНО»",
      "Наличные, карта или перевод — способ оплаты в чеке",
      "Свой логотип и выбор из нескольких валют",
      "Автоматический расчёт сумм и налог по желанию",
      "Черновик хранится в браузере, а не на серверах",
    ],
    steps: [
      "Укажите, кто получил оплату и кто платил.",
      "Добавьте позиции, количество и цены.",
      "Задайте номер, дату и способ оплаты.",
      "Посмотрите превью бесплатно и скачайте чистый PDF.",
    ],
    faq: [
      {
        q: "Чем квитанция отличается от счёта?",
        a: "Счёт запрашивает оплату, квитанция подтверждает, что оплата получена. Инструмент помечает документ «ОПЛАЧЕНО» и показывает способ оплаты — это подтверждение платежа.",
      },
      {
        q: "Это бесплатно?",
        a: "Собрать и посмотреть — бесплатно. Небольшая разовая плата снимает водяной знак и даёт чистый PDF.",
      },
      {
        q: "Можно логотип и валюту?",
        a: "Да — загрузите логотип и выберите USD, EUR, GBP, RUB и другие. Всё форматируется автоматически.",
      },
    ],
    useCases: [
      "Фрилансеры — подтвердить оплату клиента",
      "Магазины и продавцы на рынке — выдать чек",
      "Арендодатели — квитанция о получении аренды",
      "Все, кому нужно подтверждение оплаты",
    ],
    metaExtra:
      "Бесплатный генератор чека — аккуратный брендированный PDF с пометкой «ОПЛАЧЕНО» и способом оплаты.",
  },
};

const utm: Content = {
  en: {
    intro:
      "Build clean, consistent UTM links so your analytics actually make sense. Fill in the URL and campaign tags, and get a properly encoded, trackable link you can paste into ads, emails and posts. Free, no sign-up, and your recent links stay in your browser.",
    benefits: [
      "Correctly encoded utm_source, medium, campaign, term, content",
      "One consistent format across your whole team",
      "Copy in one click, open to test instantly",
      "Recent links saved locally for reuse",
      "Completely free — no account, no limits",
    ],
    steps: [
      "Paste your destination URL.",
      "Add the source and medium (and campaign if you have one).",
      "Copy the tracked link.",
      "Use it in your ad, email or post.",
    ],
    faq: [
      {
        q: "What are UTM parameters?",
        a: "They're tags added to a URL (utm_source, utm_medium, utm_campaign…) that tell analytics tools where your traffic came from, so you can measure each channel.",
      },
      {
        q: "Which fields are required?",
        a: "A URL and a source at minimum. Medium and campaign are strongly recommended; term and content are optional, often used for paid search and A/B tests.",
      },
      {
        q: "Is my data uploaded anywhere?",
        a: "No. Links are built in your browser and your recent list is stored locally — nothing is sent to a server.",
      },
    ],
    useCases: [
      "Marketers tagging ad and email campaigns",
      "Founders tracking where signups come from",
      "Teams standardizing link formats",
      "Anyone measuring a social post's traffic",
    ],
    metaExtra:
      "Free UTM link builder — create consistent, trackable campaign URLs with correct utm parameters.",
  },
  ru: {
    intro:
      "Собирайте чистые единые UTM-ссылки, чтобы аналитика была понятной. Заполните URL и метки кампании — получите корректно закодированную отслеживаемую ссылку для рекламы, писем и постов. Бесплатно, без регистрации, недавние ссылки хранятся в браузере.",
    benefits: [
      "Корректные utm_source, medium, campaign, term, content",
      "Единый формат на всю команду",
      "Копирование в один клик, открытие для проверки",
      "Недавние ссылки сохраняются локально",
      "Полностью бесплатно — без аккаунта и лимитов",
    ],
    steps: [
      "Вставьте целевой URL.",
      "Укажите источник и канал (и кампанию, если есть).",
      "Скопируйте ссылку с метками.",
      "Используйте в рекламе, письме или посте.",
    ],
    faq: [
      {
        q: "Что такое UTM-метки?",
        a: "Это метки в URL (utm_source, utm_medium, utm_campaign…), которые показывают аналитике, откуда пришёл трафик, чтобы измерять каждый канал.",
      },
      {
        q: "Какие поля обязательны?",
        a: "Минимум — URL и источник. Канал и кампанию очень желательно указать; term и content необязательны, их часто используют для платного поиска и A/B-тестов.",
      },
      {
        q: "Данные куда-то загружаются?",
        a: "Нет. Ссылки собираются в браузере, недавние хранятся локально — ничего не отправляется на сервер.",
      },
    ],
    useCases: [
      "Маркетологи — метки для рекламы и рассылок",
      "Основатели — откуда приходят регистрации",
      "Команды — единый формат ссылок",
      "Все, кто измеряет трафик поста",
    ],
    metaExtra:
      "Бесплатный UTM-генератор ссылок — единые отслеживаемые URL с корректными utm-параметрами.",
  },
};

const quote: Content = {
  en: {
    intro:
      "Win the work with a quote that looks the part. This quote and estimate generator turns your scope, line items and price into a clean, branded PDF with a clear total and a valid-until date — the kind of proposal clients say yes to. Free to build, a small fee to download.",
    benefits: [
      "Professional, branded PDF quote in minutes",
      "Line items with automatic totals and optional tax",
      "A valid-until date that nudges a decision",
      "Space for scope, timeline and payment terms",
      "Your logo, 12 currencies, fully bilingual",
    ],
    steps: [
      "Name the project and add your client.",
      "List the work as line items with prices.",
      "Set the quote number, date and valid-until.",
      "Add your terms, preview free, then download.",
    ],
    faq: [
      {
        q: "What's the difference between a quote and an invoice?",
        a: "A quote proposes a price before the work; an invoice requests payment after. This tool is built for quotes and estimates, with a valid-until date and a terms section.",
      },
      {
        q: "Can I turn a quote into an invoice later?",
        a: "Yes — reuse the same line items in the invoice generator to bill the client once the work is agreed.",
      },
      {
        q: "Is it free?",
        a: "Building and previewing is free. A small one-time fee unlocks the clean, watermark-free PDF.",
      },
    ],
    useCases: [
      "Freelancers quoting a project scope",
      "Agencies and studios sending proposals",
      "Trades and services estimating a job",
      "Anyone pricing work before starting",
    ],
    metaExtra:
      "Free quote & estimate generator — a branded PDF proposal with line items, tax, valid-until date and terms.",
  },
  ru: {
    intro:
      "Выигрывайте заказы с КП, которое выглядит солидно. Генератор сметы и КП превращает объём работ, позиции и цену в аккуратный брендированный PDF с понятным итогом и сроком действия — предложение, на которое легко ответить «да». Собрать бесплатно, скачать — за небольшую плату.",
    benefits: [
      "Профессиональное брендированное КП за минуты",
      "Позиции с авторасчётом и налогом по желанию",
      "Срок действия предложения подталкивает к решению",
      "Место для объёма, сроков и условий оплаты",
      "Ваш логотип, 12 валют, полностью двуязычно",
    ],
    steps: [
      "Назовите проект и укажите клиента.",
      "Перечислите работы позициями с ценами.",
      "Задайте номер КП, дату и срок действия.",
      "Добавьте условия, посмотрите превью и скачайте.",
    ],
    faq: [
      {
        q: "Чем КП отличается от счёта?",
        a: "КП предлагает цену до работы; счёт запрашивает оплату после. Этот инструмент — для смет и КП, со сроком действия и разделом условий.",
      },
      {
        q: "Можно ли потом сделать из КП счёт?",
        a: "Да — перенесите те же позиции в генератор счёта, когда работа согласована.",
      },
      {
        q: "Это бесплатно?",
        a: "Собрать и посмотреть — бесплатно. Небольшая разовая плата снимает водяной знак.",
      },
    ],
    useCases: [
      "Фрилансеры — КП по объёму проекта",
      "Агентства и студии — коммерческие предложения",
      "Услуги и подряд — смета на работу",
      "Все, кто оценивает работу до старта",
    ],
    metaExtra:
      "Бесплатный генератор сметы и КП — брендированный PDF с позициями, налогом, сроком действия и условиями.",
  },
};

const sig: Content = {
  en: {
    intro:
      "Give every email a polished, professional sign-off. This free email signature generator builds a clean, mobile-friendly HTML signature from your details — name, role, contacts, photo and an accent colour — that you copy straight into Gmail, Outlook or Apple Mail. No sign-up, nothing uploaded.",
    benefits: [
      "Clean, consistent signature for you or your team",
      "Copy the rendered signature or the raw HTML",
      "Photo or logo, links and an accent colour",
      "Works in Gmail, Outlook and Apple Mail",
      "Completely free — no account, nothing to install",
    ],
    steps: [
      "Fill in your name, role and contact details.",
      "Add a photo and pick an accent colour.",
      "Copy the signature (or the HTML code).",
      "Paste it into your email client's signature settings.",
    ],
    faq: [
      {
        q: "How do I add it to Gmail?",
        a: "Copy the signature, then go to Gmail → Settings → General → Signature, and paste it into the box. For Outlook, use 'Copy HTML code' and paste into the signature editor.",
      },
      {
        q: "Is my photo uploaded anywhere?",
        a: "No. The signature is built entirely in your browser and your details are stored locally — nothing is sent to a server.",
      },
      {
        q: "Is it really free?",
        a: "Yes, completely — no account and no limits. Copy as many signatures as you like.",
      },
    ],
    useCases: [
      "Freelancers and founders branding their email",
      "Teams standardizing a signature format",
      "New hires setting up their mail",
      "Anyone wanting a tidier email sign-off",
    ],
    metaExtra:
      "Free email signature generator — a clean HTML signature for Gmail, Outlook and Apple Mail, copy in one click.",
  },
  ru: {
    intro:
      "Пусть каждое письмо заканчивается аккуратно и профессионально. Бесплатный генератор подписи собирает чистую адаптивную HTML-подпись из ваших данных — имя, должность, контакты, фото и акцентный цвет — которую вы вставляете прямо в Gmail, Outlook или Apple Mail. Без регистрации, ничего не загружается.",
    benefits: [
      "Аккуратная единая подпись для вас или команды",
      "Копируйте готовую подпись или сырой HTML",
      "Фото или логотип, ссылки и акцентный цвет",
      "Работает в Gmail, Outlook и Apple Mail",
      "Полностью бесплатно — без аккаунта и установки",
    ],
    steps: [
      "Заполните имя, должность и контакты.",
      "Добавьте фото и выберите акцентный цвет.",
      "Скопируйте подпись (или HTML-код).",
      "Вставьте в настройки подписи почтового клиента.",
    ],
    faq: [
      {
        q: "Как добавить в Gmail?",
        a: "Скопируйте подпись, откройте Gmail → Настройки → Общие → Подпись и вставьте в поле. Для Outlook используйте «Скопировать HTML-код» и вставьте в редактор подписи.",
      },
      {
        q: "Фото куда-то загружается?",
        a: "Нет. Подпись собирается прямо в браузере, данные хранятся локально — ничего не отправляется на сервер.",
      },
      {
        q: "Правда бесплатно?",
        a: "Да, полностью — без аккаунта и лимитов. Копируйте сколько угодно подписей.",
      },
    ],
    useCases: [
      "Фрилансеры и основатели — брендинг письма",
      "Команды — единый формат подписи",
      "Новые сотрудники — настройка почты",
      "Все, кто хочет аккуратную подпись",
    ],
    metaExtra:
      "Бесплатный генератор подписи для почты — чистая HTML-подпись для Gmail, Outlook и Apple Mail, копирование в клик.",
  },
};

const adroi: Content = {
  en: {
    intro:
      "Know whether your advertising makes money, not just noise. This ad ROI calculator turns spend, revenue and your margin into ROAS, ROI, profit and the break-even ROAS you need to clear — so you can scale what works and cut what doesn't. Download a clean report to share with your team or client.",
    benefits: [
      "ROAS and true ROI in one view",
      "Profit after margin and spend, not just revenue",
      "Break-even ROAS so you know your floor",
      "Works for any channel — search, social, email",
      "A shareable PDF report for clients and reports",
    ],
    steps: [
      "Enter your ad spend and the revenue it drove.",
      "Add your gross margin and any other costs.",
      "Read ROAS, ROI and your break-even.",
      "Download the PDF report.",
    ],
    faq: [
      {
        q: "What's the difference between ROAS and ROI?",
        a: "ROAS is revenue divided by spend — it ignores costs. ROI is profit (after margin and spend) divided by spend, so it tells you whether you actually made money.",
      },
      {
        q: "What is break-even ROAS?",
        a: "The revenue per unit of spend you need just to cover costs, given your margin. Below it you lose money; above it you profit. It's 1 ÷ gross margin.",
      },
      {
        q: "Which margin should I use?",
        a: "Your gross margin — the share of revenue left after the cost of the product or service, before ad spend. That's what your ads have to cover.",
      },
    ],
    useCases: [
      "Marketers judging a campaign's real return",
      "Founders deciding whether to scale spend",
      "Agencies reporting ROI to clients",
      "Anyone comparing channels by profit, not revenue",
    ],
    metaExtra:
      "Free ad ROI calculator — ROAS, ROI, profit and break-even ROAS, with a PDF report.",
  },
  ru: {
    intro:
      "Понимайте, зарабатывает ли реклама, а не просто шумит. Калькулятор ROI рекламы превращает расходы, выручку и вашу маржу в ROAS, ROI, прибыль и ROAS безубыточности — чтобы масштабировать рабочее и резать убыточное. Скачайте чистый отчёт для команды или клиента.",
    benefits: [
      "ROAS и настоящий ROI в одном месте",
      "Прибыль после маржи и расходов, а не только выручка",
      "ROAS безубыточности — ваша нижняя граница",
      "Для любого канала — поиск, соцсети, email",
      "PDF-отчёт для клиентов и отчётности",
    ],
    steps: [
      "Укажите расходы на рекламу и выручку с неё.",
      "Добавьте валовую маржу и прочие расходы.",
      "Смотрите ROAS, ROI и точку безубыточности.",
      "Скачайте PDF-отчёт.",
    ],
    faq: [
      {
        q: "Чем ROAS отличается от ROI?",
        a: "ROAS — это выручка, делённая на расходы, без учёта себестоимости. ROI — прибыль (после маржи и расходов), делённая на расходы, то есть реально ли вы заработали.",
      },
      {
        q: "Что такое ROAS безубыточности?",
        a: "Выручка на единицу расходов, нужная лишь чтобы покрыть затраты при вашей марже. Ниже — минус, выше — плюс. Это 1 ÷ валовая маржа.",
      },
      {
        q: "Какую маржу брать?",
        a: "Валовую — долю выручки после себестоимости товара/услуги, до рекламы. Именно её реклама и должна покрыть.",
      },
    ],
    useCases: [
      "Маркетологи — реальная отдача кампании",
      "Основатели — масштабировать ли бюджет",
      "Агентства — отчёт ROI клиенту",
      "Все, кто сравнивает каналы по прибыли",
    ],
    metaExtra:
      "Бесплатный калькулятор ROI рекламы — ROAS, ROI, прибыль и ROAS безубыточности, с PDF-отчётом.",
  },
};

const unitEcon: Content = {
  en: {
    intro:
      "Find out what you really keep on every sale. This marketplace unit economics calculator takes your price, product cost, commission, logistics, fees, ads, tax and returns — and shows profit per unit, margin, ROI, your break-even price and profit adjusted for returns. Built for Wildberries, Ozon, Amazon and any marketplace.",
    benefits: [
      "Profit and margin per unit, after every fee",
      "Break-even price so you never sell at a loss",
      "Return-adjusted profit, not just the best case",
      "Commission, logistics, ads and tax in one place",
      "A clean PDF report for suppliers or partners",
    ],
    steps: [
      "Enter your sell price and product cost.",
      "Add commission, logistics, packaging and fees.",
      "Add ads per unit, tax and your return rate.",
      "Read profit and margin, then download the report.",
    ],
    faq: [
      {
        q: "Does it work for Wildberries and Ozon?",
        a: "Yes — enter each marketplace's commission, logistics and tax, and it works for WB, Ozon, Yandex Market, Amazon or any platform. Fees change often, so check the current numbers.",
      },
      {
        q: "How are returns handled?",
        a: "The return-adjusted profit assumes returned units lose their margin and cost you the return shipping, so you see a realistic figure, not just the best case.",
      },
      {
        q: "What is the break-even price?",
        a: "The lowest price at which profit is zero, given your costs and percentage fees. Below it, every sale loses money.",
      },
    ],
    useCases: [
      "Marketplace sellers pricing a new product",
      "Deciding whether an item is worth stocking",
      "Comparing platforms by real profit",
      "Sanity-checking a supplier's numbers",
    ],
    metaExtra:
      "Free marketplace unit economics calculator (WB, Ozon, Amazon) — profit per unit, margin, ROI and break-even, with a PDF report.",
  },
  ru: {
    intro:
      "Узнайте, сколько реально остаётся с каждой продажи. Калькулятор юнит-экономики берёт цену, себестоимость, комиссию, логистику, сборы, рекламу, налог и возвраты — и показывает прибыль с единицы, маржу, ROI, цену безубыточности и прибыль с учётом возвратов. Для Wildberries, Ozon, Amazon и любой площадки.",
    benefits: [
      "Прибыль и маржа с единицы — после всех сборов",
      "Цена безубыточности, чтобы не продавать в минус",
      "Прибыль с учётом возвратов, а не идеальный случай",
      "Комиссия, логистика, реклама и налог в одном месте",
      "Чистый PDF-отчёт для поставщиков и партнёров",
    ],
    steps: [
      "Укажите цену продажи и себестоимость.",
      "Добавьте комиссию, логистику, упаковку и сборы.",
      "Добавьте рекламу на единицу, налог и процент возвратов.",
      "Смотрите прибыль и маржу, скачайте отчёт.",
    ],
    faq: [
      {
        q: "Подходит для Wildberries и Ozon?",
        a: "Да — впишите комиссию, логистику и налог площадки, и работает для WB, Ozon, Яндекс Маркета, Amazon и любой платформы. Сборы часто меняются — сверяйтесь с актуальными.",
      },
      {
        q: "Как учитываются возвраты?",
        a: "Прибыль с учётом возвратов считает, что возвращённые единицы теряют маржу и стоят вам обратной логистики — так вы видите реалистичную цифру, а не лучший случай.",
      },
      {
        q: "Что такое цена безубыточности?",
        a: "Минимальная цена, при которой прибыль равна нулю с учётом затрат и процентных сборов. Ниже — каждая продажа в минус.",
      },
    ],
    useCases: [
      "Продавцы маркетплейсов — цена нового товара",
      "Стоит ли вообще заводить позицию",
      "Сравнение площадок по реальной прибыли",
      "Проверка цифр поставщика",
    ],
    metaExtra:
      "Бесплатный калькулятор юнит-экономики (WB, Ozon, Amazon) — прибыль с единицы, маржа, ROI и безубыточность, с PDF-отчётом.",
  },
};

const po: Content = {
  en: {
    intro:
      "Order from a supplier without the back-and-forth. This purchase order generator turns your buyer and supplier details, line items and a delivery date into a clean, numbered PO you can send and reference. Free to build, a small fee to download the clean PDF.",
    benefits: [
      "A numbered PO your supplier can act on",
      "Buyer and supplier details, delivery date and terms",
      "Line items with automatic totals and optional tax",
      "Your logo and 12 currencies, fully bilingual",
      "Your draft stays in your browser",
    ],
    steps: [
      "Enter your company and the supplier.",
      "List what you're ordering with quantities and prices.",
      "Set the PO number, date and delivery date.",
      "Add terms, preview free, then download.",
    ],
    faq: [
      {
        q: "What is a purchase order?",
        a: "A purchase order (PO) is a document a buyer sends to a supplier to confirm an order — what, how much, at what price and by when. It becomes a binding order once the supplier accepts it.",
      },
      {
        q: "How is it different from an invoice?",
        a: "The buyer issues a PO to order goods; the supplier later issues an invoice to request payment. This tool creates the PO.",
      },
      {
        q: "Is it free?",
        a: "Building and previewing is free. A small one-time fee unlocks the clean, watermark-free PDF.",
      },
    ],
    useCases: [
      "Small businesses ordering stock or supplies",
      "Agencies procuring services from vendors",
      "Anyone who needs a paper trail for an order",
      "Buyers standardizing how they order",
    ],
    metaExtra:
      "Free purchase order generator — a clean, numbered PO PDF with buyer, supplier, items, tax and delivery date.",
  },
  ru: {
    intro:
      "Заказывайте у поставщика без лишней переписки. Генератор превращает данные покупателя и поставщика, позиции и дату поставки в аккуратный пронумерованный заказ, который можно отправить и на который удобно ссылаться. Собрать бесплатно, скачать чистый PDF — за небольшую плату.",
    benefits: [
      "Пронумерованный заказ, понятный поставщику",
      "Данные сторон, дата поставки и условия",
      "Позиции с авторасчётом и налогом по желанию",
      "Ваш логотип, 12 валют, полностью двуязычно",
      "Черновик хранится в вашем браузере",
    ],
    steps: [
      "Укажите вашу компанию и поставщика.",
      "Перечислите заказ с количеством и ценами.",
      "Задайте номер, дату и дату поставки.",
      "Добавьте условия, посмотрите превью и скачайте.",
    ],
    faq: [
      {
        q: "Что такое заказ поставщику?",
        a: "Это документ, который покупатель отправляет поставщику, чтобы подтвердить заказ — что, сколько, по какой цене и к какому сроку. После принятия поставщиком становится обязательным заказом.",
      },
      {
        q: "Чем отличается от счёта?",
        a: "Покупатель выставляет заказ, чтобы заказать товар; поставщик потом выставляет счёт на оплату. Этот инструмент создаёт заказ.",
      },
      {
        q: "Это бесплатно?",
        a: "Собрать и посмотреть — бесплатно. Небольшая разовая плата снимает водяной знак.",
      },
    ],
    useCases: [
      "Малый бизнес — заказ товара и расходников",
      "Агентства — закупка услуг у подрядчиков",
      "Все, кому нужен след по заказу",
      "Покупатели — единый формат заказов",
    ],
    metaExtra:
      "Бесплатный генератор заказа поставщику — аккуратный пронумерованный PDF с данными сторон, позициями, налогом и датой поставки.",
  },
};

const qr: Content = {
  en: {
    intro:
      "Turn any link, text or Wi-Fi detail into a scannable QR code in seconds. Type your content, pick a colour and size, and download a crisp PNG or a scalable SVG for print. Free, no sign-up, and nothing leaves your browser.",
    benefits: [
      "QR for links, plain text and more",
      "Custom colour and size",
      "Download a sharp PNG or a vector SVG",
      "Great for menus, posters, packaging and cards",
      "Free — no account, nothing uploaded",
    ],
    steps: [
      "Paste a link or type your text.",
      "Choose a colour and size.",
      "Download the PNG or SVG.",
      "Print it or share it anywhere.",
    ],
    faq: [
      {
        q: "Do the QR codes expire?",
        a: "No. These are static QR codes — they encode your content directly, so they never expire and don't rely on any redirect or account.",
      },
      {
        q: "PNG or SVG — which should I use?",
        a: "Use PNG for screens and quick sharing, and SVG for print or large formats, since it stays sharp at any size.",
      },
      {
        q: "Is my data uploaded anywhere?",
        a: "No. The QR code is generated entirely in your browser — nothing is sent to a server.",
      },
    ],
    useCases: [
      "Restaurants linking to a digital menu",
      "Shops and packaging pointing to a page",
      "Posters and flyers with a scannable link",
      "Business cards and events",
    ],
    metaExtra:
      "Free QR code generator — make a QR for a link or text, custom colour and size, download PNG or SVG.",
  },
  ru: {
    intro:
      "Превратите любую ссылку, текст или данные Wi-Fi в сканируемый QR-код за секунды. Введите содержимое, выберите цвет и размер и скачайте чёткий PNG или масштабируемый SVG для печати. Бесплатно, без регистрации, ничего не покидает браузер.",
    benefits: [
      "QR для ссылок, текста и не только",
      "Свой цвет и размер",
      "Скачивание чёткого PNG или векторного SVG",
      "Для меню, плакатов, упаковки и визиток",
      "Бесплатно — без аккаунта, ничего не загружается",
    ],
    steps: [
      "Вставьте ссылку или введите текст.",
      "Выберите цвет и размер.",
      "Скачайте PNG или SVG.",
      "Распечатайте или поделитесь где угодно.",
    ],
    faq: [
      {
        q: "QR-коды не «протухают»?",
        a: "Нет. Это статические QR-коды — они кодируют содержимое напрямую, поэтому не имеют срока и не зависят от редиректов или аккаунта.",
      },
      {
        q: "PNG или SVG — что выбрать?",
        a: "PNG — для экранов и быстрой отправки, SVG — для печати и больших форматов, так как остаётся чётким при любом размере.",
      },
      {
        q: "Данные куда-то загружаются?",
        a: "Нет. QR-код генерируется прямо в браузере — ничего не отправляется на сервер.",
      },
    ],
    useCases: [
      "Рестораны — ссылка на электронное меню",
      "Магазины и упаковка — переход на страницу",
      "Плакаты и флаеры со сканируемой ссылкой",
      "Визитки и мероприятия",
    ],
    metaExtra:
      "Бесплатный QR-генератор — QR для ссылки или текста, свой цвет и размер, скачивание PNG или SVG.",
  },
};

const delivery: Content = {
  en: {
    intro:
      "Ship goods with a document both sides can sign. This delivery note generator lists what's in the shipment with units and quantities, adds shipper and consignee details, and gives you a clean, numbered PDF with lines to sign on release and receipt. Free to build, a small fee to download.",
    benefits: [
      "Itemised list with units and quantities",
      "Shipper and consignee details",
      "Released-by / received-by signature lines",
      "Your logo and 12 currencies, fully bilingual",
      "Numbered and dated for your records",
    ],
    steps: [
      "Enter the shipper and consignee.",
      "List the goods with unit, quantity and price.",
      "Set the note number and date.",
      "Preview free, then download the PDF to sign.",
    ],
    faq: [
      {
        q: "What is a delivery note?",
        a: "A delivery note (or packing slip) travels with a shipment and lists what's inside. The recipient checks and signs it to confirm the goods arrived — it's proof of delivery, not a payment request.",
      },
      {
        q: "How is it different from an invoice?",
        a: "A delivery note confirms goods were delivered; an invoice requests payment. Many businesses send the note with the shipment and the invoice separately.",
      },
      {
        q: "Is it free?",
        a: "Building and previewing is free. A small one-time fee unlocks the clean PDF.",
      },
    ],
    useCases: [
      "Sellers shipping goods to a customer",
      "Warehouses recording what left the door",
      "Couriers getting proof of receipt",
      "Anyone who needs a signed delivery record",
    ],
    metaExtra:
      "Free delivery note generator — a clean, numbered packing slip PDF with units, quantities and sign-off lines.",
  },
  ru: {
    intro:
      "Отгружайте товар с документом, который подпишут обе стороны. Генератор товарной накладной перечисляет позиции с единицами и количеством, добавляет данные поставщика и грузополучателя и выдаёт аккуратный пронумерованный PDF с местом для подписей «отпустил» и «принял». Собрать бесплатно, скачать — за небольшую плату.",
    benefits: [
      "Перечень позиций с единицами и количеством",
      "Данные поставщика и грузополучателя",
      "Строки для подписей «отпустил» / «принял»",
      "Ваш логотип, 12 валют, полностью двуязычно",
      "С номером и датой для учёта",
    ],
    steps: [
      "Укажите поставщика и грузополучателя.",
      "Перечислите товар с единицей, количеством и ценой.",
      "Задайте номер и дату накладной.",
      "Посмотрите превью и скачайте PDF для подписи.",
    ],
    faq: [
      {
        q: "Что такое товарная накладная?",
        a: "Накладная сопровождает груз и перечисляет его содержимое. Получатель сверяет и подписывает её, подтверждая, что товар получен — это подтверждение поставки, а не требование оплаты.",
      },
      {
        q: "Чем отличается от счёта?",
        a: "Накладная подтверждает передачу товара; счёт запрашивает оплату. Часто накладную отправляют с грузом, а счёт — отдельно.",
      },
      {
        q: "Это бесплатно?",
        a: "Собрать и посмотреть — бесплатно. Небольшая разовая плата снимает водяной знак.",
      },
    ],
    useCases: [
      "Продавцы — отгрузка товара клиенту",
      "Склады — учёт того, что уехало",
      "Курьеры — подтверждение получения",
      "Все, кому нужна подписанная накладная",
    ],
    metaExtra:
      "Бесплатный генератор товарной накладной — аккуратный пронумерованный PDF с единицами, количеством и местом для подписей.",
  },
};

const timesheet: Content = {
  en: {
    intro:
      "Turn logged hours into a clean, professional timesheet. Add your entries by date with hours and a note, set an optional hourly rate, and download a tidy PDF that totals your hours and pay — ideal for freelancers billing clients or logging work for approval. Free to build, a small fee to download.",
    benefits: [
      "Date, hours and note per entry",
      "Automatic total hours and total pay",
      "Optional hourly rate in your currency",
      "A clean, signable PDF for clients",
      "Your draft stays in your browser",
    ],
    steps: [
      "Enter your name, client and the period.",
      "Add each day with hours and a note.",
      "Set an optional hourly rate.",
      "Preview free, then download the PDF.",
    ],
    faq: [
      {
        q: "Can I use it to bill a client?",
        a: "Yes — add your hourly rate and the timesheet totals your pay. Pair it with the invoice generator to bill the client for the same hours.",
      },
      {
        q: "Do I have to add a rate?",
        a: "No. Leave the rate empty for a simple hours-only timesheet, or add it to also show total pay.",
      },
      {
        q: "Is my data uploaded?",
        a: "Your draft is stored in your browser. Nothing is uploaded until you generate the PDF.",
      },
    ],
    useCases: [
      "Freelancers logging billable hours",
      "Contractors submitting hours for approval",
      "Teams tracking time on a project",
      "Anyone who needs a tidy record of hours",
    ],
    metaExtra:
      "Free timesheet generator — log hours by date, add an hourly rate, and download a clean PDF with totals.",
  },
  ru: {
    intro:
      "Превратите учёт часов в аккуратный профессиональный табель. Добавьте записи по датам с часами и примечанием, задайте необязательную ставку — и скачайте опрятный PDF, который считает итог часов и оплаты. Идеально для фрилансеров, выставляющих счёт клиентам, или для учёта работы на согласование. Собрать бесплатно, скачать — за небольшую плату.",
    benefits: [
      "Дата, часы и примечание в каждой записи",
      "Автоматический итог часов и суммы",
      "Необязательная ставка в вашей валюте",
      "Аккуратный PDF с местом для подписи",
      "Черновик хранится в вашем браузере",
    ],
    steps: [
      "Укажите имя, клиента и период.",
      "Добавьте каждый день с часами и примечанием.",
      "Задайте необязательную ставку в час.",
      "Посмотрите превью и скачайте PDF.",
    ],
    faq: [
      {
        q: "Можно выставить счёт клиенту?",
        a: "Да — укажите ставку, и табель посчитает сумму. Дополните его генератором счёта, чтобы выставить те же часы.",
      },
      {
        q: "Обязательно указывать ставку?",
        a: "Нет. Оставьте ставку пустой для простого табеля только с часами или добавьте её, чтобы показать сумму.",
      },
      {
        q: "Данные загружаются?",
        a: "Черновик хранится в браузере. Ничего не загружается до генерации PDF.",
      },
    ],
    useCases: [
      "Фрилансеры — учёт оплачиваемых часов",
      "Подрядчики — часы на согласование",
      "Команды — учёт времени по проекту",
      "Все, кому нужен аккуратный учёт часов",
    ],
    metaExtra:
      "Бесплатный генератор табеля учёта часов — учёт по датам, ставка и PDF с итогами.",
  },
};

const giftCert: Content = {
  en: {
    intro:
      "Make a gift certificate people are happy to receive. Pick from 18 ready-made designs — or drop in your own background image — add the value, recipient and a message, and download a print-ready PDF in seconds. Perfect for shops, salons, studios and any small business.",
    benefits: [
      "18 polished designs — light, dark, elegant, bold",
      "Use your own background image for a custom look",
      "Set any value — an amount or “1 free class”",
      "Add a code and an expiry date",
      "Print-ready landscape PDF, fully bilingual",
    ],
    steps: [
      "Pick a design (or upload a background image).",
      "Enter the value, recipient and a message.",
      "Add a code and valid-until date.",
      "Preview for free, then download the PDF.",
    ],
    faq: [
      {
        q: "How many designs are there?",
        a: "18 built-in looks, from cream-and-gold to dark and modern — and you can upload your own background image on top of any of them for an endless number of variations.",
      },
      {
        q: "Can I use it for coupons too?",
        a: "Yes. Put a discount or offer in the value field (e.g. “-20%” or “Free dessert”) and it works as a coupon or voucher.",
      },
      {
        q: "Is it print-ready?",
        a: "Yes — the PDF is landscape and sized for clean printing. Build and preview for free; a small one-time fee unlocks the clean, watermark-free file.",
      },
    ],
    useCases: [
      "Shops and salons selling gift cards",
      "Studios offering a free class or session",
      "Restaurants and cafés with vouchers",
      "Anyone gifting a personal certificate",
    ],
    metaExtra:
      "Free gift certificate maker — 18 designs plus your own image, set the value and message, print-ready PDF.",
  },
  ru: {
    intro:
      "Сделайте подарочный сертификат, которому будут рады. Выберите один из 18 готовых дизайнов — или загрузите своё фоновое изображение — укажите номинал, получателя и пожелание, и скачайте готовый к печати PDF за секунды. Идеально для магазинов, салонов, студий и любого малого бизнеса.",
    benefits: [
      "18 аккуратных дизайнов — светлые, тёмные, элегантные, яркие",
      "Своё фоновое изображение для уникального вида",
      "Любой номинал — сумма или «1 занятие бесплатно»",
      "Код и срок действия",
      "Готовый к печати ландшафтный PDF, двуязычно",
    ],
    steps: [
      "Выберите дизайн (или загрузите фон).",
      "Укажите номинал, получателя и пожелание.",
      "Добавьте код и срок действия.",
      "Посмотрите превью бесплатно и скачайте PDF.",
    ],
    faq: [
      {
        q: "Сколько дизайнов?",
        a: "18 встроенных вариантов — от «крем и золото» до тёмных и современных, плюс можно наложить своё фоновое изображение поверх любого, получив бесконечное число вариаций.",
      },
      {
        q: "Подойдёт для купонов?",
        a: "Да. Впишите скидку или предложение в поле номинала (напр. «−20%» или «Десерт в подарок») — получится купон или ваучер.",
      },
      {
        q: "Готов к печати?",
        a: "Да — PDF ландшафтный и подходит для аккуратной печати. Собрать и посмотреть бесплатно; небольшая разовая плата снимает водяной знак.",
      },
    ],
    useCases: [
      "Магазины и салоны — подарочные карты",
      "Студии — бесплатное занятие или сессия",
      "Рестораны и кафе — ваучеры",
      "Все, кто дарит личный сертификат",
    ],
    metaExtra:
      "Бесплатный конструктор подарочного сертификата — 18 дизайнов и своё изображение, номинал и пожелание, PDF для печати.",
  },
};

const loanCalc: Content = {
  en: {
    intro:
      "See what a loan really costs before you sign. Enter the amount, interest rate and term, and this free loan calculator shows your monthly payment, the total interest you'll pay and the total cost — instantly, in any currency.",
    benefits: [
      "Monthly payment for any loan",
      "Total interest and total cost",
      "Works for car loans, personal loans and more",
      "Any currency, updates as you type",
      "Free — no sign-up, nothing to install",
    ],
    steps: ["Enter the loan amount.", "Add the interest rate and term.", "Read your monthly payment.", "Compare offers side by side."],
    faq: [
      { q: "How is the payment calculated?", a: "It uses the standard amortising formula — equal monthly payments that cover interest and principal over the full term." },
      { q: "Does it include fees?", a: "No — it shows principal and interest. Add any one-off fees separately when comparing offers." },
      { q: "Is it free?", a: "Yes, completely free with no sign-up." },
    ],
    useCases: ["Comparing loan or car-finance offers", "Budgeting a monthly payment", "Checking total interest before borrowing", "Anyone weighing a loan term"],
    metaExtra: "Free loan calculator — monthly payment, total interest and total cost for any loan.",
  },
  ru: {
    intro:
      "Узнайте реальную стоимость кредита до подписания. Введите сумму, ставку и срок — бесплатный кредитный калькулятор мгновенно покажет ежемесячный платёж, переплату и полную стоимость в любой валюте.",
    benefits: ["Ежемесячный платёж по любому кредиту", "Переплата и полная стоимость", "Для авто, потребкредита и не только", "Любая валюта, пересчёт на лету", "Бесплатно — без регистрации"],
    steps: ["Укажите сумму кредита.", "Добавьте ставку и срок.", "Смотрите ежемесячный платёж.", "Сравнивайте предложения."],
    faq: [
      { q: "Как считается платёж?", a: "По стандартной аннуитетной формуле — равные ежемесячные платежи, покрывающие проценты и тело за весь срок." },
      { q: "Учитываются ли комиссии?", a: "Нет — показываются тело и проценты. Разовые комиссии учитывайте отдельно при сравнении." },
      { q: "Это бесплатно?", a: "Да, полностью бесплатно и без регистрации." },
    ],
    useCases: ["Сравнение кредитных предложений", "Планирование ежемесячного платежа", "Проверка переплаты до займа", "Все, кто выбирает срок кредита"],
    metaExtra: "Бесплатный кредитный калькулятор — платёж, переплата и полная стоимость кредита.",
  },
};

const tipCalc: Content = {
  en: {
    intro:
      "Split the bill without the awkward maths. Enter the bill, choose a tip percentage and how many people are sharing — this free tip calculator shows the tip, the total and how much each person pays, instantly.",
    benefits: ["Tip and total in one tap", "Split evenly between any number of people", "Quick 10–20% buttons or a custom tip", "Any currency", "Free — no sign-up"],
    steps: ["Enter the bill amount.", "Pick a tip percentage.", "Set how many are splitting.", "See the per-person amount."],
    faq: [
      { q: "What tip percentage should I use?", a: "It varies by country and service, but 10–20% is common. Use the quick buttons or type your own." },
      { q: "Does it split tax too?", a: "It splits the bill plus tip evenly. Enter the amount you want to share, tax included or not." },
      { q: "Is it free?", a: "Yes, completely free." },
    ],
    useCases: ["Splitting a restaurant bill", "Working out a fair tip", "Sharing a group check", "Quick everyday maths"],
    metaExtra: "Free tip calculator — tip, total and per-person split in seconds.",
  },
  ru: {
    intro:
      "Делите счёт без неловкой математики. Введите сумму, выберите процент чаевых и число людей — бесплатный калькулятор чаевых сразу покажет чаевые, итог и сколько платит каждый.",
    benefits: ["Чаевые и итог в один клик", "Деление на любое число людей", "Быстрые кнопки 10–20% или свой процент", "Любая валюта", "Бесплатно — без регистрации"],
    steps: ["Введите сумму счёта.", "Выберите процент чаевых.", "Укажите, на скольких делить.", "Смотрите сумму с человека."],
    faq: [
      { q: "Сколько давать чаевых?", a: "Зависит от страны и сервиса, но 10–20% — обычная норма. Кнопки или свой процент." },
      { q: "Налог тоже делится?", a: "Делится счёт плюс чаевые поровну. Вводите сумму, которую хотите разделить." },
      { q: "Это бесплатно?", a: "Да, полностью бесплатно." },
    ],
    useCases: ["Разделить счёт в ресторане", "Посчитать справедливые чаевые", "Общий счёт компании", "Быстрая бытовая математика"],
    metaExtra: "Бесплатный калькулятор чаевых — чаевые, итог и деление на человека за секунды.",
  },
};

const pctCalc: Content = {
  en: {
    intro:
      "The three percentage questions you actually ask — answered instantly. Find X% of a number, work out what percent one number is of another, or calculate the percentage change between two values. Free, no sign-up.",
    benefits: ["Percent of a number", "One number as a % of another", "Percentage increase or decrease", "All three in one place", "Free — updates as you type"],
    steps: ["Pick the question you need.", "Type your two numbers.", "Read the answer instantly.", "Use it anywhere."],
    faq: [
      { q: "How do I find a percentage change?", a: "Enter the original and new value — the calculator returns (new − old) ÷ old as a percentage, positive for an increase and negative for a decrease." },
      { q: "What's “X is what % of Y”?", a: "It tells you the share one number is of another — for example, 30 is 25% of 120." },
      { q: "Is it free?", a: "Yes, completely free." },
    ],
    useCases: ["Discounts and markups", "Grades, shares and ratios", "Growth or drop between two numbers", "Everyday percentage maths"],
    metaExtra: "Free percentage calculator — percent of, what percent, and percentage change, all in one.",
  },
  ru: {
    intro:
      "Три вопроса про проценты, которые реально задают — ответ сразу. Найдите X% от числа, узнайте, сколько процентов одно число от другого, или посчитайте процентное изменение между двумя значениями. Бесплатно, без регистрации.",
    benefits: ["Процент от числа", "Одно число как % от другого", "Рост или снижение в процентах", "Всё три в одном месте", "Бесплатно — пересчёт на лету"],
    steps: ["Выберите нужный вопрос.", "Введите два числа.", "Смотрите мгновенный ответ.", "Используйте где угодно."],
    faq: [
      { q: "Как посчитать изменение в процентах?", a: "Введите старое и новое значение — калькулятор вернёт (новое − старое) ÷ старое в процентах: плюс при росте, минус при снижении." },
      { q: "Что значит «X — сколько % от Y»?", a: "Показывает долю одного числа от другого — например, 30 — это 25% от 120." },
      { q: "Это бесплатно?", a: "Да, полностью бесплатно." },
    ],
    useCases: ["Скидки и наценки", "Оценки, доли и соотношения", "Рост или падение между числами", "Бытовая математика процентов"],
    metaExtra: "Бесплатный калькулятор процентов — процент от, сколько процентов и изменение, всё сразу.",
  },
};

const passwordGen: Content = {
  en: {
    intro:
      "Create strong, random passwords that are genuinely hard to crack — right in your browser. This free password generator builds a password from the character sets you choose, at the length you set, using your browser's cryptographically secure randomness. Nothing is sent anywhere: the password is generated on your device and never leaves it.",
    benefits: [
      "Cryptographically secure randomness (Web Crypto), not Math.random",
      "Choose length and character sets: upper, lower, numbers, symbols",
      "Live strength meter with an entropy estimate in bits",
      "Option to avoid look-alike characters (0/O, 1/l)",
      "Generated entirely in your browser — nothing is uploaded",
    ],
    steps: [
      "Set the password length with the slider.",
      "Pick the character sets you want to include.",
      "Optionally turn on “avoid look-alike characters”.",
      "Copy your password — a fresh one is a click away.",
    ],
    faq: [
      {
        q: "How secure are these passwords?",
        a: "They're generated with the Web Crypto API (crypto.getRandomValues) — the same secure randomness browsers use for cryptography, not the predictable Math.random. With a good length and mixed character sets, that makes them very hard to guess or brute-force.",
      },
      {
        q: "Is my password sent to a server?",
        a: "No. Everything happens on your device in the browser. The password is never transmitted, logged or stored anywhere by us.",
      },
      {
        q: "How long should my password be?",
        a: "Longer is stronger. 16+ characters with mixed sets is a solid default; for important accounts use 20 or more. The strength meter shows the entropy so you can see the effect of each change.",
      },
      {
        q: "What is entropy in bits?",
        a: "It's a measure of how unpredictable a password is — each extra bit doubles the number of possibilities. Roughly, 60 bits is okay, 75+ is strong and 100+ is very strong.",
      },
      {
        q: "Should I use symbols?",
        a: "Yes, where the site allows them — every extra character set makes a password harder to crack. If a site rejects symbols, add a few more characters to compensate.",
      },
    ],
    useCases: [
      "Creating a unique password for a new account",
      "Generating a strong master password for a password manager",
      "Making Wi-Fi or device passwords that resist guessing",
      "Anyone who reuses passwords and wants to stop",
    ],
    metaExtra:
      "Free password generator — strong, random passwords with a strength meter, built securely in your browser.",
  },
  ru: {
    intro:
      "Создавайте надёжные случайные пароли, которые действительно трудно взломать — прямо в браузере. Этот бесплатный генератор паролей собирает пароль из выбранных наборов символов нужной длины, используя криптографически стойкую случайность вашего браузера. Ничего никуда не отправляется: пароль создаётся на вашем устройстве и не покидает его.",
    benefits: [
      "Криптостойкая случайность (Web Crypto), а не Math.random",
      "Выбор длины и наборов: заглавные, строчные, цифры, символы",
      "Индикатор надёжности с оценкой энтропии в битах",
      "Опция «избегать похожих символов» (0/O, 1/l)",
      "Всё в вашем браузере — ничего не загружается",
    ],
    steps: [
      "Задайте длину пароля ползунком.",
      "Выберите нужные наборы символов.",
      "При желании включите «избегать похожих символов».",
      "Скопируйте пароль — новый в один клик.",
    ],
    faq: [
      {
        q: "Насколько надёжны эти пароли?",
        a: "Они генерируются через Web Crypto API (crypto.getRandomValues) — той же стойкой случайностью, что браузеры используют для криптографии, а не предсказуемым Math.random. Вместе с достаточной длиной и разными наборами символов их очень трудно угадать или подобрать.",
      },
      {
        q: "Пароль отправляется на сервер?",
        a: "Нет. Всё происходит на вашем устройстве в браузере. Пароль нигде не передаётся, не логируется и не хранится нами.",
      },
      {
        q: "Какой длины должен быть пароль?",
        a: "Чем длиннее, тем надёжнее. 16+ символов со смешанными наборами — хороший вариант по умолчанию; для важных аккаунтов берите 20 и больше. Индикатор показывает энтропию, чтобы видеть эффект каждого изменения.",
      },
      {
        q: "Что такое энтропия в битах?",
        a: "Это мера непредсказуемости пароля — каждый дополнительный бит удваивает число вариантов. Грубо: 60 бит — нормально, 75+ — надёжно, 100+ — очень надёжно.",
      },
      {
        q: "Использовать ли символы?",
        a: "Да, где сайт разрешает — каждый дополнительный набор усложняет подбор. Если сайт не принимает символы, добавьте несколько символов длины взамен.",
      },
    ],
    useCases: [
      "Пароль для нового аккаунта",
      "Надёжный мастер-пароль для менеджера паролей",
      "Пароли для Wi-Fi и устройств, стойкие к подбору",
      "Все, кто переиспользует пароли и хочет перестать",
    ],
    metaExtra:
      "Бесплатный генератор паролей — надёжные случайные пароли с индикатором стойкости, безопасно в браузере.",
  },
};

const jsonFormatter: Content = {
  en: {
    intro:
      "Format, validate and minify JSON in seconds — right in your browser. Paste messy or minified JSON and this free formatter pretty-prints it with the indentation you choose, or compresses it back to a single line. If the JSON is invalid, it shows you exactly what's wrong. Nothing is uploaded — your data is parsed locally and never leaves the page.",
    benefits: [
      "Pretty-print with 2 spaces, 4 spaces or tabs",
      "Minify JSON back to a compact single line",
      "Instant validation with a clear error message",
      "Copy the result in one click",
      "Runs entirely in your browser — nothing uploaded",
    ],
    steps: [
      "Paste your JSON into the input box.",
      "Choose your indentation, then press Format (or Minify).",
      "Fix any error the validator points out.",
      "Copy the formatted output.",
    ],
    faq: [
      {
        q: "Is my JSON sent to a server?",
        a: "No. The JSON is parsed and formatted entirely in your browser using the built-in JSON engine. Nothing is uploaded, logged or stored — it's safe for sensitive data.",
      },
      {
        q: "What does “minify” do?",
        a: "It removes all unnecessary whitespace and line breaks, producing the smallest valid JSON on a single line — handy for configs, API payloads and reducing size.",
      },
      {
        q: "Why does it say my JSON is invalid?",
        a: "The formatter uses a strict parser, so it flags issues like trailing commas, single quotes, unquoted keys or missing brackets — and shows the error so you can fix it fast.",
      },
      {
        q: "What's the difference between JSON and a JavaScript object?",
        a: "JSON is a strict text format: keys and strings must use double quotes, with no trailing commas and no comments. This tool validates against that standard.",
      },
      {
        q: "Is there a size limit?",
        a: "It handles large documents comfortably since everything runs locally, though very large files depend on your device's memory. For everyday API responses and configs it's instant.",
      },
    ],
    useCases: [
      "Developers debugging an API response",
      "Cleaning up a config or export file",
      "Minifying JSON to shrink a payload",
      "Validating JSON before pasting it into code",
    ],
    metaExtra:
      "Free JSON formatter — pretty-print, validate and minify JSON in your browser, with clear error messages.",
  },
  ru: {
    intro:
      "Форматируйте, проверяйте и минифицируйте JSON за секунды — прямо в браузере. Вставьте неаккуратный или сжатый JSON — форматтер красиво отформатирует его с выбранным отступом или свернёт обратно в одну строку. Если JSON некорректен, покажет, что именно не так. Ничего не загружается: данные разбираются локально и не покидают страницу.",
    benefits: [
      "Форматирование с 2 пробелами, 4 пробелами или табом",
      "Минификация JSON в компактную строку",
      "Мгновенная проверка с понятной ошибкой",
      "Копирование результата в один клик",
      "Всё в браузере — ничего не загружается",
    ],
    steps: [
      "Вставьте JSON в поле ввода.",
      "Выберите отступ и нажмите «Форматировать» (или «Минифицировать»).",
      "Исправьте ошибку, если валидатор её укажет.",
      "Скопируйте отформатированный результат.",
    ],
    faq: [
      {
        q: "JSON отправляется на сервер?",
        a: "Нет. JSON разбирается и форматируется полностью в браузере встроенным движком JSON. Ничего не загружается, не логируется и не хранится — безопасно для чувствительных данных.",
      },
      {
        q: "Что делает «минификация»?",
        a: "Убирает все лишние пробелы и переносы строк, оставляя минимальный корректный JSON в одну строку — удобно для конфигов, API и уменьшения размера.",
      },
      {
        q: "Почему пишет, что JSON некорректный?",
        a: "Форматтер использует строгий парсер и отмечает проблемы вроде висячих запятых, одинарных кавычек, ключей без кавычек или недостающих скобок — и показывает ошибку, чтобы быстро исправить.",
      },
      {
        q: "Чем JSON отличается от объекта JavaScript?",
        a: "JSON — строгий текстовый формат: ключи и строки только в двойных кавычках, без висячих запятых и комментариев. Инструмент проверяет по этому стандарту.",
      },
      {
        q: "Есть ли ограничение по размеру?",
        a: "Большие документы обрабатываются легко, так как всё локально, но очень большие файлы зависят от памяти устройства. Для обычных ответов API и конфигов — мгновенно.",
      },
    ],
    useCases: [
      "Разработчики — отладка ответа API",
      "Приведение в порядок конфига или экспорта",
      "Минификация JSON для уменьшения размера",
      "Проверка JSON перед вставкой в код",
    ],
    metaExtra:
      "Бесплатный JSON-форматтер — форматирование, проверка и минификация JSON в браузере с понятными ошибками.",
  },
};

const base64Content: Content = {
  en: {
    intro:
      "Encode text to Base64 or decode Base64 back to text — instantly, in your browser. This free Base64 tool is UTF-8 safe, so accented characters, emoji and Cyrillic round-trip correctly, and it supports URL-safe Base64 (using - and _) for tokens and query strings. Nothing is uploaded; encoding and decoding happen entirely on your device.",
    benefits: [
      "Encode and decode with one click",
      "UTF-8 safe — handles emoji, accents and Cyrillic",
      "URL-safe option (- and _, no padding)",
      "Copy the result instantly",
      "Runs in your browser — nothing uploaded",
    ],
    steps: [
      "Choose Encode or Decode.",
      "Paste your text or Base64 string.",
      "Toggle URL-safe if you need it.",
      "Copy the result.",
    ],
    faq: [
      {
        q: "What is Base64?",
        a: "Base64 represents binary data or text as plain ASCII characters. It's used in data URLs, email attachments, JWTs and API payloads where only text is allowed.",
      },
      {
        q: "Is it UTF-8 safe?",
        a: "Yes. Text is encoded as UTF-8 first, so non-Latin characters, emoji and Cyrillic decode back exactly as you typed them — unlike a plain btoa().",
      },
      {
        q: "What is URL-safe Base64?",
        a: "A variant that replaces + with - and / with _ and drops the = padding, so the result is safe to use in URLs, filenames and tokens.",
      },
      {
        q: "Is my data uploaded?",
        a: "No. Everything runs locally in your browser — nothing is sent to a server.",
      },
    ],
    useCases: [
      "Developers encoding data for a data URL or API",
      "Decoding a Base64 string from a config or token",
      "Creating URL-safe tokens",
      "Anyone inspecting Base64 content quickly",
    ],
    metaExtra:
      "Free Base64 encoder and decoder — UTF-8 and URL-safe, encode or decode instantly in your browser.",
  },
  ru: {
    intro:
      "Кодируйте текст в Base64 или декодируйте Base64 обратно — мгновенно, в браузере. Этот бесплатный инструмент Base64 корректно работает с UTF-8, поэтому буквы с диакритикой, эмодзи и кириллица преобразуются без потерь, и поддерживает URL-safe Base64 (с - и _) для токенов и query-строк. Ничего не загружается: кодирование и декодирование происходят на вашем устройстве.",
    benefits: [
      "Кодирование и декодирование в один клик",
      "Поддержка UTF-8 — эмодзи, диакритика и кириллица",
      "URL-safe вариант (- и _, без паддинга)",
      "Мгновенное копирование результата",
      "Всё в браузере — ничего не загружается",
    ],
    steps: [
      "Выберите «Кодировать» или «Декодировать».",
      "Вставьте текст или строку Base64.",
      "Включите URL-safe, если нужно.",
      "Скопируйте результат.",
    ],
    faq: [
      {
        q: "Что такое Base64?",
        a: "Base64 — способ представить бинарные данные или текст обычными ASCII-символами. Используется в data-URL, вложениях писем, JWT и API там, где допустим только текст.",
      },
      {
        q: "Поддерживается ли UTF-8?",
        a: "Да. Текст сначала кодируется в UTF-8, поэтому нелатинские символы, эмодзи и кириллица декодируются ровно так, как вы ввели — в отличие от простого btoa().",
      },
      {
        q: "Что такое URL-safe Base64?",
        a: "Вариант, где + заменён на -, / на _ и убрано выравнивание =, чтобы результат можно было безопасно использовать в URL, именах файлов и токенах.",
      },
      {
        q: "Данные загружаются на сервер?",
        a: "Нет. Всё работает локально в браузере — ничего не отправляется.",
      },
    ],
    useCases: [
      "Разработчики — кодирование для data-URL или API",
      "Декодирование строки Base64 из конфига или токена",
      "Создание URL-safe токенов",
      "Все, кто быстро смотрит содержимое Base64",
    ],
    metaExtra:
      "Бесплатный кодер и декодер Base64 — UTF-8 и URL-safe, кодируйте и декодируйте в браузере.",
  },
};

const jwtContent: Content = {
  en: {
    intro:
      "Paste a JSON Web Token and instantly see what's inside. This free JWT decoder splits the token and decodes its header and payload from Base64URL into readable JSON, and highlights standard claims like issued-at and expiry in your local time. Decoding is done entirely in your browser — the token never leaves your device.",
    benefits: [
      "Header and payload as readable, formatted JSON",
      "Human-readable issued-at, not-before and expiry",
      "Expired / valid badge at a glance",
      "Runs locally — the token is never uploaded",
      "Copy the header or payload in one click",
    ],
    steps: [
      "Paste your JWT (the eyJ… string).",
      "Read the decoded header and payload.",
      "Check the expiry and other claims.",
      "Copy what you need.",
    ],
    faq: [
      {
        q: "Does this verify the signature?",
        a: "No. It decodes the header and payload so you can read them, but it does not verify the signature — that requires the secret or public key, which should never be pasted into a website.",
      },
      {
        q: "Is my token sent anywhere?",
        a: "No. The token is decoded entirely in your browser; nothing is uploaded, logged or stored.",
      },
      {
        q: "What's inside a JWT?",
        a: "Three Base64URL parts separated by dots: a header (algorithm and type), a payload (claims like sub, iat, exp), and a signature. This tool shows all three.",
      },
      {
        q: "Why is my token 'expired'?",
        a: "If the payload has an exp claim in the past, the token is expired. The decoder converts exp to your local time and flags it.",
      },
    ],
    useCases: [
      "Developers debugging authentication",
      "Inspecting claims in an API token",
      "Checking a token's expiry",
      "Learning how JWTs are structured",
    ],
    metaExtra:
      "Free JWT decoder — read a JSON Web Token's header, payload and claims in your browser (decode only).",
  },
  ru: {
    intro:
      "Вставьте JSON Web Token и сразу увидите, что внутри. Этот бесплатный JWT-декодер разбивает токен и декодирует его заголовок и payload из Base64URL в читаемый JSON, а также показывает стандартные поля — время выпуска и истечения — в вашем локальном времени. Декодирование происходит полностью в браузере: токен не покидает устройство.",
    benefits: [
      "Заголовок и payload как читаемый форматированный JSON",
      "Понятные «выдан», «действует с» и «истекает»",
      "Бейдж «истёк / действует» с первого взгляда",
      "Работает локально — токен не загружается",
      "Копирование заголовка или payload в один клик",
    ],
    steps: [
      "Вставьте JWT (строку eyJ…).",
      "Прочитайте декодированные заголовок и payload.",
      "Проверьте срок действия и другие поля.",
      "Скопируйте нужное.",
    ],
    faq: [
      {
        q: "Проверяется ли подпись?",
        a: "Нет. Инструмент декодирует заголовок и payload для чтения, но не проверяет подпись — для этого нужен секрет или публичный ключ, которые нельзя вставлять на сайтах.",
      },
      {
        q: "Токен куда-то отправляется?",
        a: "Нет. Токен декодируется полностью в браузере; ничего не загружается, не логируется и не хранится.",
      },
      {
        q: "Что внутри JWT?",
        a: "Три части Base64URL через точки: заголовок (алгоритм и тип), payload (поля вроде sub, iat, exp) и подпись. Инструмент показывает все три.",
      },
      {
        q: "Почему токен «истёк»?",
        a: "Если в payload есть поле exp в прошлом — токен истёк. Декодер переводит exp в ваше локальное время и отмечает это.",
      },
    ],
    useCases: [
      "Разработчики — отладка аутентификации",
      "Просмотр полей в API-токене",
      "Проверка срока действия токена",
      "Изучение структуры JWT",
    ],
    metaExtra:
      "Бесплатный JWT-декодер — читайте заголовок, payload и поля JSON Web Token в браузере (только декодирование).",
  },
};

const regexContent: Content = {
  en: {
    intro:
      "Test and debug regular expressions against your own text, with matches highlighted as you type. This free regex tester supports JavaScript flags (g, i, m, s, u, y), shows every match with its position and captured groups, and tells you immediately if your pattern is invalid. It all runs in your browser — nothing is uploaded.",
    benefits: [
      "Live match highlighting as you type",
      "All JavaScript flags: g, i, m, s, u, y",
      "Match positions and captured groups listed",
      "Clear error message for an invalid pattern",
      "Runs in your browser — nothing uploaded",
    ],
    steps: [
      "Type your pattern between the slashes and set flags.",
      "Paste the text you want to test against.",
      "See matches highlighted and listed below.",
      "Refine the pattern until it matches what you want.",
    ],
    faq: [
      {
        q: "Which regex flavour is this?",
        a: "JavaScript (ECMAScript) regular expressions — the same engine your browser and Node.js use, including flags g, i, m, s, u and y.",
      },
      {
        q: "What do the flags mean?",
        a: "g = find all matches, i = case-insensitive, m = ^ and $ match each line, s = dot matches newlines, u = unicode, y = sticky.",
      },
      {
        q: "Does it show capture groups?",
        a: "Yes. Each match lists its captured groups ($1, $2…) so you can see exactly what your parentheses capture.",
      },
      {
        q: "Is my text uploaded?",
        a: "No. The pattern runs against your text entirely in the browser — nothing is sent to a server.",
      },
    ],
    useCases: [
      "Developers writing and debugging a regex",
      "Testing a validation pattern (email, phone, slug)",
      "Extracting data with capture groups",
      "Learning regular expressions by experiment",
    ],
    metaExtra:
      "Free regex tester — test JavaScript regular expressions with live highlighting, groups and flags, in your browser.",
  },
  ru: {
    intro:
      "Проверяйте и отлаживайте регулярные выражения по своему тексту — совпадения подсвечиваются по мере ввода. Этот бесплатный regex-тестер поддерживает флаги JavaScript (g, i, m, s, u, y), показывает каждое совпадение с позицией и захваченными группами и сразу сообщает, если шаблон некорректен. Всё работает в браузере — ничего не загружается.",
    benefits: [
      "Живая подсветка совпадений по мере ввода",
      "Все флаги JavaScript: g, i, m, s, u, y",
      "Позиции совпадений и захваченные группы",
      "Понятное сообщение об ошибке в шаблоне",
      "Работает в браузере — ничего не загружается",
    ],
    steps: [
      "Введите шаблон между слэшами и задайте флаги.",
      "Вставьте текст для проверки.",
      "Смотрите совпадения — подсвечены и в списке.",
      "Дорабатывайте шаблон до нужного результата.",
    ],
    faq: [
      {
        q: "Какой это диалект regex?",
        a: "Регулярные выражения JavaScript (ECMAScript) — тот же движок, что в браузере и Node.js, включая флаги g, i, m, s, u и y.",
      },
      {
        q: "Что значат флаги?",
        a: "g = все совпадения, i = без учёта регистра, m = ^ и $ по каждой строке, s = точка включает перенос строки, u = юникод, y = «липкий».",
      },
      {
        q: "Показываются ли группы?",
        a: "Да. У каждого совпадения перечислены захваченные группы ($1, $2…), чтобы видеть, что именно ловят скобки.",
      },
      {
        q: "Мой текст загружается?",
        a: "Нет. Шаблон применяется к тексту полностью в браузере — ничего не отправляется на сервер.",
      },
    ],
    useCases: [
      "Разработчики — написание и отладка regex",
      "Проверка паттерна валидации (email, телефон, slug)",
      "Извлечение данных группами захвата",
      "Изучение регулярных выражений на практике",
    ],
    metaExtra:
      "Бесплатный regex-тестер — проверяйте регулярные выражения JavaScript с подсветкой, группами и флагами в браузере.",
  },
};

const urlContent: Content = {
  en: {
    intro:
      "Percent-encode text so it's safe to drop into a URL, or decode an encoded URL back to readable text — instantly, in your browser. This free URL encoder/decoder handles special characters, spaces and non-Latin text (UTF-8), and lets you choose between encoding a single component (encodeURIComponent) or a full URL (encodeURI). Nothing is uploaded.",
    benefits: [
      "Encode a component or a full URL",
      "Decode percent-encoded URLs back to text",
      "UTF-8 safe — spaces, symbols and Cyrillic",
      "Copy the result in one click",
      "Runs in your browser — nothing uploaded",
    ],
    steps: [
      "Choose Encode or Decode.",
      "Paste your text or encoded URL.",
      "Pick component or full-URI encoding.",
      "Copy the result.",
    ],
    faq: [
      {
        q: "What's the difference between component and full-URI encoding?",
        a: "Component encoding (encodeURIComponent) escapes everything that isn't allowed in a URL part, including / ? & = — use it for a query value. Full-URI (encodeURI) keeps the URL structure intact — use it for a whole address.",
      },
      {
        q: "Does it handle spaces and Cyrillic?",
        a: "Yes. Text is treated as UTF-8, so spaces become %20 and non-Latin characters encode and decode back exactly.",
      },
      {
        q: "Is my text uploaded?",
        a: "No. Encoding and decoding happen entirely in your browser — nothing is sent to a server.",
      },
      {
        q: "Why does decoding fail sometimes?",
        a: "If the input has a malformed percent sequence (like a lone %), it can't be decoded. Fix or remove it and try again.",
      },
    ],
    useCases: [
      "Building query strings and API URLs",
      "Decoding an encoded link from logs or an email",
      "Escaping user input for a URL",
      "Debugging why a URL breaks",
    ],
    metaExtra:
      "Free URL encoder and decoder — percent-encode or decode URLs and query strings, UTF-8 safe, in your browser.",
  },
  ru: {
    intro:
      "Кодируйте текст, чтобы безопасно вставить его в URL, или декодируйте закодированный URL обратно в читаемый вид — мгновенно, в браузере. Этот бесплатный URL-кодер/декодер работает со спецсимволами, пробелами и нелатинским текстом (UTF-8) и позволяет выбрать кодирование одного компонента (encodeURIComponent) или полного URL (encodeURI). Ничего не загружается.",
    benefits: [
      "Кодирование компонента или полного URL",
      "Декодирование процент-кодированных URL в текст",
      "Поддержка UTF-8 — пробелы, символы и кириллица",
      "Копирование результата в один клик",
      "Работает в браузере — ничего не загружается",
    ],
    steps: [
      "Выберите «Кодировать» или «Декодировать».",
      "Вставьте текст или закодированный URL.",
      "Выберите кодирование компонента или полного URI.",
      "Скопируйте результат.",
    ],
    faq: [
      {
        q: "Чем отличается кодирование компонента от полного URI?",
        a: "Кодирование компонента (encodeURIComponent) экранирует всё, что недопустимо в части URL, включая / ? & = — используйте для значения query. Полный URI (encodeURI) сохраняет структуру адреса — для целого URL.",
      },
      {
        q: "Работает ли с пробелами и кириллицей?",
        a: "Да. Текст обрабатывается как UTF-8, поэтому пробелы становятся %20, а нелатинские символы кодируются и декодируются точно.",
      },
      {
        q: "Мой текст загружается?",
        a: "Нет. Кодирование и декодирование происходят полностью в браузере — ничего не отправляется.",
      },
      {
        q: "Почему декодирование иногда не срабатывает?",
        a: "Если во вводе есть некорректная процент-последовательность (например, одиночный %), декодировать нельзя. Исправьте или уберите её.",
      },
    ],
    useCases: [
      "Сборка query-строк и API-URL",
      "Декодирование ссылки из логов или письма",
      "Экранирование пользовательского ввода для URL",
      "Отладка ломающихся URL",
    ],
    metaExtra:
      "Бесплатный URL-кодер и декодер — процентное кодирование URL и query-строк, UTF-8, в браузере.",
  },
};

const uuidContent: Content = {
  en: {
    intro:
      "Generate random UUID v4 identifiers — one or a whole batch — instantly in your browser. This free UUID generator uses your browser's cryptographically secure randomness, and lets you copy any single ID or all of them at once, with or without hyphens and in upper or lower case. Nothing is uploaded.",
    benefits: [
      "Cryptographically random UUID v4",
      "Generate up to 100 at once",
      "Copy one or copy all",
      "Toggle hyphens and letter case",
      "Runs in your browser — nothing uploaded",
    ],
    steps: [
      "Choose how many you need.",
      "Press Generate.",
      "Toggle hyphens or uppercase if you like.",
      "Copy one ID or all of them.",
    ],
    faq: [
      {
        q: "What is a UUID v4?",
        a: "A universally unique identifier generated from random data. Version 4 UUIDs have 122 random bits, so the chance of a collision is astronomically small — ideal for keys and IDs.",
      },
      {
        q: "Are these secure and random?",
        a: "Yes. They're generated with crypto.randomUUID(), which uses the browser's cryptographically secure random source.",
      },
      {
        q: "Can I remove the hyphens?",
        a: "Yes — toggle hyphens off to get a 32-character hex string, and toggle uppercase if your system expects capitals.",
      },
      {
        q: "Is anything uploaded?",
        a: "No. UUIDs are generated locally in your browser; nothing is sent to a server.",
      },
    ],
    useCases: [
      "Developers needing unique keys or IDs",
      "Seeding a database or test data",
      "Generating API keys or request IDs",
      "Anyone needing a quick unique identifier",
    ],
    metaExtra:
      "Free UUID generator — create random UUID v4 identifiers in bulk, copy one or all, in your browser.",
  },
  ru: {
    intro:
      "Генерируйте случайные идентификаторы UUID v4 — по одному или списком — мгновенно в браузере. Этот бесплатный генератор UUID использует криптостойкую случайность браузера и позволяет скопировать любой один ID или все сразу, с дефисами или без, в верхнем или нижнем регистре. Ничего не загружается.",
    benefits: [
      "Криптослучайный UUID v4",
      "До 100 штук за раз",
      "Копирование одного или всех",
      "Переключение дефисов и регистра",
      "Работает в браузере — ничего не загружается",
    ],
    steps: [
      "Выберите, сколько нужно.",
      "Нажмите «Сгенерировать».",
      "При желании переключите дефисы или регистр.",
      "Скопируйте один ID или все.",
    ],
    faq: [
      {
        q: "Что такое UUID v4?",
        a: "Универсальный уникальный идентификатор из случайных данных. У версии 4 — 122 случайных бита, поэтому вероятность коллизии астрономически мала — идеально для ключей и ID.",
      },
      {
        q: "Насколько они случайны?",
        a: "Генерируются через crypto.randomUUID(), использующий криптостойкий источник случайности браузера.",
      },
      {
        q: "Можно убрать дефисы?",
        a: "Да — выключите дефисы, чтобы получить 32-символьную hex-строку, и включите верхний регистр, если система ожидает заглавные.",
      },
      {
        q: "Что-то загружается?",
        a: "Нет. UUID генерируются локально в браузере; ничего не отправляется.",
      },
    ],
    useCases: [
      "Разработчикам — уникальные ключи и ID",
      "Заполнение БД или тестовых данных",
      "Генерация API-ключей или request-ID",
      "Любой быстрый уникальный идентификатор",
    ],
    metaExtra:
      "Бесплатный генератор UUID — случайные UUID v4 списком, копирование одного или всех, в браузере.",
  },
};

const hashContent: Content = {
  en: {
    intro:
      "Compute the SHA hash of any text — SHA-1, SHA-256, SHA-384 and SHA-512 at once — right in your browser. This free hash generator uses the browser's built-in Web Crypto, updates as you type, and lets you copy any digest with one click. Your text is hashed locally and never leaves the page.",
    benefits: [
      "SHA-1, SHA-256, SHA-384 and SHA-512 together",
      "Updates live as you type",
      "Copy any hash in one click",
      "Uses secure Web Crypto, not a JS shim",
      "Runs in your browser — nothing uploaded",
    ],
    steps: [
      "Type or paste your text.",
      "See all four SHA hashes update instantly.",
      "Copy the digest you need.",
    ],
    faq: [
      {
        q: "Which hash algorithms are supported?",
        a: "SHA-1, SHA-256, SHA-384 and SHA-512, computed with the browser's Web Crypto API. MD5 isn't included because browsers don't provide it natively.",
      },
      {
        q: "Is my text uploaded to hash it?",
        a: "No. Hashing happens entirely in your browser using Web Crypto — nothing is sent to a server.",
      },
      {
        q: "Is SHA-1 safe to use?",
        a: "SHA-1 is fine as a checksum but is considered weak for security (collisions are feasible). Prefer SHA-256 or stronger for anything security-related.",
      },
      {
        q: "Can I hash a password with this?",
        a: "You can compute a hash, but a plain SHA is not how you should store passwords — use a slow, salted algorithm like bcrypt or Argon2 for that.",
      },
    ],
    useCases: [
      "Verifying a file or text checksum",
      "Generating a digest for an API signature",
      "Comparing values without storing the original",
      "Learning how hashing works",
    ],
    metaExtra:
      "Free SHA hash generator — SHA-1, SHA-256, SHA-384 and SHA-512 of any text, computed in your browser.",
  },
  ru: {
    intro:
      "Считайте SHA-хеш любого текста — SHA-1, SHA-256, SHA-384 и SHA-512 сразу — прямо в браузере. Этот бесплатный генератор хешей использует встроенный Web Crypto, обновляется по мере ввода и позволяет скопировать любой дайджест в один клик. Текст хешируется локально и не покидает страницу.",
    benefits: [
      "SHA-1, SHA-256, SHA-384 и SHA-512 вместе",
      "Обновление по мере ввода",
      "Копирование любого хеша в один клик",
      "Использует защищённый Web Crypto, а не JS-заглушку",
      "Работает в браузере — ничего не загружается",
    ],
    steps: [
      "Введите или вставьте текст.",
      "Смотрите, как обновляются все четыре SHA-хеша.",
      "Скопируйте нужный дайджест.",
    ],
    faq: [
      {
        q: "Какие алгоритмы поддерживаются?",
        a: "SHA-1, SHA-256, SHA-384 и SHA-512, вычисляются через Web Crypto API браузера. MD5 не включён — браузеры его нативно не предоставляют.",
      },
      {
        q: "Мой текст загружается для хеширования?",
        a: "Нет. Хеширование происходит полностью в браузере через Web Crypto — ничего не отправляется.",
      },
      {
        q: "Безопасен ли SHA-1?",
        a: "SHA-1 годится как контрольная сумма, но для безопасности считается слабым (коллизии реальны). Для задач безопасности берите SHA-256 и выше.",
      },
      {
        q: "Можно ли так захешировать пароль?",
        a: "Хеш посчитать можно, но простой SHA — не способ хранить пароли: для этого используйте медленный алгоритм с солью, вроде bcrypt или Argon2.",
      },
    ],
    useCases: [
      "Проверка контрольной суммы файла или текста",
      "Дайджест для подписи API",
      "Сравнение значений без хранения оригинала",
      "Изучение принципов хеширования",
    ],
    metaExtra:
      "Бесплатный генератор SHA-хешей — SHA-1, SHA-256, SHA-384 и SHA-512 любого текста, в браузере.",
  },
};

const timestampContent: Content = {
  en: {
    intro:
      "Convert a Unix timestamp into a human-readable date, or turn a date back into a Unix timestamp — instantly, in your browser. This free converter shows the local time, UTC, ISO 8601 and a relative time, auto-detects seconds vs milliseconds, and gives you the current timestamp live. Nothing is uploaded.",
    benefits: [
      "Timestamp → local, UTC, ISO and relative time",
      "Date → Unix seconds and milliseconds",
      "Auto-detects seconds vs milliseconds",
      "Live current timestamp, copyable",
      "Runs in your browser — nothing uploaded",
    ],
    steps: [
      "Paste a Unix timestamp to see the date.",
      "Or pick a date to get the timestamp.",
      "Copy the value you need.",
    ],
    faq: [
      {
        q: "What is a Unix timestamp?",
        a: "The number of seconds (or milliseconds) since 1 January 1970 UTC — a compact, timezone-free way to store a moment in time, used across programming and APIs.",
      },
      {
        q: "Seconds or milliseconds?",
        a: "The tool auto-detects: 10-digit values are read as seconds, 13-digit values as milliseconds. Most back-ends use seconds; JavaScript uses milliseconds.",
      },
      {
        q: "Does it handle time zones?",
        a: "It shows both your local time and UTC. The timestamp itself is timezone-free; the local display uses your device's zone.",
      },
      {
        q: "Is anything uploaded?",
        a: "No. Conversion happens entirely in your browser — nothing is sent to a server.",
      },
    ],
    useCases: [
      "Developers reading timestamps from logs or APIs",
      "Converting a date to a Unix value for a query",
      "Checking when an epoch value falls",
      "Debugging expiry or created-at fields",
    ],
    metaExtra:
      "Free Unix timestamp converter — epoch to date and back, with local, UTC, ISO and relative time.",
  },
  ru: {
    intro:
      "Переводите Unix-время в понятную дату или дату обратно в Unix-время — мгновенно, в браузере. Этот бесплатный конвертер показывает локальное время, UTC, ISO 8601 и относительное время, авто-определяет секунды или миллисекунды и даёт текущий timestamp вживую. Ничего не загружается.",
    benefits: [
      "Время → локальное, UTC, ISO и относительное",
      "Дата → Unix-секунды и миллисекунды",
      "Авто-определение секунд/миллисекунд",
      "Текущий timestamp вживую, с копированием",
      "Работает в браузере — ничего не загружается",
    ],
    steps: [
      "Вставьте Unix-время, чтобы увидеть дату.",
      "Или выберите дату, чтобы получить timestamp.",
      "Скопируйте нужное значение.",
    ],
    faq: [
      {
        q: "Что такое Unix-время?",
        a: "Число секунд (или миллисекунд) с 1 января 1970 UTC — компактный способ хранить момент времени без часового пояса, используется в программировании и API.",
      },
      {
        q: "Секунды или миллисекунды?",
        a: "Инструмент определяет сам: 10-значные значения читаются как секунды, 13-значные — как миллисекунды. Большинство бэкендов используют секунды, JavaScript — миллисекунды.",
      },
      {
        q: "Учитываются ли часовые пояса?",
        a: "Показываются и локальное время, и UTC. Сам timestamp без пояса; локальное отображение берёт зону вашего устройства.",
      },
      {
        q: "Что-то загружается?",
        a: "Нет. Конвертация полностью в браузере — ничего не отправляется.",
      },
    ],
    useCases: [
      "Разработчики — timestamps из логов и API",
      "Дата в Unix-значение для запроса",
      "Проверка, когда наступает epoch-значение",
      "Отладка полей expiry/created-at",
    ],
    metaExtra:
      "Бесплатный конвертер Unix-времени — epoch в дату и обратно, с локальным, UTC, ISO и относительным временем.",
  },
};

const colorContent: Content = {
  en: {
    intro:
      "Convert a color between HEX, RGB and HSL — instantly, in your browser. Type any CSS color (a hex code, an rgb() value, or even a name like teal) or pick one visually, and get all three formats plus a live swatch. Nothing is uploaded.",
    benefits: [
      "HEX, RGB and HSL from any input",
      "Accepts hex, rgb(), hsl() and CSS color names",
      "Visual color picker and a live swatch",
      "Copy any format in one click",
      "Runs in your browser — nothing uploaded",
    ],
    steps: [
      "Type a color or open the picker.",
      "See HEX, RGB and HSL update instantly.",
      "Copy the format you need.",
    ],
    faq: [
      {
        q: "Which color formats are supported?",
        a: "It reads any valid CSS color — hex (#rgb or #rrggbb), rgb()/rgba(), hsl()/hsla() and named colors — and outputs HEX, RGB and HSL.",
      },
      {
        q: "How is HSL calculated?",
        a: "The color is converted to RGB, then to HSL (hue 0–360°, saturation and lightness as percentages) using the standard formula.",
      },
      {
        q: "Does it support alpha/transparency?",
        a: "It focuses on the solid color (RGB) for conversion. Alpha isn't included in the HEX/HSL output.",
      },
      {
        q: "Is anything uploaded?",
        a: "No. The conversion runs entirely in your browser — nothing is sent to a server.",
      },
    ],
    useCases: [
      "Designers and developers matching brand colors",
      "Converting a hex code to HSL for tweaks",
      "Turning a CSS color name into a value",
      "Building a palette across formats",
    ],
    metaExtra:
      "Free color converter — HEX, RGB and HSL from any CSS color, with a picker and live swatch.",
  },
  ru: {
    intro:
      "Конвертируйте цвет между HEX, RGB и HSL — мгновенно, в браузере. Введите любой CSS-цвет (hex, значение rgb() или даже имя вроде teal) или выберите пипеткой — и получите все три формата плюс живой образец. Ничего не загружается.",
    benefits: [
      "HEX, RGB и HSL из любого ввода",
      "Принимает hex, rgb(), hsl() и имена CSS-цветов",
      "Визуальная пипетка и живой образец",
      "Копирование любого формата в один клик",
      "Работает в браузере — ничего не загружается",
    ],
    steps: [
      "Введите цвет или откройте пипетку.",
      "Смотрите, как обновляются HEX, RGB и HSL.",
      "Скопируйте нужный формат.",
    ],
    faq: [
      {
        q: "Какие форматы поддерживаются?",
        a: "Читается любой корректный CSS-цвет — hex (#rgb или #rrggbb), rgb()/rgba(), hsl()/hsla() и именованные цвета — на выходе HEX, RGB и HSL.",
      },
      {
        q: "Как считается HSL?",
        a: "Цвет переводится в RGB, затем в HSL (тон 0–360°, насыщенность и светлота в процентах) по стандартной формуле.",
      },
      {
        q: "Поддерживается ли прозрачность?",
        a: "Для конвертации берётся сплошной цвет (RGB). Альфа не входит в вывод HEX/HSL.",
      },
      {
        q: "Что-то загружается?",
        a: "Нет. Конвертация полностью в браузере — ничего не отправляется.",
      },
    ],
    useCases: [
      "Дизайнеры и разработчики — подбор брендовых цветов",
      "Перевод hex в HSL для правок",
      "Имя CSS-цвета в значение",
      "Сборка палитры в разных форматах",
    ],
    metaExtra:
      "Бесплатный конвертер цветов — HEX, RGB и HSL из любого CSS-цвета, с пипеткой и живым образцом.",
  },
};

const diffContent: Content = {
  en: {
    intro:
      "Compare two blocks of text and see exactly what changed, line by line. This free online text diff tool highlights added and removed lines instantly, right in your browser — paste an old and a new version of anything (code, config, contracts, copy) and read the changes at a glance. Nothing is uploaded; the comparison runs entirely on your device.",
    benefits: [
      "Line-by-line diff with added/removed highlighting",
      "Live comparison as you paste — no button to press",
      "A running count of added and removed lines",
      "Copy the unified diff in one click",
      "Runs in your browser — nothing is uploaded",
    ],
    steps: [
      "Paste the original text on the left.",
      "Paste the changed text on the right.",
      "Read the highlighted differences below.",
      "Copy the diff if you need to share it.",
    ],
    faq: [
      {
        q: "What does a text diff show?",
        a: "It compares two versions of text and marks which lines were added, removed or left unchanged — the same idea as a git diff, but for any text.",
      },
      {
        q: "Does it compare word by word?",
        a: "The comparison is line-based, which is the clearest view for code, config and documents. A changed line shows as one removed line plus one added line.",
      },
      {
        q: "Is my text uploaded anywhere?",
        a: "No. The diff is computed locally in your browser — your text never leaves your device.",
      },
      {
        q: "Can I compare code?",
        a: "Yes. It works well for source code, JSON, YAML, logs, contracts and any plain text — indentation and whitespace are preserved.",
      },
    ],
    useCases: [
      "Reviewing edits between two versions of a document",
      "Spotting what changed in a config or JSON file",
      "Checking a contract revision before signing",
      "Comparing two snippets of code without git",
    ],
    metaExtra:
      "Free online text diff — compare two texts and highlight added and removed lines instantly, in your browser.",
  },
  ru: {
    intro:
      "Сравните два фрагмента текста и увидьте построчно, что именно изменилось. Этот бесплатный онлайн-инструмент сравнения текста мгновенно подсвечивает добавленные и удалённые строки прямо в браузере — вставьте старую и новую версию чего угодно (код, конфиг, договор, текст) и оцените изменения с первого взгляда. Ничего не загружается: сравнение выполняется на вашем устройстве.",
    benefits: [
      "Построчный diff с подсветкой добавленного/удалённого",
      "Живое сравнение по мере вставки — без кнопок",
      "Счётчик добавленных и удалённых строк",
      "Копирование унифицированного diff в один клик",
      "Всё в браузере — ничего не загружается",
    ],
    steps: [
      "Вставьте исходный текст слева.",
      "Вставьте изменённый текст справа.",
      "Прочитайте подсвеченные различия ниже.",
      "Скопируйте diff, если нужно поделиться.",
    ],
    faq: [
      {
        q: "Что показывает сравнение текста?",
        a: "Оно сравнивает две версии текста и отмечает, какие строки добавлены, удалены или не изменились — как git diff, но для любого текста.",
      },
      {
        q: "Сравнивает ли пословно?",
        a: "Сравнение построчное — это самый понятный вид для кода, конфигов и документов. Изменённая строка показывается как одна удалённая плюс одна добавленная.",
      },
      {
        q: "Мой текст куда-то загружается?",
        a: "Нет. Diff вычисляется локально в браузере — ваш текст не покидает устройство.",
      },
      {
        q: "Можно ли сравнивать код?",
        a: "Да. Подходит для исходного кода, JSON, YAML, логов, договоров и любого текста — отступы и пробелы сохраняются.",
      },
    ],
    useCases: [
      "Проверка правок между двумя версиями документа",
      "Поиск изменений в конфиге или JSON-файле",
      "Сверка редакции договора перед подписанием",
      "Сравнение двух фрагментов кода без git",
    ],
    metaExtra:
      "Бесплатное онлайн-сравнение текста — сравните два текста и подсветите добавленные и удалённые строки мгновенно, в браузере.",
  },
};

const cronContent: Content = {
  en: {
    intro:
      "Paste a cron expression and instantly see what it means in plain English plus the next times it will run. This free cron parser reads the standard five-field format (minute, hour, day-of-month, month, day-of-week) with ranges, lists, steps and names, so you can sanity-check a schedule before you commit it. Everything is computed in your browser.",
    benefits: [
      "Plain-English description of the schedule",
      "The next run times, in your local timezone",
      "A clear breakdown of all five fields",
      "Supports ranges, lists, steps and month/day names",
      "Runs in your browser — nothing is uploaded",
    ],
    steps: [
      "Type or paste your cron expression.",
      "Read the plain-English schedule.",
      "Check the next run times below.",
      "Adjust the fields until it's right.",
    ],
    faq: [
      {
        q: "What are the five cron fields?",
        a: "In order: minute (0–59), hour (0–23), day of month (1–31), month (1–12), and day of week (0–6, where 0 and 7 are both Sunday).",
      },
      {
        q: "What do *, - , / and , mean?",
        a: "* is every value, a-b is a range, */n is every n-th value, and a comma lists specific values. For example */15 in the minute field means every 15 minutes.",
      },
      {
        q: "How are day-of-month and day-of-week combined?",
        a: "If both are restricted, cron runs when either matches — a well-known quirk. If only one is set, only that one applies.",
      },
      {
        q: "What timezone are the next runs in?",
        a: "The upcoming run times are shown in your device's local timezone, so they match what you'd expect to see locally.",
      },
    ],
    useCases: [
      "Double-checking a crontab entry before deploying",
      "Understanding a schedule someone else wrote",
      "Learning cron syntax with instant feedback",
      "Verifying a CI or backup job runs when expected",
    ],
    metaExtra:
      "Free cron expression parser — explain any cron schedule in plain English and preview the next run times.",
  },
  ru: {
    intro:
      "Вставьте cron-выражение и сразу увидьте, что оно означает простыми словами, плюс ближайшие моменты запуска. Этот бесплатный парсер читает стандартный формат из пяти полей (минута, час, день месяца, месяц, день недели) с диапазонами, списками, шагами и названиями — чтобы проверить расписание до того, как поставить его в работу. Всё считается в браузере.",
    benefits: [
      "Описание расписания простыми словами",
      "Ближайшие запуски в вашем часовом поясе",
      "Понятный разбор всех пяти полей",
      "Диапазоны, списки, шаги и названия месяцев/дней",
      "Всё в браузере — ничего не загружается",
    ],
    steps: [
      "Введите или вставьте cron-выражение.",
      "Прочитайте расписание простыми словами.",
      "Проверьте ближайшие запуски ниже.",
      "Правьте поля, пока не получите нужное.",
    ],
    faq: [
      {
        q: "Что означают пять полей cron?",
        a: "По порядку: минута (0–59), час (0–23), день месяца (1–31), месяц (1–12) и день недели (0–6, где 0 и 7 — воскресенье).",
      },
      {
        q: "Что значат *, -, / и ,?",
        a: "* — любое значение, a-b — диапазон, */n — каждое n-е значение, запятая — список значений. Например, */15 в поле минут — каждые 15 минут.",
      },
      {
        q: "Как сочетаются день месяца и день недели?",
        a: "Если ограничены оба поля, cron срабатывает, когда совпадает любое из них — известная особенность. Если задано одно — применяется только оно.",
      },
      {
        q: "В каком часовом поясе показаны запуски?",
        a: "Ближайшие запуски показаны в локальном часовом поясе вашего устройства — так, как вы ожидаете увидеть их у себя.",
      },
    ],
    useCases: [
      "Проверка строки crontab перед деплоем",
      "Понимание расписания, написанного другим",
      "Изучение синтаксиса cron с мгновенной обратной связью",
      "Проверка, что задача CI или бэкапа запустится вовремя",
    ],
    metaExtra:
      "Бесплатный парсер cron-выражений — объясните любое cron-расписание простыми словами и посмотрите ближайшие запуски.",
  },
};

const vatCalc: Content = {
  en: {
    intro:
      "Work out VAT in seconds — add it to a net price, or pull it out of a gross one. Enter the amount and your VAT rate, switch between “add” and “remove”, and see the net, the VAT and the gross at once. Free, no sign-up.",
    benefits: ["Add VAT to a net amount", "Remove VAT from a gross amount", "Any VAT rate — 20%, 12%, 7.7%…", "Net, VAT and gross side by side", "Free — updates as you type"],
    steps: ["Enter the amount.", "Set your VAT rate.", "Choose add or remove VAT.", "Read net, VAT and gross."],
    faq: [
      { q: "How do I remove VAT from a price?", a: "Switch to “Remove VAT”: the calculator divides the gross by 1 + rate to get the net, and the difference is the VAT. For 20%, net = gross ÷ 1.2." },
      { q: "What VAT rate should I use?", a: "The standard rate where you trade — for example 20% in the UK, 19% in Germany, 12% in Kyrgyzstan. Enter any rate; the maths is the same." },
      { q: "Is it free?", a: "Yes, completely free, and it runs in your browser." },
    ],
    useCases: ["Invoicing and quotes", "Checking a supplier's VAT line", "Pricing with tax included", "Expense and receipt maths"],
    metaExtra: "Free VAT calculator — add or remove VAT at any rate and see net, tax and gross.",
  },
  ru: {
    intro:
      "Посчитайте НДС за секунды — начислите на цену без налога или выделите из цены с налогом. Введите сумму и ставку, переключайте «начислить/выделить» и сразу видите нетто, НДС и брутто. Бесплатно, без регистрации.",
    benefits: ["Начислить НДС на сумму без налога", "Выделить НДС из суммы с налогом", "Любая ставка — 20%, 12%, 5%…", "Нетто, НДС и брутто рядом", "Бесплатно — пересчёт на лету"],
    steps: ["Введите сумму.", "Укажите ставку НДС.", "Выберите начислить или выделить.", "Смотрите нетто, НДС и брутто."],
    faq: [
      { q: "Как выделить НДС из цены?", a: "Переключитесь на «Выделить НДС»: калькулятор делит сумму с налогом на 1 + ставка, а разница — это НДС. Для 20%: нетто = сумма ÷ 1,2." },
      { q: "Какую ставку указывать?", a: "Ставку вашей юрисдикции — например 12% в Кыргызстане, 20% в РФ и Великобритании, 19% в Германии. Введите любую — расчёт одинаков." },
      { q: "Это бесплатно?", a: "Да, полностью бесплатно и работает в браузере." },
    ],
    useCases: ["Счета и КП", "Проверка строки НДС у поставщика", "Ценообразование с налогом", "Расчёты по чекам и расходам"],
    metaExtra: "Бесплатный калькулятор НДС — начислить или выделить НДС по любой ставке: нетто, налог, брутто.",
  },
};

const discountCalc: Content = {
  en: {
    intro:
      "See the real price after a discount — and exactly how much you save. Enter the original price and the discount percentage; the final price and your saving update instantly. Free, no sign-up.",
    benefits: ["Final price after a % off", "How much you save in money", "Works with any price and percentage", "Instant — updates as you type", "Free — no sign-up"],
    steps: ["Enter the original price.", "Enter the discount percentage.", "Read the final price and saving.", "Copy the link to share the result."],
    faq: [
      { q: "How is the discount calculated?", a: "Final price = original × (1 − discount ÷ 100). The saving is the original minus the final price." },
      { q: "Can I stack two discounts?", a: "Apply them one after another: take the final price from the first discount and enter it as the original for the second. Stacked percentages don't simply add up." },
      { q: "Is it free?", a: "Yes, completely free." },
    ],
    useCases: ["Sales and promotions", "Comparing offers", "Budgeting a purchase", "Reselling and markdowns"],
    metaExtra: "Free discount calculator — final price after a percentage off and how much you save.",
  },
  ru: {
    intro:
      "Узнайте реальную цену после скидки — и сколько именно вы экономите. Введите цену без скидки и процент; итоговая цена и экономия считаются мгновенно. Бесплатно, без регистрации.",
    benefits: ["Цена после скидки в %", "Сколько экономите в деньгах", "Любая цена и процент", "Мгновенно — пересчёт на лету", "Бесплатно — без регистрации"],
    steps: ["Введите цену без скидки.", "Введите процент скидки.", "Смотрите итоговую цену и экономию.", "Скопируйте ссылку, чтобы поделиться."],
    faq: [
      { q: "Как считается скидка?", a: "Итоговая цена = цена × (1 − скидка ÷ 100). Экономия — это цена минус итог." },
      { q: "Можно ли сложить две скидки?", a: "Применяйте их последовательно: итог первой скидки введите как цену для второй. Проценты скидок не складываются напрямую." },
      { q: "Это бесплатно?", a: "Да, полностью бесплатно." },
    ],
    useCases: ["Распродажи и акции", "Сравнение предложений", "Планирование покупки", "Перепродажа и уценка"],
    metaExtra: "Бесплатный калькулятор скидки — итоговая цена после процента и размер экономии.",
  },
};

const compoundCalc: Content = {
  en: {
    intro:
      "See how money grows when interest earns interest. Enter a starting amount, an annual rate, how long you'll save and an optional monthly deposit — the calculator shows the future value, everything you put in, and the interest on top. Free, no sign-up.",
    benefits: ["Future value with compound interest", "Add a regular monthly deposit", "Choose the compounding frequency", "Splits contributions vs interest earned", "Free — updates as you type"],
    steps: ["Enter your starting amount.", "Set the annual rate and number of years.", "Add a monthly deposit and compounding.", "Read the future value and interest."],
    faq: [
      { q: "What is compound interest?", a: "Interest calculated on your original amount and on the interest already added. Over time it grows faster than simple interest, which only ever pays on the original." },
      { q: "Does compounding frequency matter?", a: "Yes — more frequent compounding (monthly or daily vs yearly) earns slightly more at the same rate, because interest is added and starts earning sooner." },
      { q: "Is this financial advice?", a: "No. It's a maths tool for planning; real returns, fees and tax vary. Confirm figures with a professional before relying on them." },
    ],
    useCases: ["Savings goals", "Retirement planning", "Comparing deposit accounts", "Understanding investment growth"],
    metaExtra: "Free compound interest calculator — future value with regular deposits and any compounding frequency.",
  },
  ru: {
    intro:
      "Посмотрите, как деньги растут, когда проценты начисляются на проценты. Введите начальную сумму, годовую ставку, срок и, по желанию, ежемесячный взнос — калькулятор покажет итоговую сумму, всё внесённое и проценты сверху. Бесплатно, без регистрации.",
    benefits: ["Итоговая сумма со сложным процентом", "Регулярный ежемесячный взнос", "Выбор частоты начисления", "Делит взносы и заработанные проценты", "Бесплатно — пересчёт на лету"],
    steps: ["Введите начальную сумму.", "Задайте ставку и число лет.", "Добавьте взнос и частоту начисления.", "Смотрите итог и проценты."],
    faq: [
      { q: "Что такое сложный процент?", a: "Проценты, которые начисляются и на исходную сумму, и на уже добавленные проценты. Со временем растёт быстрее простого процента, который платит только с исходной суммы." },
      { q: "Важна ли частота начисления?", a: "Да — более частое начисление (ежемесячно или ежедневно против раза в год) при той же ставке даёт чуть больше, потому что проценты добавляются и начинают работать раньше." },
      { q: "Это финансовый совет?", a: "Нет. Это инструмент для планирования; реальная доходность, комиссии и налоги различаются. Сверяйте цифры со специалистом." },
    ],
    useCases: ["Цели по накоплениям", "Планирование пенсии", "Сравнение вкладов", "Понимание роста инвестиций"],
    metaExtra: "Бесплатный калькулятор сложного процента — итоговая сумма с регулярными взносами и любой частотой начисления.",
  },
};

const marginCalc: Content = {
  en: {
    intro:
      "Work out profit margin and markup from a cost and a selling price — two numbers people mix up all the time. Enter the cost and the price; the calculator shows the profit, the margin (as a share of the price) and the markup (as a share of the cost). Free, no sign-up.",
    benefits: ["Profit margin and markup at once", "From any cost and selling price", "See the profit in money too", "Instant — updates as you type", "Free — no sign-up"],
    steps: ["Enter the cost.", "Enter the selling price.", "Read margin, markup and profit.", "Copy the link to share it."],
    faq: [
      { q: "What's the difference between margin and markup?", a: "Margin is profit as a share of the selling price; markup is profit as a share of the cost. A 50% markup on cost is only a 33% margin on price — that's why they're easy to confuse." },
      { q: "How do I calculate profit margin?", a: "Margin = (price − cost) ÷ price × 100. Subtract cost from price to get profit, then divide by the price." },
      { q: "Is it free?", a: "Yes, completely free." },
    ],
    useCases: ["Pricing products", "Freelance and service rates", "Reselling and retail", "Checking a supplier quote"],
    metaExtra: "Free margin calculator — profit margin and markup from cost and price, side by side.",
  },
  ru: {
    intro:
      "Посчитайте маржу и наценку из себестоимости и цены продажи — их постоянно путают. Введите себестоимость и цену; калькулятор покажет прибыль, маржу (доля от цены) и наценку (доля от себестоимости). Бесплатно, без регистрации.",
    benefits: ["Маржа и наценка сразу", "Из любой себестоимости и цены", "Прибыль в деньгах тоже", "Мгновенно — пересчёт на лету", "Бесплатно — без регистрации"],
    steps: ["Введите себестоимость.", "Введите цену продажи.", "Смотрите маржу, наценку и прибыль.", "Скопируйте ссылку, чтобы поделиться."],
    faq: [
      { q: "Чем маржа отличается от наценки?", a: "Маржа — прибыль как доля от цены продажи; наценка — прибыль как доля от себестоимости. Наценка 50% к себестоимости — это лишь 33% маржи от цены, поэтому их легко спутать." },
      { q: "Как посчитать маржу?", a: "Маржа = (цена − себестоимость) ÷ цена × 100. Вычтите себестоимость из цены — получите прибыль, затем разделите на цену." },
      { q: "Это бесплатно?", a: "Да, полностью бесплатно." },
    ],
    useCases: ["Ценообразование товаров", "Ставки фрилансера и услуг", "Перепродажа и розница", "Проверка КП поставщика"],
    metaExtra: "Бесплатный калькулятор маржи — маржа и наценка из себестоимости и цены рядом.",
  },
};

const dateDiffCalc: Content = {
  en: {
    intro:
      "Count the time between two dates — in days, weeks and months, plus a years-months-days breakdown. Pick a start and an end date and read the difference instantly. Free, no sign-up.",
    benefits: ["Days, weeks and months between dates", "A years-months-days breakdown", "Works with any two dates", "Instant — updates as you pick", "Free — no sign-up"],
    steps: ["Pick the start date.", "Pick the end date.", "Read the difference.", "Copy the link to share it."],
    faq: [
      { q: "How many days are between two dates?", a: "Pick both dates and the calculator counts the exact number of days between them, plus the same span in weeks and months." },
      { q: "Does it count the end date?", a: "It measures the span from the start date to the end date. Add one day if you need to count both endpoints inclusively." },
      { q: "Is it free?", a: "Yes, completely free and works in your browser." },
    ],
    useCases: ["Deadlines and countdowns", "Notice periods and contracts", "Project timelines", "Counting days until an event"],
    metaExtra: "Free date difference calculator — days, weeks and months between two dates, with a full breakdown.",
  },
  ru: {
    intro:
      "Считает время между двумя датами — в днях, неделях и месяцах, плюс разбивка «годы-месяцы-дни». Выберите дату начала и конца — разница считается сразу. Бесплатно, без регистрации.",
    benefits: ["Дни, недели и месяцы между датами", "Разбивка годы-месяцы-дни", "Любые две даты", "Мгновенно — пересчёт при выборе", "Бесплатно — без регистрации"],
    steps: ["Выберите дату начала.", "Выберите дату конца.", "Смотрите разницу.", "Скопируйте ссылку, чтобы поделиться."],
    faq: [
      { q: "Сколько дней между двумя датами?", a: "Выберите обе даты — калькулятор посчитает точное число дней между ними, а также тот же промежуток в неделях и месяцах." },
      { q: "Учитывается ли дата конца?", a: "Считается промежуток от даты начала до даты конца. Добавьте один день, если нужно включить обе граничные даты." },
      { q: "Это бесплатно?", a: "Да, полностью бесплатно и работает в браузере." },
    ],
    useCases: ["Дедлайны и обратный отсчёт", "Сроки уведомления и договоры", "Тайминг проектов", "Сколько дней до события"],
    metaExtra: "Бесплатный калькулятор разницы дат — дни, недели и месяцы между датами с полной разбивкой.",
  },
};

const content: Record<string, Content> = {
  invoice,
  "rental-yield": rentalYield,
  nda,
  "inspection-report": inspection,
  "hourly-rate": hourly,
  "self-employed-tax": tax,
  receipt,
  "utm-builder": utm,
  quote,
  "email-signature": sig,
  "ad-roi": adroi,
  "unit-economics": unitEcon,
  "purchase-order": po,
  "qr-code": qr,
  "delivery-note": delivery,
  timesheet,
  "gift-certificate": giftCert,
  "loan-calculator": loanCalc,
  "tip-calculator": tipCalc,
  "percentage-calculator": pctCalc,
  "password-generator": passwordGen,
  "json-formatter": jsonFormatter,
  base64: base64Content,
  "jwt-decoder": jwtContent,
  "regex-tester": regexContent,
  "url-encode": urlContent,
  uuid: uuidContent,
  hash: hashContent,
  timestamp: timestampContent,
  color: colorContent,
  "text-diff": diffContent,
  "cron-parser": cronContent,
  "vat-calculator": vatCalc,
  "discount-calculator": discountCalc,
  "compound-interest": compoundCalc,
  "margin-calculator": marginCalc,
  "date-difference": dateDiffCalc,
};

export function getToolContent(slug: string, locale: Locale): ToolContent | null {
  return content[slug]?.[locale] ?? null;
}
