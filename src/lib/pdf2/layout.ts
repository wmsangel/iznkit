import { PDFDocument, type PDFFont, type PDFPage, rgb, type RGB } from "pdf-lib";
import { embedDocFonts } from "./fonts";

// Shared palette (matches the @react-pdf documents).
export const INK = rgb(0.067, 0.094, 0.149); // #111827
export const MUTED = rgb(0.42, 0.447, 0.502); // #6b7280
export const LINE = rgb(0.6, 0.627, 0.682); // #9ca3af
export const LINE_SOFT = rgb(0.82, 0.835, 0.863); // #d1d5db
export const HEAD_BG = rgb(0.953, 0.957, 0.965); // #f3f4f6
export const SOFT_BG = rgb(0.976, 0.98, 0.984); // #f9fafb

export type Align = "left" | "right" | "center";
export interface Col {
  header: string;
  /** fraction of content width (columns should sum to ~1) */
  w: number;
  align?: Align;
}

export const money = (n: number) =>
  (Number(n) || 0).toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Minimal pdf-lib layout toolkit: a cursor-based page with wrapped text, tables
 * (per-cell wrapping + automatic page breaks) and image drawing (for QR). This
 * replaces @react-pdf's declarative flex layout with imperative drawing that runs
 * on Cloudflare Workers.
 */
export class Doc {
  doc!: PDFDocument;
  page!: PDFPage;
  reg!: PDFFont;
  bold!: PDFFont;
  W = 595.28; // A4 portrait width (pt)
  H = 841.89; // A4 portrait height (pt)
  margin = 40;
  y = 0;

  static async create(opts: { landscape?: boolean; margin?: number } = {}): Promise<Doc> {
    const d = new Doc();
    d.doc = await PDFDocument.create();
    const { reg, bold } = await embedDocFonts(d.doc);
    d.reg = reg;
    d.bold = bold;
    if (opts.landscape) {
      d.W = 841.89;
      d.H = 595.28;
    }
    if (opts.margin != null) d.margin = opts.margin;
    d.newPage();
    return d;
  }

  newPage() {
    this.page = this.doc.addPage([this.W, this.H]);
    this.y = this.H - this.margin;
  }

  get right() {
    return this.W - this.margin;
  }
  get contentW() {
    return this.W - this.margin * 2;
  }
  font(bold?: boolean) {
    return bold ? this.bold : this.reg;
  }
  width(s: string, size: number, bold?: boolean) {
    return this.font(bold).widthOfTextAtSize(s, size);
  }

  /** Ensure `h` pt fit below the cursor, else start a new page. */
  ensure(h: number) {
    if (this.y - h < this.margin) this.newPage();
  }
  moveDown(h: number) {
    this.y -= h;
  }

  wrap(s: string, font: PDFFont, size: number, maxW: number): string[] {
    const out: string[] = [];
    for (const para of String(s ?? "").split("\n")) {
      const words = para.split(/\s+/).filter(Boolean);
      if (!words.length) {
        out.push("");
        continue;
      }
      let line = "";
      for (const w of words) {
        const test = line ? line + " " + w : w;
        if (font.widthOfTextAtSize(test, size) > maxW && line) {
          out.push(line);
          line = w;
        } else {
          line = test;
        }
      }
      out.push(line);
    }
    return out;
  }

  /** Draw (wrapped) text from the cursor; returns the new y. */
  text(
    s: string,
    opts: { x?: number; size?: number; bold?: boolean; color?: RGB; align?: Align; maxWidth?: number; lineGap?: number } = {},
  ): number {
    const size = opts.size ?? 10;
    const font = this.font(opts.bold);
    const color = opts.color ?? INK;
    const maxW = opts.maxWidth ?? this.contentW;
    const lineH = size * (opts.lineGap ?? 1.35);
    for (const ln of this.wrap(s, font, size, maxW)) {
      this.ensure(lineH);
      let x = opts.x ?? this.margin;
      const w = font.widthOfTextAtSize(ln, size);
      if (opts.align === "right") x = (opts.x ?? this.right) - w;
      else if (opts.align === "center") x = (opts.x ?? this.W / 2) - w / 2;
      this.page.drawText(ln, { x, y: this.y - size, size, font, color });
      this.y -= lineH;
    }
    return this.y;
  }

