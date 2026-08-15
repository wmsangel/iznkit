import { round2 } from "@/lib/format";

export interface PoItem {
  description: string;
  qty: number;
  price: number;
}

export interface PoData {
  theme: string;
  logo: string | null;
  buyerName: string;
  buyerDetails: string;
  supplierName: string;
  supplierDetails: string;
  number: string;
  date: string;
  deliveryDate: string;
  currency: string;
  items: PoItem[];
  taxRate: number;
  notes: string;
}

export function lineAmount(item: PoItem): number {
  return round2((Number(item.qty) || 0) * (Number(item.price) || 0));
}

export function poTotal(data: PoData): { subtotal: number; tax: number; total: number } {
  const subtotal = round2(data.items.reduce((s, it) => s + lineAmount(it), 0));
  const tax = round2(subtotal * ((Number(data.taxRate) || 0) / 100));
  return { subtotal, tax, total: round2(subtotal + tax) };
}

export function emptyPo(): PoData {
  const today = new Date();
  const delivery = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return {
    theme: "indigo",
    logo: null,
    buyerName: "",
    buyerDetails: "",
    supplierName: "",
    supplierDetails: "",
    number: "PO-0001",
    date: iso(today),
    deliveryDate: iso(delivery),
    currency: "USD",
    items: [{ description: "", qty: 1, price: 0 }],
    taxRate: 0,
    notes: "",
  };
}
