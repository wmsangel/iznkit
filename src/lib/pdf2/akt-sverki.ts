import { Doc, INK, MUTED, money } from "./layout";
import { computeAktTotals, type AktSverkiData } from "@/lib/tools/akt-sverki/model";

/**
 * Акт сверки взаимных расчётов — pdf-lib builder (Workers-compatible). Two-sided
 * ledger: the user's side filled, the counterparty's columns left blank to fill.
 */
export async function buildAktSverkiPdf(data: AktSverkiData, brand: string): Promise<Uint8Array> {
  const d = await Doc.create({ margin: 40 });
  const t = computeAktTotals(data);
  const org1 = data.org1Name || "Организация";
  const org2 = data.org2Name || "Контрагент";

  const period = [data.periodFrom, data.periodTo].filter(Boolean).join(" — ");
  const title = `Акт сверки взаимных расчётов${data.number ? ` № ${data.number}` : ""}${data.date ? ` от ${data.date}` : ""}`;
  d.text(title, { size: 14, bold: true, align: "center" });
  if (period || data.contract) {
    d.moveDown(2);
    d.text(
      `${period ? `за период ${period}` : ""}${period && data.contract ? " · " : ""}${data.contract ? `по договору ${data.contract}` : ""}`,
      { size: 9, color: MUTED, align: "center" },
    );
  }
  d.moveDown(10);

  d.field("Организация", [data.org1Name, data.org1Details].filter(Boolean).join(", "), { labelW: 90 });
  d.field("Контрагент", [data.org2Name, data.org2Details].filter(Boolean).join(", "), { labelW: 90 });
  d.moveDown(4);

  d.text(
    `Мы, нижеподписавшиеся, ${org1} и ${org2}, составили настоящий акт о том, что состояние взаимных расчётов по данным учёта следующее:`,
    { size: 9, lineGap: 1.4 },
  );
  d.moveDown(8);

  const openDebit = t.opening > 0 ? money(Math.abs(t.opening)) : "";
  const openCredit = t.opening < 0 ? money(Math.abs(t.opening)) : "";
  const closeDebit = t.closing > 0 ? money(Math.abs(t.closing)) : "";
  const closeCredit = t.closing < 0 ? money(Math.abs(t.closing)) : "";

  const rows: (string | number)[][] = [];
  rows.push(["", "Сальдо на начало периода", openDebit, openCredit, "", ""]);
  for (const r of data.rows.filter((r) => r.date || r.doc || r.debit || r.credit)) {
    rows.push([r.date, r.doc, Number(r.debit) ? money(Number(r.debit)) : "", Number(r.credit) ? money(Number(r.credit)) : "", "", ""]);
  }
  rows.push(["", "Обороты за период", money(t.debit), money(t.credit), "", ""]);
  rows.push(["", "Сальдо на конец периода", closeDebit, closeCredit, "", ""]);

  d.table(
    [
      { header: "Дата", w: 0.12 },
      { header: "Документ, операция", w: 0.36 },
      { header: `Дебет\nпо данным ${org1}`, w: 0.13, align: "right" },
      { header: "Кредит", w: 0.13, align: "right" },
      { header: `Дебет\nпо данным ${org2}`, w: 0.13, align: "right" },
      { header: "Кредит", w: 0.13, align: "right" },
    ],
    rows,
    { fontSize: 8 },
  );

  d.moveDown(10);
  const beneficiary = t.closing > 0 ? org1 : org2;
  const summary =
    t.closing === 0
      ? `По данным ${org1} на конец периода задолженность отсутствует.`
      : `По данным ${org1} на конец периода задолженность в пользу ${beneficiary} составляет ${money(Math.abs(t.closing))} руб.`;
  d.text(summary, { size: 9.5, lineGap: 1.4 });

  // Signatures — two columns.
  d.moveDown(18);
  const colW = (d.contentW - 30) / 2;
  const sTop = d.y;
  const sign = (x: number, head: string, pos: string, name: string) => {
    d.y = sTop;
    d.page.drawText(head, { x, y: d.y - 10, size: 9.5, font: d.bold, color: INK });
    d.y -= 22;
    d.page.drawText("Должность", { x, y: d.y - 7, size: 7, font: d.reg, color: MUTED });
    d.page.drawText(pos || " ", { x, y: d.y - 18, size: 9, font: d.bold, color: INK });
    d.page.drawLine({ start: { x, y: d.y - 21 }, end: { x: x + colW, y: d.y - 21 }, thickness: 0.6, color: INK });
    d.y -= 34;
    d.page.drawText("Подпись / Ф. И. О.", { x, y: d.y - 7, size: 7, font: d.reg, color: MUTED });
    d.page.drawText(name || " ", { x, y: d.y - 18, size: 9, font: d.bold, color: INK });
    d.page.drawLine({ start: { x, y: d.y - 21 }, end: { x: x + colW, y: d.y - 21 }, thickness: 0.6, color: INK });
    d.y -= 34;
    d.page.drawText("М. П.", { x, y: d.y - 7, size: 7, font: d.reg, color: MUTED });
    d.y -= 14;
  };
  sign(d.margin, `От ${org1}`, data.org1SignPos, data.org1SignName);
  const leftEnd = d.y;
  sign(d.margin + colW + 30, `От ${org2}`, data.org2SignPos, data.org2SignName);
  d.y = Math.min(leftEnd, d.y);

  d.moveDown(14);
  d.text(
    `Акт сверки взаимных расчётов составляется в произвольной форме и не является унифицированным документом. Правая сторона таблицы («по данным ${org2}») заполняется контрагентом. Проверьте реквизиты и суммы перед подписанием.`,
    { size: 7, color: MUTED, lineGap: 1.4 },
  );

  d.footer(brand);
  return d.save();
}
