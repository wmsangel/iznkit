import { round2 } from "@/lib/format";

export interface AdRoiData {
  currency: string;
  adSpend: number;
  revenue: number;
  grossMargin: number; // % of revenue that is gross profit
  otherCosts: number; // fixed extra costs (creative, tools…)
}

export interface AdRoiResults {
  roas: number; // revenue / spend
  grossProfit: number;
  netProfit: number; // grossProfit - spend - otherCosts
  roi: number; // ratio: netProfit / spend
  breakEvenRoas: number; // revenue per 1 of spend to break even
  cpaHint: number; // spend share — kept simple
}

function num(v: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function computeAdRoi(d: AdRoiData): AdRoiResults {
  const spend = num(d.adSpend);
  const revenue = num(d.revenue);
  const margin = Math.min(100, Math.max(0, num(d.grossMargin))) / 100;
  const other = num(d.otherCosts);

  const grossProfit = round2(revenue * margin);
  const netProfit = round2(grossProfit - spend - other);
  return {
    roas: spend > 0 ? round2(revenue / spend) : 0,
    grossProfit,
    netProfit,
    roi: spend > 0 ? netProfit / spend : 0,
    breakEvenRoas: margin > 0 ? round2(1 / margin) : 0,
    cpaHint: spend,
  };
}

export function emptyAdRoi(): AdRoiData {
  return { currency: "USD", adSpend: 1000, revenue: 4000, grossMargin: 60, otherCosts: 0 };
}
