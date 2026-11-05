import { type RGB } from "pdf-lib";
import { type Align, type Doc, INK, LINE, LINE_SOFT, HEAD_BG, SOFT_BG, MUTED } from "./layout";

export interface GridCol {
  header: string;
  /** small graph/column number row under the header (official RU forms) */
  graph?: string;
  /** fraction of grid width (columns sum to ~1) */
  w: number;
  align?: Align;
}

export interface GridRow {
  cells: (string | number)[];
  bold?: boolean;
  bg?: RGB;
  /** merge: [startColIndex, colCount] — the cell at startCol spans colCount columns (rest of its cells are ignored) */
  merge?: [number, number];
}

/**
 * Draw an official-form grid (header labels + optional graph-number row + data
 * rows) with full borders: outer box, vertical separators, per-row bottom lines,
 * per-cell wrapping, alignment and page breaks. Shared by the RU legal forms
 * (счёт-фактура, УПД, ТОРГ-12). Returns the y after the grid.
 */
export function drawGrid(
  d: Doc,
  cols: GridCol[],
  rows: GridRow[],
  opts: { fontSize?: number; headerSize?: number; x?: number; width?: number } = {},
): number {
  const size = opts.fontSize ?? 7.5;
  const hSize = opts.headerSize ?? 6.8;
  const x0 = opts.x ?? d.margin;
  const totalW = opts.width ?? d.contentW;
  const widths = cols.map((c) => c.w * totalW);
  const xs: number[] = [];
  let acc = x0;
  for (const w of widths) {
    xs.push(acc);
    acc += w;
  }
  const pad = 2.5;
  const lineH = size * 1.28;
  const hasGraph = cols.some((c) => c.graph != null);

  // The y at which the grid starts (for the outer box + vertical lines).
  const topY = d.y;

  const drawCellText = (text: string, colIdx: number, cellW: number, rowTop: number, rowH: number, font: typeof d.reg, fsize: number, align: Align, color = INK) => {
    const lines = d.wrap(text, font, fsize, cellW - pad * 2);
    lines.forEach((ln, li) => {
      const ty = rowTop - pad - fsize - li * fsize * 1.28;
      let tx = xs[colIdx] + pad;
      const w = font.widthOfTextAtSize(ln, fsize);
      if (align === "right") tx = xs[colIdx] + cellW - pad - w;
      else if (align === "center") tx = xs[colIdx] + cellW / 2 - w / 2;
      d.page.drawText(ln, { x: tx, y: ty, size: fsize, font, color });
    });
  };

  const rowHeight = (cells: (string | number)[], fsize: number, font: typeof d.reg, merge?: [number, number]) => {
    let maxLines = 1;
    cells.forEach((c, i) => {
      // Skip only the cells swallowed by a merge (between start+1 and start+count-1).
      if (merge && i > merge[0] && i < merge[0] + merge[1]) return;
      const cw = merge && i === merge[0] ? widths.slice(merge[0], merge[0] + merge[1]).reduce((a, b) => a + b, 0) : widths[i];
      const lines = d.wrap(String(c ?? ""), font, fsize, cw - pad * 2);
      maxLines = Math.max(maxLines, lines.length);
    });
    return maxLines * fsize * 1.28 + pad * 2;
  };

  const rowBottoms: number[] = [];

  // Header row (labels).
  {
    const font = d.bold;
    const h = rowHeight(cols.map((c) => c.header), hSize, font);
    d.ensure(h + (hasGraph ? size + pad * 2 : 0));
    const rowTop = d.y;
    d.page.drawRectangle({ x: x0, y: rowTop - h, width: totalW, height: h, color: HEAD_BG });
    cols.forEach((c, i) => drawCellText(c.header, i, widths[i], rowTop, h, font, hSize, c.align ?? "left"));
    d.y -= h;
    rowBottoms.push(d.y);
  }

  // Graph-number row.
  if (hasGraph) {
    const font = d.reg;
    const gsize = 6;
    const h = gsize * 1.28 + pad * 2;
    const rowTop = d.y;
    d.page.drawRectangle({ x: x0, y: rowTop - h, width: totalW, height: h, color: SOFT_BG });
    cols.forEach((c, i) => {
      if (c.graph == null) return;
      const w = font.widthOfTextAtSize(c.graph, gsize);
      d.page.drawText(c.graph, { x: xs[i] + widths[i] / 2 - w / 2, y: rowTop - pad - gsize, size: gsize, font, color: MUTED });
    });
    d.y -= h;
    rowBottoms.push(d.y);
  }

  // Data rows.
  for (const r of rows) {
    const font = r.bold ? d.bold : d.reg;
    const h = rowHeight(r.cells, size, font, r.merge);
    d.ensure(h);
    const rowTop = d.y;
    if (r.bg) d.page.drawRectangle({ x: x0, y: rowTop - h, width: totalW, height: h, color: r.bg });
    r.cells.forEach((c, i) => {
      if (r.merge && i > r.merge[0] && i < r.merge[0] + r.merge[1]) return;
      const cw = r.merge && i === r.merge[0] ? widths.slice(r.merge[0], r.merge[0] + r.merge[1]).reduce((a, b) => a + b, 0) : widths[i];
      const align = cols[i].align ?? "left";
      drawCellText(String(c ?? ""), i, cw, rowTop, h, font, size, align);
    });
    d.y -= h;
    rowBottoms.push(d.y);
  }

  // Borders: outer box + per-row bottom lines + vertical separators.
  const bottomY = d.y;
  d.page.drawRectangle({ x: x0, y: bottomY, width: totalW, height: topY - bottomY, borderColor: LINE, borderWidth: 1 });
  for (let i = 0; i < rowBottoms.length - 1; i++) {
    d.page.drawLine({ start: { x: x0, y: rowBottoms[i] }, end: { x: x0 + totalW, y: rowBottoms[i] }, thickness: 0.5, color: LINE_SOFT });
  }
  // header/graph separator stronger
  d.page.drawLine({ start: { x: x0, y: rowBottoms[hasGraph ? 1 : 0] }, end: { x: x0 + totalW, y: rowBottoms[hasGraph ? 1 : 0] }, thickness: 1, color: LINE });
  for (let i = 1; i < xs.length; i++) {
    d.page.drawLine({ start: { x: xs[i], y: topY }, end: { x: xs[i], y: bottomY }, thickness: 0.5, color: LINE_SOFT });
  }

  return d.y;
}
