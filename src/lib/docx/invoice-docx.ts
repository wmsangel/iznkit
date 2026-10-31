import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
} from "docx";
import { computeTotals, lineAmount, type InvoiceData } from "@/lib/tools/invoice/model";
import { formatMoney } from "@/lib/format";

/** Labels needed for the Word export (subset of the PDF labels + the title). */
export interface InvoiceDocxLabels {
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
}

const MUTED = "6B7280";
const INK = "111827";
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } as const;
const thinBottom = { style: BorderStyle.SINGLE, size: 4, color: "D1D5DB" } as const;

function cell(children: Paragraph[], width: number, align?: (typeof AlignmentType)[keyof typeof AlignmentType]) {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    borders: { top: noBorder, bottom: thinBottom, left: noBorder, right: noBorder },
    children: children.map((p) => p),
    margins: { top: 60, bottom: 60, left: 40, right: 40 },
  });
}

function txt(text: string, opts: { bold?: boolean; color?: string; size?: number; align?: (typeof AlignmentType)[keyof typeof AlignmentType] } = {}) {
  return new Paragraph({
    alignment: opts.align,
    children: [new TextRun({ text, bold: opts.bold, color: opts.color ?? INK, size: (opts.size ?? 10) * 2 })],
  });
}

/** Build an editable Word (.docx) version of the invoice and return it as a Blob. */
export async function buildInvoiceDocx(data: InvoiceData, labels: InvoiceDocxLabels, brand: string): Promise<Blob> {
  const cur = data.currency;
  const totals = computeTotals(data);

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      cell([txt(labels.itemDesc, { bold: true, color: MUTED, size: 9 })], 52),
      cell([txt(labels.qty, { bold: true, color: MUTED, size: 9, align: AlignmentType.RIGHT })], 12, AlignmentType.RIGHT),
      cell([txt(labels.price, { bold: true, color: MUTED, size: 9, align: AlignmentType.RIGHT })], 18, AlignmentType.RIGHT),
      cell([txt(labels.amount, { bold: true, color: MUTED, size: 9, align: AlignmentType.RIGHT })], 18, AlignmentType.RIGHT),
    ],
  });

  const itemRows = data.items.map(
    (it) =>
      new TableRow({
        children: [
          cell([txt(it.description || "—")], 52),
          cell([txt(String(it.qty), { align: AlignmentType.RIGHT })], 12, AlignmentType.RIGHT),
          cell([txt(formatMoney(Number(it.price) || 0, cur), { align: AlignmentType.RIGHT })], 18, AlignmentType.RIGHT),
          cell([txt(formatMoney(lineAmount(it), cur), { align: AlignmentType.RIGHT })], 18, AlignmentType.RIGHT),
        ],
      }),
  );

  const totalLine = (label: string, value: string, bold = false) =>
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 40 },
      children: [
        new TextRun({ text: `${label}:  `, color: MUTED, size: bold ? 24 : 20 }),
        new TextRun({ text: value, bold, size: bold ? 24 : 20 }),
      ],
    });

  const children: Paragraph[] = [
    new Paragraph({ children: [new TextRun({ text: labels.docTitle, bold: true, size: 48 })] }),
    txt(`${labels.number}: ${data.number || "—"}    ${labels.date}: ${data.date || "—"}    ${labels.dueDate}: ${data.dueDate || "—"}`, { color: MUTED, size: 9 }),
    new Paragraph({ text: "", spacing: { after: 120 } }),

    txt(labels.from, { bold: true, color: MUTED, size: 9 }),
    txt(data.fromName || "—", { bold: true }),
    ...(data.fromDetails ? [txt(data.fromDetails, { color: MUTED, size: 9 })] : []),
    new Paragraph({ text: "", spacing: { after: 80 } }),

    txt(labels.billedTo, { bold: true, color: MUTED, size: 9 }),
    txt(data.toName || "—", { bold: true }),
    ...(data.toDetails ? [txt(data.toDetails, { color: MUTED, size: 9 })] : []),
    new Paragraph({ text: "", spacing: { after: 120 } }),
  ];

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: noBorder, bottom: noBorder, left: noBorder, right: noBorder,
      insideHorizontal: thinBottom, insideVertical: noBorder,
    },
    rows: [headerRow, ...itemRows],
  });

  const tail: Paragraph[] = [
    new Paragraph({ text: "", spacing: { after: 80 } }),
    totalLine(labels.subtotal, formatMoney(totals.subtotal, cur)),
    ...(data.taxRate ? [totalLine(`${labels.tax} (${data.taxRate}%)`, formatMoney(totals.tax, cur))] : []),
    totalLine(labels.total, formatMoney(totals.total, cur), true),
  ];

  if (data.notes) {
    tail.push(
      new Paragraph({ text: "", spacing: { after: 120 } }),
      txt(labels.notes, { bold: true, color: MUTED, size: 9 }),
      txt(data.notes, { size: 9 }),
    );
  }

  tail.push(
    new Paragraph({ text: "", spacing: { after: 200 } }),
    txt(brand, { color: MUTED, size: 8, align: AlignmentType.CENTER }),
  );

  const doc = new Document({
    sections: [{ properties: {}, children: [...children, table, ...tail] }],
  });

  return Packer.toBlob(doc);
}
