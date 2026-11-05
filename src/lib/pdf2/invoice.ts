import { rgb, degrees, type RGB } from "pdf-lib";
import { Doc, INK, MUTED, money } from "./layout";
import { computeTotals, lineAmount, type InvoiceData } from "@/lib/tools/invoice/model";
import { getTemplate } from "@/lib/tools/invoice/templates";

/** #rrggbb → pdf-lib RGB. */
function hexRgb(hex: string): RGB {
  const n = hex.replace("#", "");
  return rgb(parseInt(n.slice(0, 2), 16) / 255, parseInt(n.slice(2, 4), 16) / 255, parseInt(n.slice(4, 6), 16) / 255);
}
const WHITE = rgb(1, 1, 1);

/** Labels needed to render the invoice (same shape the route already builds). */
export interface InvoicePdfLabels {
  docTitle: string;
  number: string;
  date: string;
  dueDate: string;
  from: string;
  billedTo: string;
  itemDesc: string;
  qty: string;
  price: string;
  amount: string;
  subtotal: string;
  tax: string;
  total: string;
  notes: string;
  payQrTitle: string;
  payQrNote: string;
}

function dataUrlToBytes(dataUrl: string): { bytes: Uint8Array; mime: string } | null {
  const m = /^data:([^;]+);base64,([\s\S]*)$/.exec(dataUrl);
  if (!m) return null;
  const bin = atob(m[2]);
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return { bytes: u, mime: m[1] };
}

/**
 * Build the invoice PDF with pdf-lib (Workers-compatible). Honours the template's
 * accent color and the three header styles (split / band / minimal), matching the
 * previous @react-pdf document. `qrPng` is the ГОСТ Р 56042-2014 payment QR as
 * PNG bytes, drawn when the RU requisites are set.
 */
