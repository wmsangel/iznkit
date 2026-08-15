import { round2 } from "@/lib/format";

export interface RentalData {
  currency: string;
  price: number;
  purchaseCosts: number;
  monthlyRent: number;
  vacancyRate: number; // %
  monthlyExpenses: number; // running costs excl. mortgage
  useMortgage: boolean;
  downPayment: number;
  interestRate: number; // annual %
  loanTermYears: number;
}

export interface RentalResults {
  annualRent: number;
  effectiveAnnualRent: number;
  annualExpenses: number;
  noi: number; // net operating income (before debt)
  grossYield: number; // ratio, e.g. 0.062
  netYield: number; // cap rate, ratio
  cashInvested: number;
  loanAmount: number;
  monthlyMortgage: number;
  annualDebtService: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  cashOnCash: number; // ratio
  paybackYears: number | null; // null when cash flow <= 0
}

/** Standard fixed-rate mortgage monthly payment. */
export function monthlyPayment(loan: number, annualRatePct: number, years: number): number {
  const n = Math.round(years * 12);
  if (loan <= 0 || n <= 0) return 0;
  const r = annualRatePct / 100 / 12;
  if (r === 0) return round2(loan / n);
  return round2((loan * r) / (1 - Math.pow(1 + r, -n)));
}

export function computeRental(d: RentalData): RentalResults {
  const price = num(d.price);
  const purchaseCosts = num(d.purchaseCosts);
  const annualRent = round2(num(d.monthlyRent) * 12);
  const vacancy = clamp(num(d.vacancyRate), 0, 100) / 100;
  const effectiveAnnualRent = round2(annualRent * (1 - vacancy));
  const annualExpenses = round2(num(d.monthlyExpenses) * 12);
  const noi = round2(effectiveAnnualRent - annualExpenses);

  const basis = price + purchaseCosts;
  const grossYield = price > 0 ? annualRent / price : 0;
  const netYield = basis > 0 ? noi / basis : 0;

  const loanAmount = d.useMortgage ? Math.max(0, price - num(d.downPayment)) : 0;
  const monthlyMortgage = d.useMortgage
    ? monthlyPayment(loanAmount, num(d.interestRate), num(d.loanTermYears))
    : 0;
  const annualDebtService = round2(monthlyMortgage * 12);

  const cashInvested = d.useMortgage
    ? round2(num(d.downPayment) + purchaseCosts)
    : round2(price + purchaseCosts);

  const annualCashFlow = round2(noi - annualDebtService);
  const monthlyCashFlow = round2(annualCashFlow / 12);
  const cashOnCash = cashInvested > 0 ? annualCashFlow / cashInvested : 0;
  const paybackYears =
    annualCashFlow > 0 && cashInvested > 0
      ? round2(cashInvested / annualCashFlow)
      : null;

  return {
    annualRent,
    effectiveAnnualRent,
    annualExpenses,
    noi,
    grossYield,
    netYield,
    cashInvested,
    loanAmount,
    monthlyMortgage,
    annualDebtService,
    monthlyCashFlow,
    annualCashFlow,
    cashOnCash,
    paybackYears,
  };
}

export function emptyRental(): RentalData {
  return {
    currency: "USD",
    price: 200000,
    purchaseCosts: 6000,
    monthlyRent: 1400,
    vacancyRate: 5,
    monthlyExpenses: 300,
    useMortgage: true,
    downPayment: 40000,
    interestRate: 6.5,
    loanTermYears: 25,
  };
}

function num(v: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}
