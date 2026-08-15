import { round2 } from "@/lib/format";

export interface DeliveryItem {
  description: string;
  unit: string;
  qty: number;
  price: number;
}

export interface DeliveryData {
  theme: string;
  logo: string | null;
  shipperName: string;
  shipperDetails: string;
  consigneeName: string;
  consigneeDetails: string;
  number: string;
  date: string;
  currency: string;
  items: DeliveryItem[];
  notes: string;
}

export function lineAmount(item: DeliveryItem): number {
  return round2((Number(item.qty) || 0) * (Number(item.price) || 0));
}

export function deliveryTotals(data: DeliveryData): { total: number; totalQty: number } {
  const total = round2(data.items.reduce((s, it) => s + lineAmount(it), 0));
  const totalQty = round2(data.items.reduce((s, it) => s + (Number(it.qty) || 0), 0));
  return { total, totalQty };
}

export function emptyDelivery(): DeliveryData {
  return {
    theme: "indigo",
    logo: null,
    shipperName: "",
    shipperDetails: "",
    consigneeName: "",
    consigneeDetails: "",
    number: "DN-0001",
    date: new Date().toISOString().slice(0, 10),
    currency: "USD",
    items: [{ description: "", unit: "pcs", qty: 1, price: 0 }],
    notes: "",
  };
}
