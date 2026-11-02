import { Doc, MUTED, SOFT_BG, LINE_SOFT } from "./layout";
import { drawWatermark, hex, kvRow, moneyCur } from "./util";
import { formatPercent } from "@/lib/format";
import { computeAdRoi, type AdRoiData } from "@/lib/tools/adroi/model";

export interface AdRoiLabels {
  docTitle: string;
  inputsHeading: string;
  resultsHeading: string;
  adSpend: string;
  revenue: string;
  grossMargin: string;
  otherCosts: string;
  roas: string;
  roi: string;
  netProfit: string;
  grossProfit: string;
  breakEvenRoas: string;
  disclaimer: string;
}

const ACCENT = hex("#4f46e5");

export async function buildAdRoiPdf(
  data: AdRoiData,
  labels: AdRoiLabels,
  brand: string,
  opts: { watermark?: boolean } = {},
): Promise<Uint8Array> {
  const d = await Doc.create({ margin: 48 });
  const r = computeAdRoi(data);
  const c = data.currency;
  const m = (v: number) => moneyCur(v, c);

  if (opts.watermark) drawWatermark(d);

  d.text(labels.docTitle, { size: 22, bold: true, color: ACCENT });
  d.moveDown(12);

  // Summary cards.
  const cards: [string, string][] = [
    [labels.roas, `${r.roas}×`],
    [labels.roi, formatPercent(r.roi)],
    [labels.netProfit, m(r.netProfit)],
    [labels.breakEvenRoas, `${r.breakEvenRoas}×`],
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
    d.page.drawText(lab.toUpperCase(), { x: x + 8, y: top - 14, size: 7, font: d.reg, color: MUTED });
    d.page.drawText(val, { x: x + 8, y: top - 34, size: 13, font: d.bold, color: ACCENT });
  });
  d.y = top - cardH - 18;

  const colW = (d.contentW - 24) / 2;
  const yStart = d.y;
  d.text(labels.inputsHeading, { size: 10, bold: true, color: MUTED, maxWidth: colW });
  kvRow(d, labels.adSpend, m(data.adSpend), { width: colW });
  kvRow(d, labels.revenue, m(data.revenue), { width: colW });
  kvRow(d, labels.grossMargin, `${data.grossMargin}%`, { width: colW });
  kvRow(d, labels.otherCosts, m(data.otherCosts), { width: colW });
  const leftEnd = d.y;

  d.y = yStart;
  const rx = d.margin + colW + 24;
  d.text(labels.resultsHeading, { x: rx, size: 10, bold: true, color: MUTED, maxWidth: colW });
  kvRow(d, labels.grossProfit, m(r.grossProfit), { x: rx, width: colW });
  kvRow(d, labels.netProfit, m(r.netProfit), { x: rx, width: colW });
  kvRow(d, labels.roas, `${r.roas}×`, { x: rx, width: colW });
  d.y = Math.min(leftEnd, d.y);

  d.moveDown(20);
  d.text(labels.disclaimer, { size: 8, color: MUTED, lineGap: 1.4 });

  d.footer(brand);
  return d.save();
}
