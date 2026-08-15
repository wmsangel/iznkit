import { round2 } from "@/lib/format";

export interface TaxData {
  currency: string;
  income: number; // gross income for the period
  expenses: number;
  taxRate: number; // %
  deductExpenses: boolean; // tax on profit (true) or on gross (false)
  period: "month" | "year";
}

export interface TaxResults {
  base: number; // taxable base
  tax: number;
  afterTax: number; // income minus tax
  takeHome: number; // income minus expenses minus tax
  effectiveRate: number; // ratio of tax to gross income
}

function num(v: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function computeTax(d: TaxData): TaxResults {
  const income = num(d.income);
  const expenses = num(d.expenses);
  const rate = Math.min(100, Math.max(0, num(d.taxRate))) / 100;
  const base = d.deductExpenses ? Math.max(0, income - expenses) : income;
  const tax = round2(base * rate);
  const afterTax = round2(income - tax);
  const takeHome = round2(income - expenses - tax);
  const effectiveRate = income > 0 ? tax / income : 0;
  return { base: round2(base), tax, afterTax, takeHome, effectiveRate };
}

/** Quick-pick regimes. `deduct` = whether expenses reduce the taxable base. */
export interface TaxPreset {
  id: string;
  rate: number;
  deduct: boolean;
}

export const TAX_PRESETS: TaxPreset[] = [
  { id: "npd4", rate: 4, deduct: false },
  { id: "npd6", rate: 6, deduct: false },
  { id: "usn6", rate: 6, deduct: false },
  { id: "usn15", rate: 15, deduct: true },
  { id: "flat13", rate: 13, deduct: false },
];

export function emptyTax(): TaxData {
  return {
    currency: "RUB",
    income: 100000,
    expenses: 0,
    taxRate: 6,
    deductExpenses: false,
    period: "month",
  };
}
