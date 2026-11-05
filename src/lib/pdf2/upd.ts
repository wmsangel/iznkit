import { Doc, INK, MUTED, LINE_SOFT, SOFT_BG, money } from "./layout";
import { drawGrid, type GridCol, type GridRow } from "./grid";
import { computeSfTotals, lineBase, lineVat, lineTotal, vatLabel } from "@/lib/tools/schet-faktura/model";
import type { UpdData } from "@/lib/tools/upd/model";

/**
 * Универсальный передаточный документ (УПД) — pdf-lib builder (Workers-compatible).
 * Форма рекомендована письмом ФНС России № ММВ-20-3/96@: счёт-фактура (графы 1–11)
 * + передаточная (первичная) часть. Верна прежнему @react-pdf-документу.
 */
export async function buildUpdPdf(data: UpdData, brand: string): Promise<Uint8Array> {
  const d = await Doc.create({ landscape: true, margin: 28 });
  const totals = computeSfTotals(data);
  const sellerInnKpp = [data.sellerInn, data.sellerKpp].filter(Boolean).join(" / ") || "—";
  const buyerInnKpp = [data.buyerInn, data.buyerKpp].filter(Boolean).join(" / ") || "—";
  const currency = `${data.currencyName || "—"}, ${data.currencyCode || "—"}`;
  const statusCap = data.status === "1" ? "счёт-фактура и передаточный документ" : "передаточный документ";

  // Title (left) + status box (right) on the same top band.
  const topY = d.y;
  const boxW = 150;
  const titleMaxW = d.right - d.margin - boxW - 16;
  d.text(`Универсальный передаточный документ № ${data.number || "—"} от ${data.date || "—"}`, {
    size: 13,
    bold: true,
    maxWidth: titleMaxW,
  });
  d.moveDown(1);
  d.text(data.correction ? `Исправление: ${data.correction}` : "Исправление № — от —", { size: 8, color: MUTED });

  // Status box.
  {
    const bx = d.right - boxW;
    const capLines = d.wrap(statusCap, d.reg, 5.5, boxW - 8);
    const boxH = 9 + 15 + capLines.length * 7 + 6;
    d.page.drawRectangle({ x: bx, y: topY - boxH, width: boxW, height: boxH, borderColor: INK, borderWidth: 1 });
    const center = (s: string, size: number, font: typeof d.reg) => bx + boxW / 2 - font.widthOfTextAtSize(s, size) / 2;
    let yy = topY - 9;
    d.page.drawText("Статус", { x: center("Статус", 5.5, d.reg), y: yy, size: 5.5, font: d.reg, color: MUTED });
    yy -= 13;
    d.page.drawText(data.status, { x: center(data.status, 12, d.bold), y: yy, size: 12, font: d.bold, color: INK });
    yy -= 11;
    for (const ln of capLines) {
      d.page.drawText(ln, { x: center(ln, 5.5, d.reg), y: yy, size: 5.5, font: d.reg, color: MUTED });
      yy -= 7;
    }
  }

  d.moveDown(12);

  const fl = (label: string, value: string) => d.field(label, value, { labelW: 190, size: 8 });
  fl("Продавец", data.sellerName);
  fl("Адрес", data.sellerAddress);
  fl("ИНН / КПП продавца", sellerInnKpp);
  fl("Грузоотправитель и его адрес", data.shipper);
  fl("Грузополучатель и его адрес", data.consignee);
  fl("К платёжно-расчётному документу №", data.paymentDoc);
  fl("Покупатель", data.buyerName);
  fl("Адрес", data.buyerAddress);
  fl("ИНН / КПП покупателя", buyerInnKpp);
  fl("Валюта: наименование, код", currency);
  if (data.govContract) fl("Идентификатор гос. контракта", data.govContract);
  d.moveDown(8);

  const cols: GridCol[] = [
    { header: "№ п/п", graph: "1", w: 0.03, align: "center" },
    { header: "Наименование товара (работ, услуг)", graph: "1а", w: 0.16 },
    { header: "Код ед.", graph: "2", w: 0.05, align: "center" },
    { header: "Ед. изм.", graph: "2а", w: 0.06, align: "center" },
    { header: "Кол-во", graph: "3", w: 0.06, align: "right" },
    { header: "Цена за ед. без НДС", graph: "4", w: 0.09, align: "right" },
    { header: "Стоимость без НДС", graph: "5", w: 0.1, align: "right" },
    { header: "В т.ч. акциз", graph: "6", w: 0.07, align: "center" },
    { header: "Нал. ставка", graph: "7", w: 0.06, align: "center" },
    { header: "Сумма НДС", graph: "8", w: 0.09, align: "right" },
    { header: "Стоимость с НДС", graph: "9", w: 0.1, align: "right" },
    { header: "Страна (код/наим.)", graph: "10 / 10а", w: 0.06, align: "center" },
    { header: "№ ГТД / РНПТ", graph: "11", w: 0.07, align: "center" },
  ];

  const rows: GridRow[] = data.items.map((it, i) => ({
    cells: [
      i + 1,
      it.name || "—",
      it.unitCode || "—",
      it.unit || "—",
      it.qty || 0,
      money(Number(it.price) || 0),
      money(lineBase(it)),
      it.excise || "без акциза",
      vatLabel(it.vatRate),
      money(lineVat(it)),
      money(lineTotal(it)),
      [it.countryCode, it.country].filter((x) => x && x !== "—").join(" / ") || "—",
      it.customsDecl ? it.customsDecl.replace(/\/(?=.)/g, "/ ") : "—",
    ] as (string | number)[],
  }));

  rows.push({
    cells: ["Всего к оплате", "", "", "", "", "", money(totals.base), "", "", money(totals.vat), money(totals.total), "", ""],
    bold: true,
    bg: SOFT_BG,
    merge: [0, 6],
  });

  drawGrid(d, cols, rows, { fontSize: 7.5 });

  // Transfer (primary-document) part.
  d.moveDown(10);
  fl("Основание передачи (сдачи) / получения (приёмки)", data.basis);
  if (data.transport) fl("Данные о транспортировке и грузе", data.transport);
  d.moveDown(10);

  const colW = (d.contentW - 30) / 2;
  const tField = (x: number, label: string, value: string, y: number): number => {
    d.page.drawText(label, { x, y: y - 7, size: 6.5, font: d.reg, color: MUTED });
    const vx = x + 100;
    d.page.drawText(value || " ", { x: vx, y: y - 7, size: 7.5, font: d.bold, color: INK });
    d.page.drawLine({ start: { x: vx, y: y - 10 }, end: { x: x + colW - 6, y: y - 10 }, thickness: 0.5, color: INK });
    return y - 18;
  };
  const transferBlock = (x: number, head: string, rowsT: Array<[string, string]>): number => {
    const headLines = d.wrap(head, d.bold, 7, colW - 12);
    const h = 12 + headLines.length * 9 + rowsT.length * 18 + 8;
    d.page.drawRectangle({ x, y: d.y - h, width: colW, height: h, borderColor: LINE_SOFT, borderWidth: 1 });
    let yy = d.y - 10;
    for (const ln of headLines) {
      d.page.drawText(ln, { x: x + 6, y: yy, size: 7, font: d.bold, color: INK });
      yy -= 9;
    }
    yy -= 3;
    for (const [l, v] of rowsT) yy = tField(x + 6, l, v, yy);
    return d.y - h;
  };

  d.ensure(90);
  const blockTop = d.y;
  const leftBottom = transferBlock(d.margin, "Товар (груз) передал / услуги, результаты работ, права сдал", [
    ["Должность", data.handoverPosition],
    ["Ф. И. О.", data.handoverName],
    ["Дата отгрузки, передачи (сдачи)", data.handoverDate],
  ]);
  d.y = blockTop;
  const rightBottom = transferBlock(d.margin + colW + 30, "Товар (груз) получил / услуги, результаты работ, права принял", [
    ["Должность", data.receivePosition],
    ["Ф. И. О.", data.receiveName],
    ["Дата получения (приёмки)", data.receiveDate],
  ]);
  d.y = Math.min(leftBottom, rightBottom);

  d.moveDown(14);
  d.text(
    "Форма УПД рекомендована письмом ФНС России № ММВ-20-3/96@. Статус 1 — счёт-фактура и передаточный документ (акт/накладная); статус 2 — только передаточный документ. Графы прослеживаемости (12, 12а, 13, 14) заполняются отдельно для прослеживаемых товаров. Перед применением сверьте реквизиты с действующей редакцией формы.",
    { size: 6.5, color: MUTED, lineGap: 1.4 },
  );

  d.footer(brand);
  return d.save();
}
