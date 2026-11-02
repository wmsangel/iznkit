import { Doc, MUTED, SOFT_BG, LINE_SOFT } from "./layout";
import { drawWatermark, hex, kvRow, moneyCur } from "./util";
import { formatPercent } from "@/lib/format";
import { computeUnit, type UnitData } from "@/lib/tools/unit/model";

export interface UnitLabels {
  docTitle: string;
  inputsHeading: string;
  resultsHeading: string;
  sellPrice: string;
  cogs: string;
  commissionPct: string;
  logistics: string;
  packaging: string;
  otherFees: string;
  adPerUnit: string;
  taxPct: string;
  returnRate: string;
  profit: string;
  margin: string;
  roi: string;
  adjustedProfit: string;
  commission: string;
  tax: string;
  totalCosts: string;
  breakEvenPrice: string;
  disclaimer: string;
}

const ACCENT = hex("#4f46e5");
const GOOD = hex("#059669");
const BAD = hex("#e11d48");

export async function buildUnitPdf(
  data: UnitData,
  labels: UnitLabels,
  brand: string,
  opts: { watermark?: boolean } = {},
): Promise<Uint8Array> {
  const d = await Doc.create({ margin: 48 });
  const r = computeUnit(data);
  const c = data.currency;
  const m = (v: number) => moneyCur(v, c);
  const profitColor = r.profit >= 0 ? GOOD : BAD;

  if (opts.watermark) drawWatermark(d);

  d.text(labels.docTitle, { size: 22, bold: true, color: ACCENT });
  d.moveDown(12);

  const cards: [string, string, ReturnType<typeof hex>][] = [
    [labels.profit, m(r.profit), profitColor],
    [labels.margin, formatPercent(r.margin), ACCENT],
    [labels.roi, formatPercent(r.roi), ACCENT],
    [labels.adjustedProfit, m(r.adjustedProfit), ACCENT],
  ];
  const gap = 10;
  const cardW = (d.contentW - gap * 3) / 4;
  const cardH = 48;
  d.ensure(cardH);
  const top = d.y;
  cards.forEach(([lab, val, color], i) => {
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
    d.page.drawText(val, { x: x + 6, y: top - 34, size, font: d.bold, color });
  });
  d.y = top - cardH - 18;

  const colW = (d.contentW - 24) / 2;
  const yStart = d.y;
  d.text(labels.inputsHeading, { size: 10, bold: true, color: MUTED, maxWidth: colW });
  kvRow(d, labels.sellPrice, m(data.sellPrice), { width: colW });
  kvRow(d, labels.cogs, m(data.cogs), { width: colW });
  kvRow(d, labels.commissionPct, `${data.commissionPct}%`, { width: colW });
  kvRow(d, labels.logistics, m(data.logistics), { width: colW });
  kvRow(d, labels.packaging, m(data.packaging), { width: colW });
  kvRow(d, labels.otherFees, m(data.otherFees), { width: colW });
  kvRow(d, labels.adPerUnit, m(data.adPerUnit), { width: colW });
  kvRow(d, labels.taxPct, `${data.taxPct}%`, { width: colW });
  kvRow(d, labels.returnRate, `${data.returnRate}%`, { width: colW });
  const leftEnd = d.y;

  d.y = yStart;
  const rx = d.margin + colW + 24;
  d.text(labels.resultsHeading, { x: rx, size: 10, bold: true, color: MUTED, maxWidth: colW });
  kvRow(d, labels.commission, m(r.commission), { x: rx, width: colW });
  kvRow(d, labels.tax, m(r.tax), { x: rx, width: colW });
  kvRow(d, labels.totalCosts, m(r.totalCosts), { x: rx, width: colW });
  kvRow(d, labels.profit, m(r.profit), { x: rx, width: colW });
  kvRow(d, labels.breakEvenPrice, m(r.breakEvenPrice), { x: rx, width: colW });
  d.y = Math.min(leftEnd, d.y);

  d.moveDown(20);
  d.text(labels.disclaimer, { size: 8, color: MUTED, lineGap: 1.4 });

  d.footer(brand);
  return d.save();
}
