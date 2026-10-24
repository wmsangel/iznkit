/**
 * Акт сверки взаимных расчётов — reconciliation statement between two parties.
 *
 * There is no official form: it is drawn up in free form. We render the common
 * two-sided ledger — "По данным {org1}" filled from the user's books, and a
 * blank "По данным {org2}" side for the counterparty to complete and return.
 * Balance is computed from org1's perspective: debit grows what org2 owes us
 * (our shipments / sales), credit reduces it (their payments).
 */

export interface AktRow {
  /** дата операции */
  date: string;
  /** содержание операции / документ (реализация, оплата, № и дата) */
  doc: string;
  /** дебет — задолженность контрагента растёт (наша отгрузка/реализация) */
  debit: string;
  /** кредит — задолженность контрагента уменьшается (их оплата) */
  credit: string;
}

export interface AktSverkiData {
  /** № акта */
  number: string;
  /** дата составления акта */
  date: string;
  /** период сверки */
  periodFrom: string;
  periodTo: string;
  /** ваша организация */
  org1Name: string;
  org1Details: string;
  /** контрагент */
  org2Name: string;
  org2Details: string;
  /** договор (№, дата) */
  contract: string;
  /** сальдо на начало периода (число) */
  openingBalance: string;
  /** в чью пользу начальное сальдо: debit = контрагент должен вам */
  openingSide: "debit" | "credit";
  rows: AktRow[];
  /** подписи */
  org1SignPos: string;
  org1SignName: string;
  org2SignPos: string;
  org2SignName: string;
}

export function emptyAktRow(): AktRow {
  return { date: "", doc: "", debit: "", credit: "" };
}

export function emptyAktSverki(): AktSverkiData {
  return {
    number: "",
    date: "",
    periodFrom: "",
    periodTo: "",
    org1Name: "",
    org1Details: "",
    org2Name: "",
    org2Details: "",
    contract: "",
    openingBalance: "",
    openingSide: "debit",
    rows: [emptyAktRow(), emptyAktRow()],
    org1SignPos: "",
    org1SignName: "",
    org2SignPos: "",
    org2SignName: "",
  };
}

const num = (v: string) => (v === "" ? 0 : Number(v) || 0);

export interface AktTotals {
  /** оборот по дебету за период */
  debit: number;
  /** оборот по кредиту за период */
  credit: number;
  /** сальдо на начало, знаковое (>0 — контрагент должен вам) */
  opening: number;
  /** сальдо на конец, знаковое (>0 — контрагент должен вам) */
  closing: number;
}

export function computeAktTotals(data: { rows: AktRow[]; openingBalance: string; openingSide: "debit" | "credit" }): AktTotals {
  const debit = data.rows.reduce((s, r) => s + num(r.debit), 0);
  const credit = data.rows.reduce((s, r) => s + num(r.credit), 0);
  const opening = num(data.openingBalance) * (data.openingSide === "debit" ? 1 : -1);
  const closing = opening + debit - credit;
  return { debit, credit, opening, closing };
}
