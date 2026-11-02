import { degrees, rgb } from "pdf-lib";
import { Doc, MUTED } from "./layout";
import { dataUrlToBytes, hex } from "./util";
import { getCertDesign, type CertData } from "@/lib/tools/cert/model";

export interface CertLabels {
  docTitle: string;
  to: string;
  from: string;
  valid: string;
}

/**
 * Gift certificate — A5 landscape. Doc toolkit is A4-oriented, so we resize the
 * page after create (layout.ts is frozen as a sample).
 */
export async function buildCertPdf(
  data: CertData,
  labels: CertLabels,
  brand: string,
  opts: { watermark?: boolean } = {},
): Promise<Uint8Array> {
  const design = getCertDesign(data.design);
  const d = await Doc.create({ margin: 34 });
  // A5 landscape (pt)
  d.W = 595.28;
  d.H = 419.53;
  d.doc.removePage(0);
  d.newPage();

  const bg = hex(design.bg);
  const accent = hex(design.accent);
  const ink = hex(design.ink);
  const hasImg = !!data.bgImage;

  // Background fill.
  d.page.drawRectangle({ x: 0, y: 0, width: d.W, height: d.H, color: hasImg ? rgb(1, 1, 1) : bg });

  if (hasImg && data.bgImage) {
    try {
      const parsed = dataUrlToBytes(data.bgImage);
      if (parsed) {
        const img = /png/i.test(parsed.mime) ? await d.doc.embedPng(parsed.bytes) : await d.doc.embedJpg(parsed.bytes);
        d.page.drawImage(img, { x: 0, y: 0, width: d.W, height: d.H });
        // Overlay at ~74% opacity of design bg.
        d.page.drawRectangle({ x: 0, y: 0, width: d.W, height: d.H, color: bg, opacity: 0.74 });
      }
    } catch {
      /* ignore */
    }
  }

  if (design.band) {
    d.page.drawRectangle({ x: 0, y: d.H - 78, width: d.W, height: 78, color: accent, opacity: 0.14 });
  }

  if (design.frame !== "none") {
    d.page.drawRectangle({
      x: 16,
      y: 16,
      width: d.W - 32,
      height: d.H - 32,
      borderColor: accent,
      borderWidth: 1.5,
    });
  }
  if (design.frame === "double") {
    d.page.drawRectangle({
      x: 22,
      y: 22,
      width: d.W - 44,
      height: d.H - 44,
      borderColor: accent,
      borderWidth: 0.75,
    });
  }

  if (opts.watermark) {
    const txt = "PREVIEW";
    const size = 70;
    const w = d.bold.widthOfTextAtSize(txt, size);
    d.page.drawText(txt, {
      x: d.W / 2 - (w / 2) * Math.SQRT1_2,
      y: d.H / 2 - (w / 2) * Math.SQRT1_2,
      size,
      font: d.bold,
      color: ink,
      opacity: 0.12,
      rotate: degrees(-20),
    });
  }

  // Centered body.
  let cy = d.H / 2 + 50;
  const center = (s: string, size: number, bold: boolean, color: ReturnType<typeof hex>, maxW = d.contentW - 40) => {
    const font = d.font(bold);
    const lines = d.wrap(s, font, size, maxW);
    for (const ln of lines) {
      const w = font.widthOfTextAtSize(ln, size);
      d.page.drawText(ln, { x: d.W / 2 - w / 2, y: cy - size, size, font, color });
      cy -= size * 1.35;
    }
  };

  if (data.brandName) {
    center(data.brandName.toUpperCase(), 11, false, accent);
    cy -= 4;
  }
  center(labels.docTitle, 17, true, ink);
  cy -= 6;
  center(data.amount || " ", 42, true, accent);
  cy -= 4;
  if (data.recipient) center(`${labels.to}: ${data.recipient}`, 12, false, ink);
  if (data.message) {
    cy -= 6;
    center(data.message, 11, false, ink, 380);
  }

  // Footer row.
  const fy = 28;
  const foot = 9;
  if (data.code) {
    d.page.drawText(data.code, { x: d.margin, y: fy, size: foot, font: d.bold, color: ink });
  }
  const mid = data.sender ? `${labels.from}: ${data.sender}` : brand;
  const mw = d.reg.widthOfTextAtSize(mid, foot);
  d.page.drawText(mid, { x: d.W / 2 - mw / 2, y: fy, size: foot, font: d.reg, color: ink, opacity: 0.85 });
  if (data.expiry) {
    const right = `${labels.valid}: ${data.expiry}`;
    const rw = d.reg.widthOfTextAtSize(right, foot);
    d.page.drawText(right, { x: d.right - rw, y: fy, size: foot, font: d.reg, color: ink, opacity: 0.85 });
  }

  // No brand footer — cert has its own footer row (brand used as sender fallback).
  void MUTED;
  return d.save();
}