export async function buildInvoicePdf(
  data: InvoiceData,
  labels: InvoicePdfLabels,
  brand: string,
  opts: { watermark?: boolean; qrPng?: Uint8Array } = {},
): Promise<Uint8Array> {
  const d = await Doc.create({ margin: 44 });
  const cur = data.currency;
  const totals = computeTotals(data);
  const qrPng = opts.qrPng;
  const tpl = getTemplate(data.template);
  const ACCENT = hexRgb(tpl.accent);

  // Preview watermark (shown until the PDF is unlocked), drawn behind content.
  if (opts.watermark) {
    const txt = "PREVIEW";
    const size = 90;
    const w = d.bold.widthOfTextAtSize(txt, size);
    d.page.drawText(txt, {
      x: d.W / 2 - (w / 2) * Math.SQRT1_2,
      y: d.H / 2 - (w / 2) * Math.SQRT1_2,
      size,
      font: d.bold,
      color: rgb(0.93, 0.949, 1),
      rotate: degrees(45),
    });
  }

  // Decode logo once (may be drawn in dark or on the band).
  let logoImg: Awaited<ReturnType<typeof d.doc.embedPng>> | null = null;
  if (data.logo) {
    try {
      const parsed = dataUrlToBytes(data.logo);
      if (parsed) logoImg = /png/i.test(parsed.mime) ? await d.doc.embedPng(parsed.bytes) : await d.doc.embedJpg(parsed.bytes);
    } catch {
      /* ignore bad logo */
    }
  }
  const drawLogo = (x: number, topY: number, rightAlign = false): number => {
    if (!logoImg) return topY;
    const scale = Math.min(150 / logoImg.width, 54 / logoImg.height, 1);
    const w = logoImg.width * scale;
    const h = logoImg.height * scale;
    d.page.drawImage(logoImg, { x: rightAlign ? x - w : x, y: topY - h, width: w, height: h });
    return topY - h - 8;
  };

  // Right-aligned meta column (number / date / due), light on band.
  const drawMeta = (rightX: number, topY: number, light: boolean): number => {
    const labelColor = light ? rgb(1, 1, 1) : MUTED;
    const labelOpacity = light ? 0.78 : 1;
    const valueColor = light ? WHITE : INK;
    let yy = topY;
    const pair = (label: string, value: string) => {
      const lw = d.reg.widthOfTextAtSize(label, 9);
      d.page.drawText(label, { x: rightX - lw, y: yy - 9, size: 9, font: d.reg, color: labelColor, opacity: labelOpacity });
      yy -= 11;
      const v = value || "—";
      const vw = d.bold.widthOfTextAtSize(v, 10);
      d.page.drawText(v, { x: rightX - vw, y: yy - 10, size: 10, font: d.bold, color: valueColor });
      yy -= 16;
    };
    pair(labels.number, data.number);
    pair(labels.date, data.date);
    pair(labels.dueDate, data.dueDate);
    return yy;
  };

  if (tpl.header === "band") {
    // Full-bleed accent band across the top.
    const bandTop = d.H;
    const bandBottom = d.H - 128;
    d.page.drawRectangle({ x: 0, y: bandBottom, width: d.W, height: bandTop - bandBottom, color: ACCENT });
    const innerTop = d.H - 34;
    let ly = innerTop;
    if (logoImg) ly = drawLogo(d.margin, innerTop);
    d.page.drawText(labels.docTitle, { x: d.margin, y: ly - 26, size: 26, font: d.bold, color: WHITE });
    drawMeta(d.right, innerTop, true);
    d.y = bandBottom - 24;
  } else {
    const topY = d.y;
    let ly = topY;
    if (logoImg) ly = drawLogo(d.margin, topY);
    const titleColor = tpl.header === "minimal" ? INK : ACCENT;
    d.page.drawText(labels.docTitle, { x: d.margin, y: ly - 26, size: 26, font: d.bold, color: titleColor });
    const metaBottom = drawMeta(d.right, topY, false);
    d.y = Math.min(ly - 26 - 8, metaBottom);
    if (tpl.header === "minimal") {
      d.moveDown(10);
      d.page.drawRectangle({ x: d.margin, y: d.y, width: d.contentW, height: 2, color: ACCENT });
      d.moveDown(6);
    } else {
      d.moveDown(12);
    }
  }

  // Parties — two columns.
  const colW = (d.contentW - 24) / 2;
  const yStart = d.y;
  d.text(labels.from, { size: 8, bold: true, color: MUTED, maxWidth: colW });
  d.text(data.fromName || "—", { size: 11, bold: true, maxWidth: colW });
  if (data.fromDetails) d.text(data.fromDetails, { size: 9, color: MUTED, maxWidth: colW });
  const leftEnd = d.y;
  // right column
  d.y = yStart;
  const rx = d.margin + colW + 24;
  d.text(labels.billedTo, { x: rx, size: 8, bold: true, color: MUTED, maxWidth: colW });
  d.text(data.toName || "—", { x: rx, size: 11, bold: true, maxWidth: colW });
  if (data.toDetails) d.text(data.toDetails, { x: rx, size: 9, color: MUTED, maxWidth: colW });
  d.y = Math.min(leftEnd, d.y);
  d.moveDown(14);

  // Items table.
  d.table(
    [
      { header: labels.itemDesc, w: 0.52 },
      { header: labels.qty, w: 0.12, align: "right" },
      { header: labels.price, w: 0.18, align: "right" },
      { header: labels.amount, w: 0.18, align: "right" },
    ],
    data.items.map((it) => [it.description || "—", String(it.qty ?? ""), money(Number(it.price) || 0), money(lineAmount(it))]),
    { fontSize: 9 },
  );

  // Totals (right-aligned).
  d.moveDown(8);
  const totLine = (label: string, value: string, bold = false) => {
    const size = bold ? 12 : 10;
    d.ensure(size * 1.6);
    const vy = d.y - size;
    const v = value;
    const vw = d.font(bold).widthOfTextAtSize(v, size);
    d.page.drawText(v, { x: d.right - vw, y: vy, size, font: d.font(bold), color: bold ? ACCENT : INK });
    const lw = d.font(bold).widthOfTextAtSize(label, size);
    d.page.drawText(label, { x: d.right - 150 - lw, y: vy, size, font: d.font(bold), color: MUTED });
    d.y -= size * 1.6;
  };
  totLine(labels.subtotal, `${money(totals.subtotal)} ${cur}`);
  if (data.taxRate) totLine(`${labels.tax} (${data.taxRate}%)`, `${money(totals.tax)} ${cur}`);
  totLine(labels.total, `${money(totals.total)} ${cur}`, true);

  // Notes.
  if (data.notes) {
    d.moveDown(14);
    d.hr();
    d.text(labels.notes, { size: 8, bold: true, color: MUTED });
    d.text(data.notes, { size: 9.5 });
  }

  // ГОСТ payment QR.
  if (qrPng) {
    d.moveDown(16);
    d.hr();
    const top = d.y;
    await d.drawPng(qrPng, d.margin, top - 92, 92, 92);
    const tx = d.margin + 104;
    d.y = top;
    const old = d.margin;
    // draw requisites to the right of the QR
    const line = (s: string, bold = false, size = 8.5, color = INK) => {
      d.page.drawText(s, { x: tx, y: d.y - size, size, font: d.font(bold), color });
      d.y -= size * 1.45;
    };
    line(labels.payQrTitle, true, 10);
    line(data.payeeName || "", false);
    line(`р/с ${data.payeeAcc} · БИК ${data.payeeBic}`);
    line(`${data.payeeBankName}${data.payeeCorrAcc ? ` · к/с ${data.payeeCorrAcc}` : ""}`);
    if (data.payeeInn) line(`ИНН ${data.payeeInn}${data.payeeKpp ? ` · КПП ${data.payeeKpp}` : ""}`);
    d.page.drawText(labels.payQrNote, { x: tx, y: d.y - 7, size: 7, font: d.reg, color: MUTED });
    d.margin = old;
    d.y = Math.min(d.y - 10, top - 100);
  }

  d.footer(brand);
  return d.save();
}
