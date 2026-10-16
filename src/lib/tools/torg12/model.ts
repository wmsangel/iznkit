import { emptySfItem, type SfItem } from "@/lib/tools/schet-faktura/model";

export { computeSfTotals, lineBase, lineVat, lineTotal, vatLabel, type SfItem, type VatRate } from "@/lib/tools/schet-faktura/model";

/** ТОРГ-12 line — reuses the счёт-фактура item (name/unit/qty/price/vatRate → compute)
 *  and adds the goods-note columns (code, packaging, places, gross mass). */
export interface Torg12Item extends SfItem {
  /** графа 3 — код товара */
  code: string;
  /** графа 6 — вид упаковки */
  pkgType: string;
  /** графа 7 — количество в одном месте */
  perPlace: string;
  /** графа 8 — количество мест, штук */
  places: string;
  /** графа 9 — масса брутто */
  grossMass: string;
}

export interface Torg12Data {
  number: string;
  date: string;
  /** основание (договор, заказ-наряд) */
  basis: string;
  /** транспортная накладная (номер, дата) */
  transportDoc: string;
  /** вид операции */
  operationType: string;
  /** грузоотправитель */
  shipperName: string;
  shipperAddress: string;
  shipperOkpo: string;
  /** грузополучатель */
  consigneeName: string;
  consigneeAddress: string;
  /** поставщик */
  supplierName: string;
  /** плательщик */
  payerName: string;
  items: Torg12Item[];
  /** приложение (паспортов, сертификатов и т.п.), листов */
  appendixSheets: string;
  /** всего мест / масса нетто / масса брутто (итог прописью/числом) */
  totalPlaces: string;
  totalNetMass: string;
  totalGrossMass: string;
  /** подписи */
  releaseAllowedPos: string;
  releaseAllowedName: string;
  accountantName: string;
  releasedByPos: string;
  releasedByName: string;
  proxyInfo: string;
  receivedByPos: string;
  receivedByName: string;
}

export function emptyTorg12Item(): Torg12Item {
  return {
    ...emptySfItem(),
    code: "",
    pkgType: "—",
    perPlace: "",
    places: "",
    grossMass: "",
  };
}

export function emptyTorg12(): Torg12Data {
  const today = new Date().toISOString().slice(0, 10);
  return {
    number: "1",
    date: today,
    basis: "Договор",
    transportDoc: "",
    operationType: "",
    shipperName: "",
    shipperAddress: "",
    shipperOkpo: "",
    consigneeName: "",
    consigneeAddress: "",
    supplierName: "он же",
    payerName: "",
    items: [emptyTorg12Item()],
    appendixSheets: "",
    totalPlaces: "",
    totalNetMass: "",
    totalGrossMass: "",
    releaseAllowedPos: "",
    releaseAllowedName: "",
    accountantName: "",
    releasedByPos: "",
    releasedByName: "",
    proxyInfo: "",
    receivedByPos: "",
    receivedByName: "",
  };
}
