import { round2 } from "@/lib/format";

export { round2 };

/** Line VAT rate. "none" = без НДС (exempt); "0" = 0% (taxed, e.g. export). */
export type VatRate = "20" | "10" | "0" | "none";

export interface SfItem {
  /** 1а — наименование товара (работ, услуг) */
  name: string;
  /** 2 — код единицы измерения (ОКЕИ, напр. 796) */
  unitCode: string;
  /** 2а — условное обозначение единицы (шт, кг, усл. ед.) */
  unit: string;
  /** 3 — количество (объём) */
  qty: number;
  /** 4 — цена за единицу без НДС */
  price: number;
  /** 6 — в том числе сумма акциза (текст, по умолчанию «без акциза») */
  excise: string;
  /** 7 — налоговая ставка */
  vatRate: VatRate;
  /** 10а — страна происхождения (краткое наименование) */
  country: string;
  /** 10 — цифровой код страны происхождения */
  countryCode: string;
  /** 11 — регистрационный номер декларации на товары / РНПТ */
  customsDecl: string;
}

export interface SfData {
  /** 1 — порядковый номер и дата составления */
  number: string;
  date: string;
  /** 1а — исправление № и дата (свободный текст, обычно пусто) */
  correction: string;
  /** 2 / 2а / 2б — продавец */
  sellerName: string;
  sellerAddress: string;
  sellerInn: string;
  sellerKpp: string;
  /** 3 — грузоотправитель и его адрес */
  shipper: string;
  /** 4 — грузополучатель и его адрес */
  consignee: string;
  /** 5 — к платёжно-расчётному документу */
  paymentDoc: string;
  /** 6 / 6а / 6б — покупатель */
  buyerName: string;
  buyerAddress: string;
  buyerInn: string;
  buyerKpp: string;
  /** 7 — валюта: наименование, код */
  currencyName: string;
  currencyCode: string;
  /** 8 — идентификатор государственного контракта (при наличии) */
  govContract: string;
  items: SfItem[];
  /** подписи */
  signerHead: string;
  signerAccountant: string;
  /** оформляется индивидуальным предпринимателем */
  isSoleTrader: boolean;
  /** ОГРНИП (для ИП) */
  ogrnip: string;
}

export interface SfTotals {
  base: number; // графа 5 — итого стоимость без НДС
  vat: number; // графа 8 — итого сумма НДС
  total: number; // графа 9 — всего к оплате с НДС
}

/** Numeric percent for a rate, or null for «без НДС». */
export function vatPercent(rate: VatRate): number | null {
  if (rate === "none") return null;
  return Number(rate);
}

/** Human label for the «налоговая ставка» column. */
export function vatLabel(rate: VatRate): string {
  return rate === "none" ? "без НДС" : `${rate}%`;
}

/** Графа 5 — стоимость без НДС. */
export function lineBase(it: SfItem): number {
  return round2((Number(it.qty) || 0) * (Number(it.price) || 0));
}

/** Графа 8 — сумма НДС по строке. */
export function lineVat(it: SfItem): number {
  const p = vatPercent(it.vatRate);
  if (!p) return 0;
  return round2(lineBase(it) * (p / 100));
}

/** Графа 9 — стоимость с НДС. */
export function lineTotal(it: SfItem): number {
  return round2(lineBase(it) + lineVat(it));
}

export function computeSfTotals(data: SfData): SfTotals {
  const base = round2(data.items.reduce((s, it) => s + lineBase(it), 0));
  const vat = round2(data.items.reduce((s, it) => s + lineVat(it), 0));
  const total = round2(data.items.reduce((s, it) => s + lineTotal(it), 0));
  return { base, vat, total };
}

export function emptySfItem(): SfItem {
  return {
    name: "",
    unitCode: "796",
    unit: "шт",
    qty: 1,
    price: 0,
    excise: "без акциза",
    vatRate: "20",
    country: "—",
    countryCode: "—",
    customsDecl: "",
  };
}

export function emptySf(): SfData {
  const today = new Date().toISOString().slice(0, 10);
  return {
    number: "1",
    date: today,
    correction: "",
    sellerName: "",
    sellerAddress: "",
    sellerInn: "",
    sellerKpp: "",
    shipper: "он же",
    consignee: "",
    paymentDoc: "",
    buyerName: "",
    buyerAddress: "",
    buyerInn: "",
    buyerKpp: "",
    currencyName: "Российский рубль",
    currencyCode: "643",
    govContract: "",
    items: [emptySfItem()],
    signerHead: "",
    signerAccountant: "",
    isSoleTrader: false,
    ogrnip: "",
  };
}
