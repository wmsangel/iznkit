import { Doc, INK, MUTED } from "./layout";
import { drawLogo, drawWatermark, hex, moneyCur, totLine } from "./util";
import { getThemeAccent } from "@/lib/design/themes";
import { lineAmount, deliveryTotals, type DeliveryData } from "@/lib/tools/delivery/model";

export interface DeliveryLabels {
  docTitle: string;
  number: string;
  date: string;
  shipper: string;
  consignee: string;
  itemDesc: string;
  unit: string;
  qty: string;
  price: string;
  amount: string;
  total: string;
  notes: string;
  releasedBy: string;
  receivedBy: string;
  signature: string;
}

export async function buildDeliveryPdf(
  data: DeliveryData,
  labels: DeliveryLabels,
  brand: string,
  opts: { watermark?: boolean } = {},
): Promise<Uint8Array> {
  const d = await Doc.create({ margin: 48 });
  const totals = deliveryTotals(data);
  const cur = data.currency;
  const accent = hex(getThemeAccent(data.theme));

  if (opts.watermark) drawWatermark(d);

  const logoH = await drawLogo(d, data.logo);
  if (logoH) d.y -= logoH + 8;

  // Header: title left, meta right.
  const yMeta = d.y;
  d.text(labels.docTitle, { size: 19, bold: true, color: accent, maxWidth: d.contentW * 0.6 });
  const titleEnd = d.y;
  d.y = yMeta;
  const meta = (lab: string, val: string) => {
    const size = 9;
    const vw = d.bold.widthOfTextAtSize(val || "—", size + 0.5);
    d.page.drawText(lab, { x: d.right - vw, y: d.y - size, size, font: d.reg, color: MUTED });
    d.y -= size * 1.2;
    d.page.drawText(val || "—", { x: d.right - vw, y: d.y - (size + 0.5), size: size + 0.5, font: d.bold, color: INK });
    d.y -= size * 1.8;
  };
  meta(labels.number, data.number);
  meta(labels.date, data.date);
  d.y = Math.min(titleEnd, d.y);
  d.moveDown(12);

  // Parties.
  const colW = (d.contentW - 24) / 2;
  const yStart = d.y;
  d.text(labels.shipper, { size: 8, bold: true, color: MUTED, maxWidth: colW });
  d.text(data.shipperName || "—", { size: 12, bold: true, maxWidth: colW });
  if (data.shipperDetails) d.text(data.shipperDetails, { size: 9, color: MUTED, maxWidth: colW });
  const leftEnd = d.y;
  d.y = yStart;
  const rx = d.margin + colW + 24;
  d.text(labels.consignee, { x: rx, size: 8, bold: true, color: MUTED, maxWidth: colW });
  d.text(data.consigneeName || "—", { x: rx, size: 12, bold: true, maxWidth: colW });
  if (data.consigneeDetails) d.text(data.consigneeDetails, { x: rx, size: 9, color: MUTED, maxWidth: colW });
  d.y = Math.min(leftEnd, d.y);
  d.moveDown(14);

  d.table(
    [
      { header: labels.itemDesc, w: 0.4 },
      { header: labels.unit, w: 0.12, align: "center" },
      { header: labels.qty, w: 0.13, align: "right" },
      { header: labels.price, w: 0.17, align: "right" },
      { header: labels.amount, w: 0.18, align: "right" },
    ],
    data.items.map((it) => [
      it.description || "—",
      it.unit || "",
      String(it.qty ?? ""),
      moneyCur(Number(it.price) || 0, cur),
      moneyCur(lineAmount(it), cur),
    ]),
    { fontSize: 9 },
  );

  d.moveDown(10);
  totLine(d, labels.total, moneyCur(totals.total, cur), { bold: true, accent });

  if (data.notes) {
    d.moveDown(14);
    d.hr();
    d.text(labels.notes, { size: 8, bold: true, color: MUTED });
    d.text(data.notes, { size: 9.5 });
  }

  // Signatures.
  d.moveDown(36);
  const sigW = (d.contentW - 30) / 2;
  const sTop = d.y;
  const sign = (x: number, head: string) => {
    d.y = sTop;
    d.page.drawText(head, { x, y: d.y - 8, size: 8, font: d.reg, color: MUTED });
    d.y -= 28;
    d.page.drawLine({ start: { x, y: d.y }, end: { x: x + sigW, y: d.y }, thickness: 0.8, color: INK });
    d.y -= 4;
    d.page.drawText(labels.signature, { x, y: d.y - 8, size: 8, font: d.reg, color: MUTED });
    d.y -= 14;
  };
  sign(d.margin, labels.releasedBy);
  const leftSig = d.y;
  sign(d.margin + sigW + 30, labels.receivedBy);
  d.y = Math.min(leftSig, d.y);

  d.footer(brand);
  return d.save();
}
