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
  };
}
