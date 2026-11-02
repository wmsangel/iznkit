import { Doc, INK, MUTED } from "./layout";
import { drawWatermark, hex } from "./util";
import { getThemeAccent } from "@/lib/design/themes";
import type { NdaData, ResolvedNda } from "@/lib/tools/nda/model";

export interface NdaLabels {
  docTitle: string;
  disclosingParty: string;
  receivingParty: string;
  signatures: string;
  disclaimer: string;
}

export async function buildNdaPdf(
  data: NdaData,
  resolved: ResolvedNda,
  labels: NdaLabels,
  brand: string,
  opts: { watermark?: boolean } = {},
): Promise<Uint8Array> {
  const d = await Doc.create({ margin: 56 });
  const accent = hex(getThemeAccent(data.theme));

  if (opts.watermark) drawWatermark(d);

  d.text(labels.docTitle, { size: 16, bold: true, color: accent, align: "center" });
  d.moveDown(12);
  d.text(resolved.intro, { size: 10.5, lineGap: 1.5 });
  d.moveDown(8);

  for (const c of resolved.clauses) {
    d.moveDown(6);
    d.text(c.h, { size: 10.5, bold: true });
    d.text(c.b, { size: 10.5, lineGap: 1.5 });
  }

  d.moveDown(24);
  d.text(labels.signatures, { size: 9, bold: true, color: MUTED });
  d.moveDown(8);

  const colW = (d.contentW - 30) / 2;
  const sTop = d.y;
  const sign = (x: number, head: string, name: string, details: string) => {
    d.y = sTop;
    d.page.drawText(head, { x, y: d.y - 8, size: 8, font: d.reg, color: MUTED });
    d.y -= 16;
    d.page.drawText(name || "—", { x, y: d.y - 10, size: 10.5, font: d.bold, color: INK });
    d.y -= 16;
    if (details) {
      for (const ln of d.wrap(details, d.reg, 9, colW)) {
        d.page.drawText(ln, { x, y: d.y - 9, size: 9, font: d.reg, color: MUTED });
        d.y -= 12;
      }
    }
    d.y -= 22;
    d.page.drawLine({ start: { x, y: d.y }, end: { x: x + colW, y: d.y }, thickness: 0.8, color: INK });
    d.y -= 4;
    d.page.drawText("Signature / Date", { x, y: d.y - 8, size: 8, font: d.reg, color: MUTED });
    d.y -= 14;
  };
  sign(d.margin, labels.disclosingParty, data.disclosingName, data.disclosingDetails);
  const leftEnd = d.y;
  sign(d.margin + colW + 30, labels.receivingParty, data.receivingName, data.receivingDetails);
  d.y = Math.min(leftEnd, d.y);

  d.moveDown(20);
  d.hr();
  d.text(labels.disclaimer, { size: 8, color: MUTED, lineGap: 1.4 });

  d.footer(brand);
  return d.save();
}
