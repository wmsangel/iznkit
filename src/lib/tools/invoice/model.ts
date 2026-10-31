import { round2, formatMoney, CURRENCIES } from "@/lib/format";

export { round2, formatMoney, CURRENCIES };

export interface InvoiceItem {
  description: string;
  qty: number;
  price: number;
}

export interface InvoiceData {
  /** Visual design template id (see invoice/templates.ts). */
  template: string;
  /** Optional logo as a data URL (image/png|jpeg). Stored locally only. */
  logo: string | null;
  fromName: string;
  fromDetails: string;
  toName: string;
  toDetails: string;
  number: string;
  date: string;
  dueDate: string;
  currency: string;
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
  /**
   * Optional RU bank-transfer payment QR (ГОСТ Р 56042-2014, format ST00012).
   * The QR is rendered on the PDF only when the mandatory requisites are filled
   * (payeeName, payeeAcc, payeeBankName, payeeBic, payeeCorrAcc). Rubles.
   */
  payeeName: string;
  payeeAcc: string;
  payeeBankName: string;
  payeeBic: string;
  payeeCorrAcc: string;
  payeeInn: string;
  payeeKpp: string;
  payPurpose: string;
}

export interface InvoiceTotals {
  subtotal: number;
  tax: number;
  total: number;
}

export function lineAmount(item: InvoiceItem): number {
  return round2((Number(item.qty) || 0) * (Number(item.price) || 0));
}

export function computeTotals(data: InvoiceData): InvoiceTotals {
  const subtotal = round2(
    data.items.reduce((sum, item) => sum + lineAmount(item), 0),
  );
  const tax = round2(subtotal * ((Number(data.taxRate) || 0) / 100));
  const total = round2(subtotal + tax);
  return { subtotal, tax, total };
}

export function emptyInvoice(): InvoiceData {
  const today = new Date();
  const due = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return {
    template: "classic",
    logo: null,
    fromName: "",
    fromDetails: "",
    toName: "",
    toDetails: "",
    number: "0001",
    date: iso(today),
    dueDate: iso(due),
    currency: "USD",
    items: [{ description: "", qty: 1, price: 0 }],
    taxRate: 0,
    notes: "",
    payeeName: "",
    payeeAcc: "",
    payeeBankName: "",
    payeeBic: "",
    payeeCorrAcc: "",
    payeeInn: "",
    payeeKpp: "",
    payPurpose: "",
  };
}

/**
 * Build the ГОСТ Р 56042-2014 payment-QR payload (ST00012 / UTF-8) from the
 * invoice's RU requisites, or null when a mandatory field is missing. Sum is in
 * kopecks. Values are stripped of the `|` field separator to stay well-formed.
 * Source of the format: ГОСТ Р 56042-2014, п. 5 (Структура данных).
 */
export function gostQrPayload(data: InvoiceData, total: number): string | null {
  const clean = (v: string) => (v || "").replace(/\|/g, " ").trim();
  const name = clean(data.payeeName);
  const acc = clean(data.payeeAcc);
  const bank = clean(data.payeeBankName);
  const bic = clean(data.payeeBic);
  const corr = clean(data.payeeCorrAcc);
  if (!name || !acc || !bank || !bic || !corr) return null;

  const parts = [
    "ST00012",
    `Name=${name}`,
    `PersonalAcc=${acc}`,
    `BankName=${bank}`,
    `BIC=${bic}`,
    `CorrespAcc=${corr}`,
  ];
  const sumKop = Math.round((Number(total) || 0) * 100);
  if (sumKop > 0) parts.push(`Sum=${sumKop}`);
  const purpose = clean(data.payPurpose) || `Оплата по счету № ${clean(data.number)}`;
  parts.push(`Purpose=${purpose}`);
  if (clean(data.payeeInn)) parts.push(`PayeeINN=${clean(data.payeeInn)}`);
  if (clean(data.payeeKpp)) parts.push(`KPP=${clean(data.payeeKpp)}`);
  return parts.join("|");
}
