import { Doc, INK, MUTED, money } from "./layout";
import { drawGrid, type GridCol, type GridRow } from "./grid";
import { computeSfTotals, lineBase, lineVat, lineTotal, vatLabel } from "@/lib/tools/schet-faktura/model";
import type { Torg12Data } from "@/lib/tools/torg12/model";

/**
 * Товарная накладная ТОРГ-12 — pdf-lib builder (Workers-compatible). Унифицированная
 * форма № ТОРГ-12 (Постановление Госкомстата России № 132), графы 1–15. Верна
 * прежнему @react-pdf-документу.
 */
export async function buildTorg12Pdf(data: Torg12Data, brand: string): Promise<Uint8Array> {
  const d = await Doc.create({ landscape: true, margin: 24 });
  const totals = computeSfTotals(data);
  const shipper = [data.shipperName, data.shipperAddress].filter(Boolean).join(", ");
  const consignee = [data.consigneeName, data.consigneeAddress].filter(Boolean).join(", ");

  // Two-column header fields.
  const gap = 24;
  const colW = (d.contentW - gap) / 2;
  const labelW = 120;
  const colField = (x: number, label: string, value: string, y: number): number => {
    d.page.drawText(label, { x, y: y - 7, size: 7, font: d.reg, color: MUTED });
    const vx = x + labelW;
    const lines = d.wrap(value || "—", d.bold, 7, x + colW - vx);
    lines.forEach((ln, i) => d.page.drawText(ln, { x: vx, y: y - 7 - i * 9.5, size: 7, font: d.bold, color: INK }));
    return y - Math.max(1, lines.length) * 9.5 - 2.5;
  };
  const top = d.y;
  const leftX = d.margin;
  const rightX = d.margin + colW + gap;
  let ly = top;
  ly = colField(leftX, "Грузоотправитель", shipper, ly);
  ly = colField(leftX, "ОКПО грузоотправителя", data.shipperOkpo, ly);
  ly = colField(leftX, "Поставщик", data.supplierName, ly);
  ly = colField(leftX, "Плательщик", data.payerName, ly);
  let ry = top;
  ry = colField(rightX, "Грузополучатель", consignee, ry);
  ry = colField(rightX, "Основание", data.basis, ry);
  ry = colField(rightX, "Транспортная накладная", data.transportDoc, ry);
  ry = colField(rightX, "Вид операции", data.operationType, ry);
  d.y = Math.min(ly, ry) - 4;

  d.text(`ТОВАРНАЯ НАКЛАДНАЯ (ТОРГ-12) № ${data.number || "—"} от ${data.date || "—"}`, {
    size: 12,
    bold: true,
    align: "center",
  });
  d.moveDown(6);

  const cols: GridCol[] = [
    { header: "№", graph: "1", w: 0.03, align: "center" },
    { header: "Товар (наименование, характеристика, сорт, артикул)", graph: "2", w: 0.16 },
    { header: "Код", graph: "3", w: 0.05, align: "center" },
    { header: "Ед. изм.", graph: "4", w: 0.05, align: "center" },
    { header: "Код ОКЕИ", graph: "5", w: 0.04, align: "center" },
    { header: "Вид упак.", graph: "6", w: 0.05, align: "center" },
    { header: "Кол-во в месте", graph: "7", w: 0.05, align: "right" },
    { header: "Мест, штук", graph: "8", w: 0.05, align: "right" },
    { header: "Масса брутто", graph: "9", w: 0.06, align: "right" },
    { header: "Кол-во (нетто)", graph: "10", w: 0.06, align: "right" },
    { header: "Цена, руб.", graph: "11", w: 0.08, align: "right" },
    { header: "Сумма без НДС", graph: "12", w: 0.09, align: "right" },
    { header: "Ставка НДС", graph: "13", w: 0.05, align: "center" },
    { header: "Сумма НДС", graph: "14", w: 0.08, align: "right" },
    { header: "Сумма с НДС", graph: "15", w: 0.1, align: "right" },
  ];

  const rows: GridRow[] = data.items.map((it, i) => ({
    cells: [
      i + 1,
      it.name || "—",
      it.code || "—",
      it.unit || "—",
      it.unitCode || "—",
      it.pkgType || "—",
      it.perPlace || "—",
      it.places || "—",
      it.grossMass || "—",
      it.qty || 0,
      money(Number(it.price) || 0),
      money(lineBase(it)),
      vatLabel(it.vatRate),
      money(lineVat(it)),
      money(lineTotal(it)),
    ] as (string | number)[],
  }));

  rows.push({
    // "Всего по накладной" merged across графы 1–11 (no…price = indices 0–10).
    cells: ["Всего по накладной", "", "", "", "", "", "", "", "", "", "", money(totals.base), "", money(totals.vat), money(totals.total)],
    bold: true,
    merge: [0, 11],
  });

  drawGrid(d, cols, rows, { fontSize: 6.5, headerSize: 6 });

  // Summary.
  d.moveDown(10);
  const sumPair = (l1: string, v1: string, l2: string, v2: string) => {
    d.ensure(12);
    const y = d.y - 7;
    d.page.drawText(l1, { x: d.margin, y, size: 7, font: d.reg, color: MUTED });
    d.page.drawText(v1 || "—", { x: d.margin + 230, y, size: 7, font: d.bold, color: INK });
    if (l2) {
      d.page.drawText(l2, { x: d.margin + 330, y, size: 7, font: d.reg, color: MUTED });
      d.page.drawText(v2 || "—", { x: d.margin + 560, y, size: 7, font: d.bold, color: INK });
    }
    d.y -= 12;
  };
  sumPair("Товарная накладная имеет приложение на листах", data.appendixSheets, "Всего мест", data.totalPlaces);
  sumPair("Масса груза (нетто)", data.totalNetMass, "Масса груза (брутто)", data.totalGrossMass);
  sumPair("Всего отпущено на сумму, руб.", money(totals.total), "", "");

  // Signatures — two columns.
  d.moveDown(8);
  const sigColW = (d.contentW - gap) / 2;
  const signRow = (x: number, label: string, value: string, y: number): number => {
    d.page.drawText(label, { x, y: y - 7, size: 6.5, font: d.reg, color: MUTED });
    d.page.drawText(value || " ", { x, y: y - 17, size: 7, font: d.bold, color: INK });
    d.page.drawLine({ start: { x, y: y - 20 }, end: { x: x + sigColW - 10, y: y - 20 }, thickness: 0.5, color: INK });
    return y - 28;
  };
  d.ensure(160);
  const sigTop = d.y;
  let sy = sigTop;
  sy = signRow(leftX, "Отпуск груза разрешил (должность)", data.releaseAllowedPos, sy);
  sy = signRow(leftX, "Ф. И. О.", data.releaseAllowedName, sy);
  sy = signRow(leftX, "Главный бухгалтер (Ф. И. О.)", data.accountantName, sy);
  sy = signRow(leftX, "Отпуск груза произвёл (должность)", data.releasedByPos, sy);
  sy = signRow(leftX, "Ф. И. О.", data.releasedByName, sy);
  let sry = sigTop;
  sry = signRow(rightX, "Груз получил / принял (должность)", data.receivedByPos, sry);
  sry = signRow(rightX, "Ф. И. О.", data.receivedByName, sry);
  sry = signRow(rightX, "По доверенности № , выданной", data.proxyInfo, sry);
  d.page.drawText("М. П.", { x: rightX, y: sry - 8, size: 6.5, font: d.reg, color: MUTED });
  sry -= 16;
  d.y = Math.min(sy, sry);

  d.moveDown(10);
  d.text(
    "Форма ТОРГ-12 (унифицированная форма № ТОРГ-12, Постановление Госкомстата России № 132). Применяется для оформления продажи (отпуска) товарно-материальных ценностей. Перед применением сверьте реквизиты с действующей редакцией формы.",
    { size: 6.3, color: MUTED, lineGap: 1.4 },
  );

  d.footer(brand);
  return d.save();
}
