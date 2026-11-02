import { Doc, MUTED, SOFT_BG, LINE_SOFT } from "./layout";
import { drawWatermark, hex, kvRow, moneyCur } from "./util";
import { formatPercent } from "@/lib/format";
import { computeTax, type TaxData } from "@/lib/tools/tax/model";

export interface TaxLabels {
  docTitle: string;
  inputsHeading: string;
  resultsHeading: string;
  income: string;
  expenses: string;
  taxRate: string;
  base: string;
  taxLabel: string;
  afterTax: string;
  takeHome: string;
  effectiveRate: string;
  perMonth: string;
  perYear: string;
  disclaimer: string;
}

const ACCENT = hex("#4f46e5");

export async function buildTaxPdf(
  data: TaxData,
  labels: TaxLabels,
  brand: string,
  opts: { watermark?: boolean } = {},
): Promise<Uint8Array> {
  const d = await Doc.create({ margin: 48 });
  const r = computeTax(data);
  const c = data.currency;
  const m = (v: number) => moneyCur(v, c);
  const periodLabel = data.period === "year" ? labels.perYear : labels.perMonth;

  if (opts.watermark) drawWatermark(d);

  d.text(labels.docTitle, { size: 22, bold: true, color: ACCENT });
  d.text(periodLabel, { size: 10, color: MUTED });
  d.moveDown(10);

  const cards: [string, string][] = [
    [labels.taxLabel, m(r.tax)],
    [labels.takeHome, m(r.takeHome)],
    [labels.effectiveRate, formatPercent(r.effectiveRate)],
  ];
  const gap = 10;
  const cardW = (d.contentW - gap * 2) / 3;
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
    d.page.drawText(lab.toUpperCase(), { x: x + 8, y: top - 14, size: 7, font: d.reg, color: MUTED });
    const size = val.length > 16 ? 11 : 13;
    d.page.drawText(val, { x: x + 8, y: top - 34, size, font: d.bold, color: ACCENT });
  });
  d.y = top - cardH - 18;

  const colW = (d.contentW - 24) / 2;
  const yStart = d.y;
  d.text(labels.inputsHeading, { size: 10, bold: true, color: MUTED, maxWidth: colW });
  kvRow(d, labels.income, m(data.income), { width: colW });
  kvRow(d, labels.expenses, m(data.expenses), { width: colW });
  kvRow(d, labels.taxRate, `${data.taxRate}%`, { width: colW });
  const leftEnd = d.y;

  d.y = yStart;
  const rx = d.margin + colW + 24;
  d.text(labels.resultsHeading, { x: rx, size: 10, bold: true, color: MUTED, maxWidth: colW });
  kvRow(d, labels.base, m(r.base), { x: rx, width: colW });
  kvRow(d, labels.taxLabel, m(r.tax), { x: rx, width: colW });
  kvRow(d, labels.afterTax, m(r.afterTax), { x: rx, width: colW });
  kvRow(d, labels.takeHome, m(r.takeHome), { x: rx, width: colW });
  d.y = Math.min(leftEnd, d.y);

  d.moveDown(20);
  d.text(labels.disclaimer, { size: 8, color: MUTED, lineGap: 1.4 });

  d.footer(brand);
  return d.save();
}
