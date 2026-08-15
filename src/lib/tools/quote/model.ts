import { round2 } from "@/lib/format";

export interface QuoteItem {
  description: string;
  qty: number;
  price: number;
}

export interface QuoteData {
  theme: string;
  logo: string | null;
  projectTitle: string;
  fromName: string;
  fromDetails: string;
  toName: string;
  toDetails: string;
  number: string;
  date: string;
  validUntil: string;
  currency: string;
  items: QuoteItem[];
  taxRate: number;
  notes: string;
}

export function lineAmount(item: QuoteItem): number {
  return round2((Number(item.qty) || 0) * (Number(item.price) || 0));
}

export function quoteTotal(data: QuoteData): { subtotal: number; tax: number; total: number } {
  const subtotal = round2(data.items.reduce((s, it) => s + lineAmount(it), 0));
  const tax = round2(subtotal * ((Number(data.taxRate) || 0) / 100));
  return { subtotal, tax, total: round2(subtotal + tax) };
}

export function emptyQuote(): QuoteData {
  const today = new Date();
  const valid = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return {
    theme: "indigo",
    logo: null,
    projectTitle: "",
    fromName: "",
    fromDetails: "",
    toName: "",
    toDetails: "",
    number: "Q-0001",
    date: iso(today),
    validUntil: iso(valid),
    currency: "USD",
    items: [{ description: "", qty: 1, price: 0 }],
    taxRate: 0,
    notes: "",
  };
}
