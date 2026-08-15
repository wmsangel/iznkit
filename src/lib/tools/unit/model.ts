import { round2 } from "@/lib/format";

export interface UnitData {
  currency: string;
  sellPrice: number;
  cogs: number; // cost of goods
  commissionPct: number; // marketplace commission %
  logistics: number; // per unit
  packaging: number; // per unit
  otherFees: number; // acquiring, storage… per unit
  adPerUnit: number; // ad cost per unit
  taxPct: number; // tax on revenue %
  returnRate: number; // %
}

export interface UnitResults {
  commission: number;
  tax: number;
  totalCosts: number;
  profit: number; // per sold unit
  margin: number; // ratio profit / price
  roi: number; // ratio profit / cogs
  adjustedProfit: number; // per shipped unit, accounting for returns
  breakEvenPrice: number;
}

function num(v: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function pct(v: number): number {
  return Math.min(100, Math.max(0, num(v))) / 100;
}

export function computeUnit(d: UnitData): UnitResults {
  const price = num(d.sellPrice);
  const cogs = num(d.cogs);
  const logistics = num(d.logistics);
  const commission = round2(price * pct(d.commissionPct));
  const tax = round2(price * pct(d.taxPct));
  const fixed = cogs + logistics + num(d.packaging) + num(d.otherFees) + num(d.adPerUnit);
  const totalCosts = round2(fixed + commission + tax);
  const profit = round2(price - totalCosts);
  const margin = price > 0 ? profit / price : 0;
  const roi = cogs > 0 ? profit / cogs : 0;

  // Returned units: you lose the margin and eat the return shipping.
  const r = pct(d.returnRate);
  const adjustedProfit = round2(profit * (1 - r) - r * logistics);

  // Break-even price: price*(1 - commission% - tax%) = fixed
  const rateSum = pct(d.commissionPct) + pct(d.taxPct);
  const breakEvenPrice = rateSum < 1 ? round2(fixed / (1 - rateSum)) : 0;

  return { commission, tax, totalCosts, profit, margin, roi, adjustedProfit, breakEvenPrice };
}

export function emptyUnit(): UnitData {
  return {
    currency: "RUB",
    sellPrice: 2500,
    cogs: 900,
    commissionPct: 17,
    logistics: 120,
    packaging: 30,
    otherFees: 50,
    adPerUnit: 150,
    taxPct: 6,
    returnRate: 8,
  };
}
