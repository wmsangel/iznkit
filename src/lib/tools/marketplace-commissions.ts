/**
 * Marketplace seller commission REFERENCE ranges (Ozon / Wildberries / Yandex Market).
 *
 * ⚠️ These are dated reference ranges, NOT an official offer. The authoritative
 * per-category / per-предмет rate lives behind each marketplace's seller dashboard
 * and changes often (all three raised commissions in 2026, folding logistics into
 * the commission line). Numbers below are from reputable RU seller blogs, 2026-04
 * to 2026-09, shown as ranges. Always verify the exact rate in your own account —
 * every block links the official page. Update `asOf` + rows when rates change.
 */
export interface Bi {
  en: string;
  ru: string;
}
export interface CommissionRow {
  cat: Bi;
  /** Rate or range, locale-neutral, e.g. "≈52%", "10–55%", "43.5% / 48%". */
  rate: string;
  model?: Bi;
}
export interface MarketplaceCommission {
  id: "ozon" | "wildberries" | "yandex-market";
  name: string;
  asOf: Bi;
  officialUrl: string;
  headers: { cat: Bi; rate: Bi; model: Bi };
  structure: Bi;
  rows: CommissionRow[];
  note: Bi;
}

export const COMMISSION_UPDATED = "2026-09-28";

export const MARKETPLACE_COMMISSIONS: MarketplaceCommission[] = [
  {
    id: "ozon",
    name: "Ozon",
    asOf: { en: "September 2026", ru: "сентябрь 2026" },
    officialUrl:
      "https://seller-edu.ozon.ru/commissions-tariffs/legal-information/full-actual-commissions",
    headers: {
      cat: { en: "Category", ru: "Категория" },
      rate: { en: "Commission (>300₽)", ru: "Комиссия (>300₽)" },
      model: { en: "Note", ru: "Примечание" },
    },
    structure: {
      en: "Sale commission + acquiring (~1.5%) + logistics + returns handling + storage. In 2026 FBO and FBS commission rates were unified for most product types — only logistics/storage differ by scheme.",
      ru: "Вознаграждение за продажу + эквайринг (~1,5%) + логистика + обработка возвратов + хранение. В 2026 ставки FBO и FBS уравняли для большинства типов товаров — по схемам различаются лишь логистика и хранение.",
    },
    rows: [
      { cat: { en: "Clothing", ru: "Одежда" }, rate: "≈52%" },
      { cat: { en: "Footwear", ru: "Обувь" }, rate: "≈52%" },
      { cat: { en: "Beauty & personal care", ru: "Красота и гигиена" }, rate: "≈52%" },
      { cat: { en: "Home & garden", ru: "Товары для дома, сад" }, rate: "10–55%" },
      { cat: { en: "Sports & outdoor", ru: "Спорт и отдых" }, rate: "2–55%" },
      { cat: { en: "Appliances", ru: "Бытовая техника" }, rate: "≈51%" },
      { cat: { en: "DIY & renovation", ru: "Стройка и ремонт" }, rate: "18–54%" },
      { cat: { en: "Pharmacy", ru: "Аптека" }, rate: "2–54%" },
      { cat: { en: "Hobby & crafts", ru: "Хобби и творчество" }, rate: "21–53%" },
      { cat: { en: "Pet supplies", ru: "Зоотовары" }, rate: "≈48%" },
      { cat: { en: "Auto", ru: "Автотовары" }, rate: "4–50%" },
      { cat: { en: "Electronics", ru: "Электроника" }, rate: "10–50%" },
      { cat: { en: "Food & grocery", ru: "Продукты питания" }, rate: "23–43%" },
    ],
    note: {
      en: "Cheap items are charged less: ≤100₽ → 17%, 101–300₽ → 23%. Category rates rose sharply with the 28.08.2026 change — verify your exact «вознаграждение» in the seller cabinet (Цены и акции).",
      ru: "Дешёвые товары дешевле по комиссии: ≤100₽ → 17%, 101–300₽ → 23%. Ставки категорий резко выросли с изменения 28.08.2026 — точное «вознаграждение» смотрите в кабинете (Цены и акции).",
    },
  },
  {
    id: "wildberries",
    name: "Wildberries",
    asOf: { en: "August 2026", ru: "август 2026" },
    officialUrl: "https://seller.wildberries.ru/dynamic-product-categories/commission",
    headers: {
      cat: { en: "Item (предмет)", ru: "Предмет" },
      rate: { en: "FBW / FBS", ru: "FBW / FBS" },
      model: { en: "Note", ru: "Примечание" },
    },
    structure: {
      en: "Base КВВ (commission per redemption) by предмет + logistics + return logistics + acceptance + storage + tariff options + fines. Rate also varies by seller level, СПП discount and shipping speed. DBS / C&C use separate, higher tables.",
      ru: "Базовый КВВ (комиссия за выкуп) по предмету + логистика + обратная логистика + приёмка + хранение + опции тарифов + штрафы. Ставка зависит и от уровня продавца, скидки СПП и скорости отгрузки. DBS / C&C — отдельные, более высокие таблицы.",
    },
    rows: [
      { cat: { en: "T-shirts", ru: "Футболки" }, rate: "43.5% / 48%" },
      { cat: { en: "Dresses", ru: "Платья" }, rate: "43.5% / 48%" },
      { cat: { en: "Sneakers", ru: "Кроссовки" }, rate: "41.5% / 46%" },
      { cat: { en: "Smartphones", ru: "Смартфоны" }, rate: "25.5% / 30%" },
    ],
    note: {
      en: "WB sets rates per предмет, not per broad category — these are sample items only. Look up your exact предмет in WB Partners → Тарифы → Комиссия; the parent category is not enough.",
      ru: "WB задаёт ставки по предмету, а не по широкой категории — это лишь примеры. Свой точный предмет смотрите в WB Partners → Тарифы → Комиссия; родительской категории недостаточно.",
    },
  },
  {
    id: "yandex-market",
    name: "Yandex Market",
    asOf: { en: "2026 (changed 01.04 & 01.09)", ru: "2026 (менялись 01.04 и 01.09)" },
    officialUrl: "https://partner.market.yandex.ru/",
    headers: {
      cat: { en: "Category", ru: "Категория" },
      rate: { en: "Placement rate", ru: "Ставка размещения" },
      model: { en: "Note", ru: "Примечание" },
    },
    structure: {
      en: "Placement rate (per category/model) + payment acceptance 1.6–3.3% + volumetric logistics + storage (FBY) + non-redemption/return fees + order handling (~25₽). The placement rate is mostly the same across FBY/FBS/DBS/Express; schemes differ in storage/logistics.",
      ru: "Ставка за размещение (по категории/модели) + приём платежа 1,6–3,3% + объёмная логистика + хранение (FBY) + плата за невыкуп/возврат + обработка заказа (~25₽). Ставка размещения почти одинакова для FBY/FBS/DBS/Express; схемы различаются хранением/логистикой.",
    },
    rows: [
      { cat: { en: "Appliances", ru: "Бытовая техника" }, rate: "3–8%" },
      { cat: { en: "Electronics & accessories", ru: "Электроника и аксессуары" }, rate: "5–15%" },
      { cat: { en: "Auto", ru: "Автотовары" }, rate: "5–12%" },
      { cat: { en: "Home & furniture", ru: "Дом и мебель" }, rate: "6–14%" },
      { cat: { en: "Pet supplies", ru: "Зоотовары" }, rate: "6–12%" },
      { cat: { en: "Sports & outdoor", ru: "Спорт и отдых" }, rate: "6–12%" },
      { cat: { en: "Stationery & hobby", ru: "Канцелярия и хобби" }, rate: "6–12%" },
      { cat: { en: "Kids", ru: "Детские товары" }, rate: "7–15%" },
      { cat: { en: "Beauty & health", ru: "Красота и здоровье" }, rate: "8–18%" },
      { cat: { en: "Clothing & footwear", ru: "Одежда и обувь" }, rate: "10–20%" },
    ],
    note: {
      en: "This is the PLACEMENT rate only — the all-in cost (with logistics, storage, acquiring) is much higher; some sources show 27–51% all-in for clothing. Small items ≤5 l have fixed combined rates: 35% FBY / 42% FBS. Download the current tariff file in partner.market.yandex.ru → Тарифы.",
      ru: "Это только ставка РАЗМЕЩЕНИЯ — итоговая стоимость (с логистикой, хранением, эквайрингом) заметно выше; отдельные источники дают 27–51% all-in для одежды. Мелкие товары ≤5 л — фиксированные комбинированные ставки: 35% FBY / 42% FBS. Актуальные тарифы скачивайте в partner.market.yandex.ru → Тарифы.",
    },
  },
];
