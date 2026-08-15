import { round2 } from "@/lib/format";

export interface ReceiptItem {
  description: string;
  qty: number;
  price: number;
}

export type PaymentMethod = "cash" | "card" | "transfer" | "other";

export interface ReceiptData {
  theme: string;
  logo: string | null;
  fromName: string;
  fromDetails: string;
  toName: string;
  number: string;
  date: string;
  method: PaymentMethod;
  currency: string;
  items: ReceiptItem[];
  taxRate: number;
  notes: string;
}

export const METHODS: PaymentMethod[] = ["cash", "card", "transfer", "other"];

export function lineAmount(item: ReceiptItem): number {
  return round2((Number(item.qty) || 0) * (Number(item.price) || 0));
}

export function receiptTotal(data: ReceiptData): { subtotal: number; tax: number; total: number } {
  const subtotal = round2(data.items.reduce((s, it) => s + lineAmount(it), 0));
  const tax = round2(subtotal * ((Number(data.taxRate) || 0) / 100));
  return { subtotal, tax, total: round2(subtotal + tax) };
}

export function emptyReceipt(): ReceiptData {
  return {
    theme: "indigo",
    logo: null,
    fromName: "",
    fromDetails: "",
    toName: "",
    number: "0001",
    date: new Date().toISOString().slice(0, 10),
    method: "card",
    currency: "USD",
    items: [{ description: "", qty: 1, price: 0 }],
    taxRate: 0,
    notes: "",
  };
}
