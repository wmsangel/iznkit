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
      "Бесплатный онлайн генератор счёта с логотипом, налогом, валютами и мгновенным скачиванием PDF.",
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
      "Free NDA generator: one-way or mutual non-disclosure agreement with clear clauses and a signed-ready PDF.",
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
      "Бесплатная оценка налога фрилансера — налог, «на руки» и эффективная ставка с быстрыми пресетами режимов.",
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
};

export function getToolContent(slug: string, locale: Locale): ToolContent | null {
  return content[slug]?.[locale] ?? null;
}
