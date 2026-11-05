import { Doc, INK, MUTED, SOFT_BG, money } from "./layout";
import { drawGrid, type GridCol, type GridRow } from "./grid";
import { computeSfTotals, lineBase, lineVat, lineTotal, vatLabel, type SfData } from "@/lib/tools/schet-faktura/model";

/**
 * Счёт-фактура — pdf-lib builder (Workers-compatible). Form per Постановление
 * Правительства РФ № 1137 (graphs 1–11). Faithful to the previous @react-pdf
 * layout; source cited in the footnote.
 */
export async function buildSchetFakturaPdf(data: SfData, brand: string): Promise<Uint8Array> {
  const d = await Doc.create({ landscape: true, margin: 28 });
  const totals = computeSfTotals(data);
  const sellerInnKpp = [data.sellerInn, data.sellerKpp].filter(Boolean).join(" / ") || "—";
  const buyerInnKpp = [data.buyerInn, data.buyerKpp].filter(Boolean).join(" / ") || "—";
  const currency = `${data.currencyName || "—"}, ${data.currencyCode || "—"}`;

  d.text(`Счёт-фактура № ${data.number || "—"} от ${data.date || "—"}`, { size: 13, bold: true });
  d.moveDown(1);
  d.text(data.correction ? `Исправление: ${data.correction}` : "Исправление № — от — (при составлении исправленного счёта-фактуры)", { size: 8, color: MUTED });
  d.moveDown(8);

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
    // "Всего к оплате" merged across graphs 1–4 (no…price), then base/vat/total.
    cells: ["Всего к оплате", "", "", "", "", "", money(totals.base), "", "", money(totals.vat), money(totals.total), "", ""],
    bold: true,
    bg: SOFT_BG,
    merge: [0, 6],
  });

  drawGrid(d, cols, rows, { fontSize: 7.5 });

  // Signatures.
  d.moveDown(18);
  const colW = (d.contentW - 30) / 2;
  const top = d.y;
  const block = (x: number, label: string, value: string) => {
    d.y = top;
    for (const ln of d.wrap(label, d.reg, 8, colW)) {
      d.page.drawText(ln, { x, y: d.y - 8, size: 8, font: d.reg, color: MUTED });
      d.y -= 11;
    }
    d.y -= 14;
    d.page.drawLine({ start: { x, y: d.y }, end: { x: x + colW, y: d.y }, thickness: 0.7, color: INK });
    d.page.drawText(value || "подпись / Ф. И. О.", { x, y: d.y - 9, size: 7, font: d.reg, color: MUTED });
    d.y -= 14;
  };
  block(
    d.margin,
    data.isSoleTrader ? "Индивидуальный предприниматель (или иное уполномоченное лицо)" : "Руководитель организации или иное уполномоченное лицо",
    data.signerHead,
  );
  const leftEnd = d.y;
  if (!data.isSoleTrader) block(d.margin + colW + 30, "Главный бухгалтер или иное уполномоченное лицо", data.signerAccountant);
  else block(d.margin + colW + 30, "Реквизиты свидетельства о гос. регистрации ИП", data.ogrnip ? `ОГРНИП: ${data.ogrnip}` : "ОГРНИП");
  d.y = Math.min(leftEnd, d.y);

  d.moveDown(14);
  d.text(
    "Документ сформирован по форме счёта-фактуры (Постановление Правительства РФ № 1137). Графы прослеживаемости (12, 12а, 13, 14) заполняются отдельно для прослеживаемых товаров. Перед применением сверьте реквизиты с действующей редакцией формы.",
    { size: 6.5, color: MUTED, lineGap: 1.4 },
  );

  d.footer(brand);
  return d.save();
}
