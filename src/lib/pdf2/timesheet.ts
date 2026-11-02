import { Doc, INK, MUTED } from "./layout";
import { drawLogo, drawWatermark, hex, moneyCur, totLine } from "./util";
import { timesheetTotals, type TimesheetData } from "@/lib/tools/timesheet/model";

export interface TimesheetLabels {
  docTitle: string;
  workerName: string;
  project: string;
  period: string;
  date: string;
  hours: string;
  note: string;
  totalHours: string;
  totalPay: string;
  hourlyRate: string;
  signature: string;
}

const ACCENT = hex("#4f46e5");

export async function buildTimesheetPdf(
  data: TimesheetData,
  labels: TimesheetLabels,
  brand: string,
  opts: { watermark?: boolean } = {},
): Promise<Uint8Array> {
  const d = await Doc.create({ margin: 48 });
  const totals = timesheetTotals(data);
  const cur = data.currency;
  const hasRate = (Number(data.hourlyRate) || 0) > 0;

  if (opts.watermark) drawWatermark(d);

  const logoH = await drawLogo(d, data.logo);
  if (logoH) d.y -= logoH + 8;

  const yMeta = d.y;
  d.text(labels.docTitle, { size: 19, bold: true, color: ACCENT, maxWidth: d.contentW * 0.65 });
  const titleEnd = d.y;
  d.y = yMeta;
  const period = data.period || "—";
  const pw = d.bold.widthOfTextAtSize(period, 10);
  d.page.drawText(labels.period, { x: d.right - Math.max(pw, d.reg.widthOfTextAtSize(labels.period, 9)), y: d.y - 9, size: 9, font: d.reg, color: MUTED });
  d.y -= 12;
  d.page.drawText(period, { x: d.right - pw, y: d.y - 10, size: 10, font: d.bold, color: INK });
  d.y -= 16;
  d.y = Math.min(titleEnd, d.y);
  d.moveDown(8);

  d.text(`${labels.workerName}: ${data.workerName || "—"}`, { size: 10 });
  d.text(`${labels.project}: ${data.project || "—"}`, { size: 10 });
  d.moveDown(10);

  d.table(
    [
      { header: labels.date, w: 0.24 },
      { header: labels.hours, w: 0.16, align: "right" },
      { header: labels.note, w: 0.6 },
    ],
    data.entries.map((e) => [e.date || "—", String(e.hours ?? ""), e.note || ""]),
    { fontSize: 9 },
  );

  d.moveDown(10);
  if (hasRate) totLine(d, labels.hourlyRate, moneyCur(data.hourlyRate, cur));
  totLine(d, labels.totalHours, String(totals.totalHours), { bold: !hasRate, accent: ACCENT });
  if (hasRate) totLine(d, labels.totalPay, moneyCur(totals.totalPay, cur), { bold: true, accent: ACCENT });

  d.moveDown(36);
  d.text(data.workerName || "—", { size: 10 });
  d.moveDown(4);
  d.page.drawLine({ start: { x: d.margin, y: d.y }, end: { x: d.margin + d.contentW * 0.55, y: d.y }, thickness: 0.8, color: INK });
  d.y -= 4;
  d.text(labels.signature, { size: 8, color: MUTED });

  d.footer(brand);
  return d.save();
}
