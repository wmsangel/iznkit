import { Doc, MUTED, SOFT_BG, LINE_SOFT } from "./layout";
import { drawWatermark, hex, kvRow, moneyCur } from "./util";
import { computeHourly, type HourlyData } from "@/lib/tools/hourly/model";

export interface HourlyLabels {
  docTitle: string;
  inputsHeading: string;
  resultsHeading: string;
  desiredIncome: string;
  expenses: string;
  taxRate: string;
  billableHoursPerWeek: string;
  workWeeksPerYear: string;
  profitMargin: string;
  hourlyRate: string;
  dayRate: string;
  billableHoursPerYear: string;
  revenueNeeded: string;
  monthlyRevenue: string;
  perHour: string;
  disclaimer: string;
}

const ACCENT = hex("#4f46e5");

export async function buildHourlyPdf(
  data: HourlyData,
  labels: HourlyLabels,
  brand: string,
  opts: { watermark?: boolean } = {},
): Promise<Uint8Array> {
  const d = await Doc.create({ margin: 48 });
  const r = computeHourly(data);
  const c = data.currency;
  const m = (v: number) => moneyCur(v, c);

  if (opts.watermark) drawWatermark(d);

  d.text(labels.docTitle, { size: 22, bold: true, color: ACCENT });
  d.moveDown(12);

  // Hero card.
  const heroH = 64;
  d.ensure(heroH);
  const top = d.y;
  d.page.drawRectangle({
    x: d.margin,
    y: top - heroH,
    width: d.contentW,
    height: heroH,
    color: SOFT_BG,
    borderColor: LINE_SOFT,
    borderWidth: 1,
  });
  d.page.drawText(labels.hourlyRate.toUpperCase(), { x: d.margin + 14, y: top - 16, size: 8, font: d.reg, color: MUTED });
  const rate = `${m(r.hourlyRate)} ${labels.perHour}`;
  d.page.drawText(rate, { x: d.margin + 14, y: top - 44, size: 22, font: d.bold, color: ACCENT });
  const day = `${labels.dayRate}: ${m(r.dayRate)}`;
  const dayW = d.reg.widthOfTextAtSize(day, 10);
  d.page.drawText(day, { x: d.right - 14 - dayW, y: top - 40, size: 10, font: d.reg, color: MUTED });
  d.y = top - heroH - 18;

  const colW = (d.contentW - 24) / 2;
  const yStart = d.y;
  d.text(labels.inputsHeading, { size: 10, bold: true, color: MUTED, maxWidth: colW });
  kvRow(d, labels.desiredIncome, m(data.desiredIncome), { width: colW });
  kvRow(d, labels.expenses, m(data.expenses), { width: colW });
  kvRow(d, labels.taxRate, `${data.taxRate}%`, { width: colW });
  kvRow(d, labels.billableHoursPerWeek, String(data.billableHoursPerWeek), { width: colW });
  kvRow(d, labels.workWeeksPerYear, String(data.workWeeksPerYear), { width: colW });
  kvRow(d, labels.profitMargin, `${data.profitMargin}%`, { width: colW });
  const leftEnd = d.y;

  d.y = yStart;
  const rx = d.margin + colW + 24;
  d.text(labels.resultsHeading, { x: rx, size: 10, bold: true, color: MUTED, maxWidth: colW });
  kvRow(d, labels.billableHoursPerYear, String(r.billableHoursPerYear), { x: rx, width: colW });
  kvRow(d, labels.revenueNeeded, m(r.revenueNeeded), { x: rx, width: colW });
  kvRow(d, labels.monthlyRevenue, m(r.monthlyRevenue), { x: rx, width: colW });
  kvRow(d, labels.dayRate, m(r.dayRate), { x: rx, width: colW });
  d.y = Math.min(leftEnd, d.y);

  d.moveDown(20);
  d.text(labels.disclaimer, { size: 8, color: MUTED, lineGap: 1.4 });

  d.footer(brand);
  return d.save();
}
