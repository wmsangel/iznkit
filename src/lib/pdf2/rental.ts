import { Doc, MUTED, SOFT_BG, LINE_SOFT } from "./layout";
import { drawWatermark, hex, kvRow, moneyCur } from "./util";
import { formatPercent } from "@/lib/format";
import { computeRental, type RentalData } from "@/lib/tools/rental/model";

export interface RentalLabels {
  docTitle: string;
  inputsHeading: string;
  resultsHeading: string;
  price: string;
  purchaseCosts: string;
  monthlyRent: string;
  vacancyRate: string;
  monthlyExpenses: string;
  downPayment: string;
  interestRate: string;
  loanTermYears: string;
  grossYield: string;
  netYield: string;
  monthlyCashFlow: string;
  annualCashFlow: string;
  cashOnCash: string;
  payback: string;
  noi: string;
  cashInvested: string;
  monthlyMortgage: string;
  years: string;
  na: string;
}

const ACCENT = hex("#4f46e5");

export async function buildRentalPdf(
  data: RentalData,
  labels: RentalLabels,
  brand: string,
  opts: { watermark?: boolean } = {},
): Promise<Uint8Array> {
  const d = await Doc.create({ margin: 48 });
  const r = computeRental(data);
  const c = data.currency;
  const m = (v: number) => moneyCur(v, c);

  if (opts.watermark) drawWatermark(d);

  d.text(labels.docTitle, { size: 22, bold: true, color: ACCENT });
  d.moveDown(12);

  const cards: [string, string][] = [
    [labels.grossYield, formatPercent(r.grossYield)],
    [labels.netYield, formatPercent(r.netYield)],
    [labels.monthlyCashFlow, m(r.monthlyCashFlow)],
    [labels.cashOnCash, formatPercent(r.cashOnCash)],
  ];
  const gap = 10;
  const cardW = (d.contentW - gap * 3) / 4;
  const cardH = 48;
  d.ensure(cardH);
  const top = d.y;
  cards.forEach(([lab, val], i) => {
    const x = d.margin + i * (cardW + gap);
    d.page.drawRectangle({
      x,
      y: top - cardH,
      width: cardW,
      height: cardH,
      color: SOFT_BG,
      borderColor: LINE_SOFT,
      borderWidth: 1,
    });
    d.page.drawText(lab.toUpperCase(), { x: x + 6, y: top - 14, size: 6.5, font: d.reg, color: MUTED });
    const size = val.length > 14 ? 10 : 13;
    d.page.drawText(val, { x: x + 6, y: top - 34, size, font: d.bold, color: ACCENT });
  });
  d.y = top - cardH - 18;

  const colW = (d.contentW - 24) / 2;
  const yStart = d.y;
  d.text(labels.inputsHeading, { size: 10, bold: true, color: MUTED, maxWidth: colW });
  kvRow(d, labels.price, m(data.price), { width: colW });
  kvRow(d, labels.purchaseCosts, m(data.purchaseCosts), { width: colW });
  kvRow(d, labels.monthlyRent, m(data.monthlyRent), { width: colW });
  kvRow(d, labels.vacancyRate, `${data.vacancyRate}%`, { width: colW });
  kvRow(d, labels.monthlyExpenses, m(data.monthlyExpenses), { width: colW });
  if (data.useMortgage) {
    kvRow(d, labels.downPayment, m(data.downPayment), { width: colW });
    kvRow(d, labels.interestRate, `${data.interestRate}%`, { width: colW });
    kvRow(d, labels.loanTermYears, `${data.loanTermYears} ${labels.years}`, { width: colW });
  }
  const leftEnd = d.y;

  d.y = yStart;
  const rx = d.margin + colW + 24;
  d.text(labels.resultsHeading, { x: rx, size: 10, bold: true, color: MUTED, maxWidth: colW });
  kvRow(d, labels.noi, m(r.noi), { x: rx, width: colW });
  kvRow(d, labels.cashInvested, m(r.cashInvested), { x: rx, width: colW });
  if (data.useMortgage) kvRow(d, labels.monthlyMortgage, m(r.monthlyMortgage), { x: rx, width: colW });
  kvRow(d, labels.annualCashFlow, m(r.annualCashFlow), { x: rx, width: colW });
  kvRow(d, labels.monthlyCashFlow, m(r.monthlyCashFlow), { x: rx, width: colW });
  kvRow(
    d,
    labels.payback,
    r.paybackYears === null ? labels.na : `${r.paybackYears} ${labels.years}`,
    { x: rx, width: colW },
  );
  d.y = Math.min(leftEnd, d.y);

  d.footer(brand);
  return d.save();
}
