import { Doc, INK, MUTED } from "./layout";
import { dataUrlToBytes, drawWatermark, hex } from "./util";
import { getThemeAccent } from "@/lib/design/themes";
import { STATUS_COLOR, type InspectionData } from "@/lib/tools/inspection/model";

export interface InspectionLabels {
  docTitle: string;
  number: string;
  date: string;
  location: string;
  inspector: string;
  checklist: string;
  itemLabel: string;
  status: string;
  note: string;
  photos: string;
  summary: string;
  signature: string;
  statusOk: string;
  statusIssue: string;
  statusNa: string;
}

export async function buildInspectionPdf(
  data: InspectionData,
  labels: InspectionLabels,
  brand: string,
  opts: { watermark?: boolean } = {},
): Promise<Uint8Array> {
  const d = await Doc.create({ margin: 48 });
  const accent = hex(getThemeAccent(data.theme));
  const statusText = { ok: labels.statusOk, issue: labels.statusIssue, na: labels.statusNa };

  if (opts.watermark) drawWatermark(d);

  const yMeta = d.y;
  d.text(labels.docTitle, { size: 22, bold: true, color: accent, maxWidth: d.contentW * 0.62 });
  const titleEnd = d.y;
  d.y = yMeta;
  const meta = (lab: string, val: string) => {
    const size = 9;
    const text = val || "—";
    const labW = d.reg.widthOfTextAtSize(lab, size);
    const tw = d.bold.widthOfTextAtSize(text, size + 0.5);
    d.page.drawText(lab, { x: d.right - Math.max(labW, tw), y: d.y - size, size, font: d.reg, color: MUTED });
    d.y -= size * 1.2;
    d.page.drawText(text, { x: d.right - tw, y: d.y - (size + 0.5), size: size + 0.5, font: d.bold, color: INK });
    d.y -= size * 1.8;
  };
  meta(labels.number, data.number);
  meta(labels.date, data.date);
  d.y = Math.min(titleEnd, d.y);
  d.moveDown(8);

  if (data.title) {
    d.text(data.title, { size: 13, bold: true });
    d.moveDown(4);
  }
  d.text(`${labels.location}: ${data.location || "—"}`, { size: 10, color: MUTED });
  const inspectorLine = `${data.inspector || "—"}${data.inspectorDetails ? `, ${data.inspectorDetails}` : ""}`;
  d.text(`${labels.inspector}: ${inspectorLine}`, { size: 10, color: MUTED });
  d.moveDown(10);

  if (data.items.length) {
    d.text(labels.checklist, { size: 9, bold: true, color: MUTED });
    d.moveDown(4);
    d.table(
      [
        { header: labels.itemLabel, w: 0.42 },
        { header: labels.status, w: 0.2 },
        { header: labels.note, w: 0.38 },
      ],
      data.items.map((it) => [it.label || "—", statusText[it.status] || it.status, it.note || ""]),
      { fontSize: 9 },
    );
    // Color status text overlay is approximate — table draws all ink; status labels convey meaning.
    void STATUS_COLOR;
  }

  const photos = data.photos ?? [];
  if (photos.length) {
    d.moveDown(12);
    d.text(labels.photos, { size: 9, bold: true, color: MUTED });
    d.moveDown(6);
    const gap = 10;
    const cellW = (d.contentW - gap) / 2;
    const imgH = 140;
    for (let i = 0; i < photos.length; i += 2) {
      d.ensure(imgH + 24);
      const top = d.y;
      for (let j = 0; j < 2; j++) {
        const p = photos[i + j];
        if (!p) continue;
        const x = d.margin + j * (cellW + gap);
        try {
          const parsed = dataUrlToBytes(p.src);
          if (parsed) {
            const img = /png/i.test(parsed.mime) ? await d.doc.embedPng(parsed.bytes) : await d.doc.embedJpg(parsed.bytes);
            const scale = Math.min(cellW / img.width, imgH / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            d.page.drawImage(img, { x, y: top - h, width: w, height: h });
            if (p.caption) {
              d.page.drawText(p.caption, { x, y: top - h - 10, size: 8, font: d.reg, color: MUTED });
            }
          }
        } catch {
          /* ignore bad photo */
        }
      }
      d.y = top - imgH - 20;
    }
  }

  if (data.summary) {
    d.moveDown(8);
    d.text(labels.summary, { size: 9, bold: true, color: MUTED });
    d.text(data.summary, { size: 10, lineGap: 1.45 });
  }

  d.moveDown(36);
  d.text(data.inspector || "—", { size: 10 });
  d.moveDown(4);
  d.page.drawLine({ start: { x: d.margin, y: d.y }, end: { x: d.margin + d.contentW * 0.55, y: d.y }, thickness: 0.8, color: INK });
  d.y -= 4;
  d.text(labels.signature, { size: 8, color: MUTED });

  d.footer(brand);
  return d.save();
}
