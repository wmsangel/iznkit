import { rgb, degrees } from "pdf-lib";
import { Doc, INK, MUTED, money } from "./layout";
import { computeTotals, lineAmount, type InvoiceData } from "@/lib/tools/invoice/model";

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

const ACCENT = rgb(0.227, 0.478, 0.416); // #3a7a6a

function dataUrlToBytes(dataUrl: string): { bytes: Uint8Array; mime: string } | null {
  const m = /^data:([^;]+);base64,([\s\S]*)$/.exec(dataUrl);
  if (!m) return null;
  const bin = atob(m[2]);
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return { bytes: u, mime: m[1] };
}

/**
 * Build the invoice PDF with pdf-lib (Workers-compatible). One clean layout —
 * the @react-pdf template variants (classic/band/minimal) collapse to this for
 * now; content parity is kept. `qrPng` is the ГОСТ Р 56042-2014 payment QR as
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

  // Logo (optional data URL) top-right.
  if (data.logo) {
    try {
      const parsed = dataUrlToBytes(data.logo);
      if (parsed) {
        const img = /png/i.test(parsed.mime) ? await d.doc.embedPng(parsed.bytes) : await d.doc.embedJpg(parsed.bytes);
        const maxW = 150;
        const scale = Math.min(maxW / img.width, 54 / img.height, 1);
        d.page.drawImage(img, { x: d.right - img.width * scale, y: d.y - img.height * scale, width: img.width * scale, height: img.height * scale });
      }
    } catch {
      /* ignore bad logo */
    }
  }

  d.text(labels.docTitle, { size: 26, bold: true, color: ACCENT });
  d.moveDown(6);
  d.text(
    `${labels.number}: ${data.number || "—"}     ${labels.date}: ${data.date || "—"}     ${labels.dueDate}: ${data.dueDate || "—"}`,
    { size: 9.5, color: MUTED },
  );
  d.moveDown(10);

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
