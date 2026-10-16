import { emptySf, type SfData } from "@/lib/tools/schet-faktura/model";

export { emptySfItem, computeSfTotals, lineBase, lineVat, lineTotal, type SfItem, type VatRate } from "@/lib/tools/schet-faktura/model";

/** УПД status (ФНС letter ММВ-20-3/96@): 1 = СФ + передаточный, 2 = только передаточный. */
export type UpdStatus = "1" | "2";

/** Universal transfer document = счёт-фактура (графы 1–11) + the primary-document transfer part. */
export interface UpdData extends SfData {
  status: UpdStatus;
  /** Основание передачи (сдачи) / получения (приёмки) — договор, заявка и т.п. */
  basis: string;
  /** Данные о транспортировке и грузе */
  transport: string;
  /** Товар (груз) передал / услуги сдал */
  handoverPosition: string;
  handoverName: string;
  /** Дата отгрузки, передачи (сдачи) */
  handoverDate: string;
  /** Товар (груз) получил / услуги принял */
  receivePosition: string;
  receiveName: string;
  /** Дата получения (приёмки) */
  receiveDate: string;
}

export function emptyUpd(): UpdData {
  return {
    ...emptySf(),
    status: "1",
    basis: "",
    transport: "",
    handoverPosition: "",
    handoverName: "",
    handoverDate: "",
    receivePosition: "",
    receiveName: "",
    receiveDate: "",
  };
}