  /** A label/value line used by document headers (label muted, value bold). */
  field(label: string, value: string, opts: { labelW?: number; size?: number } = {}) {
    const size = opts.size ?? 9.5;
    const labelW = opts.labelW ?? 150;
    this.ensure(size * 1.5);
    const yText = this.y - size;
    this.page.drawText(label, { x: this.margin, y: yText, size, font: this.reg, color: MUTED });
    const vx = this.margin + labelW;
    for (const ln of this.wrap(value || "—", this.bold, size, this.right - vx)) {
      this.page.drawText(ln, { x: vx, y: this.y - size, size, font: this.bold, color: INK });
      this.y -= size * 1.5;
    }
  }

  hr(color: RGB = LINE_SOFT) {
    this.ensure(10);
    this.y -= 6;
    this.page.drawLine({ start: { x: this.margin, y: this.y }, end: { x: this.right, y: this.y }, thickness: 1, color });
    this.y -= 4;
  }

  /** A table with per-cell wrapping, a header row and automatic page breaks. */
  table(cols: Col[], rows: (string | number)[][], opts: { fontSize?: number; headerBg?: RGB; x?: number; width?: number } = {}) {
    const size = opts.fontSize ?? 8.5;
    const x0 = opts.x ?? this.margin;
    const totalW = opts.width ?? this.contentW;
    const widths = cols.map((c) => c.w * totalW);
    const xs: number[] = [];
    let acc = x0;
    for (const w of widths) {
      xs.push(acc);
      acc += w;
    }
    const pad = 4;
    const lineH = size * 1.3;

    const drawRow = (cells: (string | number)[], bold: boolean, bg?: RGB) => {
      const font = this.font(bold);
      const cellLines = cells.map((c, i) => this.wrap(String(c ?? ""), font, size, widths[i] - pad * 2));
      const rowH = Math.max(1, ...cellLines.map((l) => l.length)) * lineH + pad * 2;
      this.ensure(rowH);
      const top = this.y;
      if (bg) this.page.drawRectangle({ x: x0, y: top - rowH, width: totalW, height: rowH, color: bg });
      cellLines.forEach((lines, i) => {
        const align = cols[i].align ?? "left";
        lines.forEach((ln, li) => {
          const ty = top - pad - size - li * lineH;
          let tx = xs[i] + pad;
          const w = font.widthOfTextAtSize(ln, size);
          if (align === "right") tx = xs[i] + widths[i] - pad - w;
          else if (align === "center") tx = xs[i] + widths[i] / 2 - w / 2;
          this.page.drawText(ln, { x: tx, y: ty, size, font, color: INK });
        });
      });
      this.page.drawLine({ start: { x: x0, y: top - rowH }, end: { x: x0 + totalW, y: top - rowH }, thickness: 0.5, color: LINE_SOFT });
      this.y -= rowH;
    };

    // outer top border
    this.ensure(lineH + pad * 2);
    this.page.drawLine({ start: { x: x0, y: this.y }, end: { x: x0 + totalW, y: this.y }, thickness: 1, color: LINE });
    drawRow(cols.map((c) => c.header), true, opts.headerBg ?? HEAD_BG);
    for (const r of rows) drawRow(r, false);
  }

  async drawPng(pngBytes: Uint8Array, x: number, y: number, w: number, h: number) {
    const img = await this.doc.embedPng(pngBytes);
    this.page.drawImage(img, { x, y, width: w, height: h });
  }

  /** Centered, fixed footer (brand) on the current page. */
  footer(brand: string) {
    const size = 7;
    const w = this.reg.widthOfTextAtSize(brand, size);
    this.page.drawText(brand, { x: this.W / 2 - w / 2, y: 18, size, font: this.reg, color: MUTED });
  }

  async save() {
    return this.doc.save();
  }
}
