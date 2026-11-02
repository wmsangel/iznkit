import { degrees, rgb, type RGB } from "pdf-lib";
import type { Doc } from "./layout";
import { INK, MUTED, LINE_SOFT, money } from "./layout";

/** Parse `#rrggbb` → pdf-lib RGB. */
export function hex(c: string): RGB {
  const m = /^#?([0-9a-f]{6})$/i.exec(c.trim());
  if (!m) return INK;
  const n = parseInt(m[1], 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

export function dataUrlToBytes(dataUrl: string): { bytes: Uint8Array; mime: string } | null {
  const m = /^data:([^;]+);base64,([\s\S]*)$/.exec(dataUrl);
  if (!m) return null;
  const bin = atob(m[2]);
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return { bytes: u, mime: m[1] };
}

/** Diagonal PREVIEW watermark behind content (matches invoice sample). */
export function drawWatermark(d: Doc, color = rgb(0.933, 0.949, 1)) {
  const txt = "PREVIEW";
  const size = 90;
  const w = d.bold.widthOfTextAtSize(txt, size);
  d.page.drawText(txt, {
    x: d.W / 2 - (w / 2) * Math.SQRT1_2,
    y: d.H / 2 - (w / 2) * Math.SQRT1_2,
    size,
    font: d.bold,
    color,
    rotate: degrees(45),
  });
}

export async function drawLogo(d: Doc, dataUrl: string | null | undefined, opts: { maxW?: number; maxH?: number; x?: number; y?: number } = {}) {
  if (!dataUrl) return 0;
  try {
    const parsed = dataUrlToBytes(dataUrl);
    if (!parsed) return 0;
    const img = /png/i.test(parsed.mime) ? await d.doc.embedPng(parsed.bytes) : await d.doc.embedJpg(parsed.bytes);
    const maxW = opts.maxW ?? 150;
    const maxH = opts.maxH ?? 54;
    const scale = Math.min(maxW / img.width, maxH / img.height, 1);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = opts.x ?? d.margin;
    const y = opts.y ?? d.y - h;
    d.page.drawImage(img, { x, y, width: w, height: h });
    return h;
  } catch {
    return 0;
  }
}

/** Money with currency code (pdf-lib toolkit money + currency). */
export function moneyCur(n: number, cur: string) {
  return `${money(Number(n) || 0)} ${cur}`;
}

/** Label/value row spanning full content width (calc reports). */
export function kvRow(d: Doc, label: string, value: string, opts: { x?: number; width?: number } = {}) {
  const size = 9.5;
  const x = opts.x ?? d.margin;
  const width = opts.width ?? d.contentW;
  d.ensure(size * 1.7);
  const yText = d.y - size;
  d.page.drawText(label, { x, y: yText, size, font: d.reg, color: MUTED });
  const vw = d.bold.widthOfTextAtSize(value, size);
  d.page.drawText(value, { x: x + width - vw, y: yText, size, font: d.bold, color: INK });
  d.y -= size * 1.55;
  d.page.drawLine({
    start: { x, y: d.y + 2 },
    end: { x: x + width, y: d.y + 2 },
    thickness: 0.5,
    color: LINE_SOFT,
  });
}

/** Right-aligned totals line. */
export function totLine(d: Doc, label: string, value: string, opts: { bold?: boolean; accent?: RGB } = {}) {
  const bold = !!opts.bold;
  const size = bold ? 12 : 10;
  d.ensure(size * 1.6);
  const vy = d.y - size;
  const vw = d.font(bold).widthOfTextAtSize(value, size);
  d.page.drawText(value, {
    x: d.right - vw,
    y: vy,
    size,
    font: d.font(bold),
    color: bold ? (opts.accent ?? INK) : INK,
  });
  const lw = d.font(false).widthOfTextAtSize(label, size);
  d.page.drawText(label, { x: d.right - 160 - lw, y: vy, size, font: d.reg, color: MUTED });
  d.y -= size * 1.6;
}
