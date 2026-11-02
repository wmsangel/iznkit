import { Doc, INK, MUTED } from "./layout";
import { drawLogo, drawWatermark, hex, moneyCur, totLine } from "./util";
import { getThemeAccent } from "@/lib/design/themes";
import { lineAmount, poTotal, type PoData } from "@/lib/tools/po/model";

export interface PoLabels {
  docTitle: string;
  number: string;
  date: string;
  deliveryDate: string;
  buyer: string;
  supplier: string;
  itemDesc: string;
  qty: string;
  price: string;
  amount: string;
  subtotal: string;
  tax: string;
  total: string;
  notes: string;
}

export async function buildPoPdf(
  data: PoData,
  labels: PoLabels,
  brand: string,
  opts: { watermark?: boolean } = {},
): Promise<Uint8Array> {
  const d = await Doc.create({ margin: 48 });
  const totals = poTotal(data);
  const cur = data.currency;
  const accent = hex(getThemeAccent(data.theme));

  if (opts.watermark) drawWatermark(d);

  const logoH = await drawLogo(d, data.logo);
  if (logoH) d.y -= logoH + 8;

  const yMeta = d.y;
  d.text(labels.docTitle, { size: 20, bold: true, color: accent, maxWidth: d.contentW * 0.58 });
  const titleEnd = d.y;
  d.y = yMeta;
  const meta = (lab: string, val: string) => {
    const size = 9;
    const text = val || "—";
    const vw = d.bold.widthOfTextAtSize(text, size + 0.5);
    d.page.drawText(lab, { x: d.right - Math.max(vw, d.reg.widthOfTextAtSize(lab, size)), y: d.y - size, size, font: d.reg, color: MUTED });
    d.y -= size * 1.2;
    const tw = d.bold.widthOfTextAtSize(text, size + 0.5);
    d.page.drawText(text, { x: d.right - tw, y: d.y - (size + 0.5), size: size + 0.5, font: d.bold, color: INK });
    d.y -= size * 1.8;
  };
  meta(labels.number, data.number);
  meta(labels.date, data.date);
  meta(labels.deliveryDate, data.deliveryDate);
  d.y = Math.min(titleEnd, d.y);
  d.moveDown(12);

  const colW = (d.contentW - 24) / 2;
  const yStart = d.y;
  d.text(labels.buyer, { size: 8, bold: true, color: MUTED, maxWidth: colW });
  d.text(data.buyerName || "—", { size: 12, bold: true, maxWidth: colW });
  if (data.buyerDetails) d.text(data.buyerDetails, { size: 9, color: MUTED, maxWidth: colW });
  const leftEnd = d.y;
  d.y = yStart;
  const rx = d.margin + colW + 24;
  d.text(labels.supplier, { x: rx, size: 8, bold: true, color: MUTED, maxWidth: colW });
  d.text(data.supplierName || "—", { x: rx, size: 12, bold: true, maxWidth: colW });
  if (data.supplierDetails) d.text(data.supplierDetails, { x: rx, size: 9, color: MUTED, maxWidth: colW });
  d.y = Math.min(leftEnd, d.y);
  d.moveDown(14);

  d.table(
    [
      { header: labels.itemDesc, w: 0.46 },
      { header: labels.qty, w: 0.14, align: "right" },
      { header: labels.price, w: 0.2, align: "right" },
      { header: labels.amount, w: 0.2, align: "right" },
    ],
    data.items.map((it) => [
      it.description || "—",
      String(it.qty ?? ""),
      moneyCur(Number(it.price) || 0, cur),
      moneyCur(lineAmount(it), cur),
    ]),
    { fontSize: 9 },
  );

  d.moveDown(10);
  totLine(d, labels.subtotal, moneyCur(totals.subtotal, cur));
  if (data.taxRate) totLine(d, `${labels.tax} (${data.taxRate}%)`, moneyCur(totals.tax, cur));
  totLine(d, labels.total, moneyCur(totals.total, cur), { bold: true, accent });

  if (data.notes) {
    d.moveDown(16);
    d.hr();
    d.text(labels.notes, { size: 8, bold: true, color: MUTED });
    d.text(data.notes, { size: 9.5 });
  }

  d.footer(brand);
  return d.save();
}
