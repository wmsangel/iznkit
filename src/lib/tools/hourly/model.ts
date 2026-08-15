import { round2 } from "@/lib/format";

export interface HourlyData {
  currency: string;
  desiredIncome: number; // desired yearly take-home (after tax)
  expenses: number; // yearly business expenses
  taxRate: number; // %
  billableHoursPerWeek: number;
  workWeeksPerYear: number;
  profitMargin: number; // % buffer on top
}

export interface HourlyResults {
  billableHoursPerYear: number;
  preTaxIncome: number; // income needed before tax
  revenueNeeded: number; // billing target for the year
  hourlyRate: number;
  dayRate: number;
  monthlyRevenue: number;
}

function num(v: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function clampPct(v: number): number {
  return Math.min(99, Math.max(0, num(v)));
}

export function computeHourly(d: HourlyData): HourlyResults {
  const hoursPerYear = round2(
    num(d.billableHoursPerWeek) * num(d.workWeeksPerYear),
  );
  const taxRate = clampPct(d.taxRate) / 100;
  const margin = clampPct(d.profitMargin) / 100;

  // Gross up the desired take-home for tax, add expenses, add a profit buffer.
  const preTaxIncome = taxRate < 1 ? round2(num(d.desiredIncome) / (1 - taxRate)) : 0;
  let revenueNeeded = preTaxIncome + num(d.expenses);
  revenueNeeded = margin < 1 ? round2(revenueNeeded / (1 - margin)) : revenueNeeded;

  const hourlyRate = hoursPerYear > 0 ? round2(revenueNeeded / hoursPerYear) : 0;
  return {
    billableHoursPerYear: hoursPerYear,
    preTaxIncome,
    revenueNeeded: round2(revenueNeeded),
    hourlyRate,
    dayRate: round2(hourlyRate * 8),
    monthlyRevenue: round2(revenueNeeded / 12),
  };
}

export function emptyHourly(): HourlyData {
  return {
    currency: "USD",
    desiredIncome: 60000,
    expenses: 6000,
    taxRate: 20,
    billableHoursPerWeek: 25,
    workWeeksPerYear: 46,
    profitMargin: 10,
  };
}
