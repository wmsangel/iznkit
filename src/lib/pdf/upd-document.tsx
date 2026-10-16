import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { DOC_FONT } from "./fonts";
import { computeSfTotals, lineBase, lineVat, lineTotal } from "@/lib/tools/schet-faktura/model";
import { vatLabel } from "@/lib/tools/schet-faktura/model";
import type { UpdData } from "@/lib/tools/upd/model";

const INK = "#111827";
const MUTED = "#6b7280";
const LINE = "#9ca3af";
const LINE_SOFT = "#d1d5db";

const money = (n: number) =>
  n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const s = StyleSheet.create({
  page: { fontFamily: DOC_FONT, fontSize: 7.5, color: INK, paddingTop: 28, paddingBottom: 36, paddingHorizontal: 28 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 },
  title: { fontSize: 13, fontWeight: "bold" },
  statusBox: { borderWidth: 1, borderColor: INK, paddingVertical: 2, paddingHorizontal: 6, textAlign: "center" },
  statusNum: { fontSize: 12, fontWeight: "bold" },
  statusCap: { fontSize: 5.5, color: MUTED },
  sub: { fontSize: 8, color: MUTED, marginBottom: 10 },
  line: { flexDirection: "row", marginBottom: 2.5 },
  lbl: { color: MUTED, width: 180 },
  val: { flex: 1, fontWeight: "bold" },
  table: { marginTop: 10, borderWidth: 1, borderColor: LINE },
  headRow: { flexDirection: "row", backgroundColor: "#f3f4f6", borderBottomWidth: 1, borderColor: LINE },
  numRow: { flexDirection: "row", backgroundColor: "#f9fafb", borderBottomWidth: 1, borderColor: LINE },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: LINE_SOFT },
  totalRow: { flexDirection: "row", backgroundColor: "#f9fafb" },
  cell: { paddingVertical: 3, paddingHorizontal: 3, borderRightWidth: 1, borderColor: LINE_SOFT },
  th: { fontWeight: "bold", fontSize: 6.8 },
  gnum: { color: MUTED, fontSize: 6, textAlign: "center" },
  r: { textAlign: "right" },
  c: { textAlign: "center" },
  // transfer part
  block: { marginTop: 10 },
  blockLine: { flexDirection: "row", marginBottom: 3 },
  transfer: { marginTop: 12, flexDirection: "row", justifyContent: "space-between" },
  tCol: { width: "48%", borderWidth: 1, borderColor: LINE_SOFT, padding: 6 },
  tHead: { fontWeight: "bold", fontSize: 7, marginBottom: 6 },
  tField: { flexDirection: "row", marginBottom: 5 },
  tLbl: { color: MUTED, width: 70 },
  tVal: { flex: 1, borderBottomWidth: 1, borderColor: INK, fontWeight: "bold", minHeight: 9 },
  note: { marginTop: 14, color: MUTED, fontSize: 6.5, lineHeight: 1.4 },
  footer: { position: "absolute", bottom: 16, left: 28, right: 28, textAlign: "center", color: MUTED, fontSize: 6.5, borderTopWidth: 1, borderColor: LINE_SOFT, paddingTop: 5 },
});

const W = {
  no: "3%", name: "16%", unitCode: "5%", unit: "6%", qty: "6%", price: "9%", base: "10%",
  excise: "7%", rate: "6%", vat: "9%", total: "10%", country: "6%", gtd: "7%",
} as const;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.line}>
      <Text style={s.lbl}>{label}</Text>
      <Text style={s.val}>{value || "—"}</Text>
    </View>
  );
}

function TField({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.tField}>
      <Text style={s.tLbl}>{label}</Text>
      <Text style={s.tVal}>{value || " "}</Text>
    </View>
  );
}

export function UpdDocument({ data, brand }: { data: UpdData; brand: string }) {
  const totals = computeSfTotals(data);
  const sellerInnKpp = [data.sellerInn, data.sellerKpp].filter(Boolean).join(" / ") || "—";
  const buyerInnKpp = [data.buyerInn, data.buyerKpp].filter(Boolean).join(" / ") || "—";
  const currency = `${data.currencyName || "—"}, ${data.currencyCode || "—"}`;
  const statusCap = data.status === "1" ? "счёт-фактура и передаточный документ" : "передаточный документ";

  return (
    <Document title={`УПД № ${data.number}`}>
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.topRow}>
          <View>
            <Text style={s.title}>Универсальный передаточный документ № {data.number || "—"} от {data.date || "—"}</Text>
            <Text style={s.sub}>
              {data.correction ? `Исправление: ${data.correction}` : "Исправление № — от —"}
            </Text>
          </View>
          <View style={s.statusBox}>
            <Text style={s.statusCap}>Статус</Text>
            <Text style={s.statusNum}>{data.status}</Text>
            <Text style={s.statusCap}>{statusCap}</Text>
          </View>
        </View>

        <Field label="Продавец" value={data.sellerName} />
        <Field label="Адрес" value={data.sellerAddress} />
        <Field label="ИНН / КПП продавца" value={sellerInnKpp} />
        <Field label="Грузоотправитель и его адрес" value={data.shipper} />
        <Field label="Грузополучатель и его адрес" value={data.consignee} />
        <Field label="К платёжно-расчётному документу №" value={data.paymentDoc} />
        <Field label="Покупатель" value={data.buyerName} />
        <Field label="Адрес" value={data.buyerAddress} />
        <Field label="ИНН / КПП покупателя" value={buyerInnKpp} />
        <Field label="Валюта: наименование, код" value={currency} />
        {data.govContract ? <Field label="Идентификатор гос. контракта" value={data.govContract} /> : null}

        {/* Table — графы 1–11 */}
        <View style={s.table}>
          <View style={s.headRow}>
            <Text style={[s.cell, s.th, s.c, { width: W.no }]}>№ п/п</Text>
            <Text style={[s.cell, s.th, { width: W.name }]}>Наименование товара (работ, услуг)</Text>
            <Text style={[s.cell, s.th, s.c, { width: W.unitCode }]}>Код ед.</Text>
            <Text style={[s.cell, s.th, s.c, { width: W.unit }]}>Ед. изм.</Text>
            <Text style={[s.cell, s.th, s.r, { width: W.qty }]}>Кол-во</Text>
            <Text style={[s.cell, s.th, s.r, { width: W.price }]}>Цена за ед. без НДС</Text>
            <Text style={[s.cell, s.th, s.r, { width: W.base }]}>Стоимость без НДС</Text>
            <Text style={[s.cell, s.th, s.c, { width: W.excise }]}>В т.ч. акциз</Text>
            <Text style={[s.cell, s.th, s.c, { width: W.rate }]}>Нал. ставка</Text>
            <Text style={[s.cell, s.th, s.r, { width: W.vat }]}>Сумма НДС</Text>
            <Text style={[s.cell, s.th, s.r, { width: W.total }]}>Стоимость с НДС</Text>
            <Text style={[s.cell, s.th, s.c, { width: W.country }]}>Страна (код/наим.)</Text>
            <Text style={[s.cell, s.th, s.c, { width: W.gtd, borderRightWidth: 0 }]}>№ ГТД / РНПТ</Text>
          </View>
          <View style={s.numRow}>
            <Text style={[s.cell, s.gnum, { width: W.no }]}>1</Text>
            <Text style={[s.cell, s.gnum, { width: W.name }]}>1а</Text>
            <Text style={[s.cell, s.gnum, { width: W.unitCode }]}>2</Text>
            <Text style={[s.cell, s.gnum, { width: W.unit }]}>2а</Text>
            <Text style={[s.cell, s.gnum, { width: W.qty }]}>3</Text>
            <Text style={[s.cell, s.gnum, { width: W.price }]}>4</Text>
            <Text style={[s.cell, s.gnum, { width: W.base }]}>5</Text>
            <Text style={[s.cell, s.gnum, { width: W.excise }]}>6</Text>
            <Text style={[s.cell, s.gnum, { width: W.rate }]}>7</Text>
            <Text style={[s.cell, s.gnum, { width: W.vat }]}>8</Text>
            <Text style={[s.cell, s.gnum, { width: W.total }]}>9</Text>
            <Text style={[s.cell, s.gnum, { width: W.country }]}>10 / 10а</Text>
            <Text style={[s.cell, s.gnum, { width: W.gtd, borderRightWidth: 0 }]}>11</Text>
          </View>
          {data.items.map((it, i) => (
            <View style={s.row} key={i} wrap={false}>
              <Text style={[s.cell, s.c, { width: W.no }]}>{i + 1}</Text>
              <Text style={[s.cell, { width: W.name }]}>{it.name || "—"}</Text>
              <Text style={[s.cell, s.c, { width: W.unitCode }]}>{it.unitCode || "—"}</Text>
              <Text style={[s.cell, s.c, { width: W.unit }]}>{it.unit || "—"}</Text>
              <Text style={[s.cell, s.r, { width: W.qty }]}>{it.qty || 0}</Text>
              <Text style={[s.cell, s.r, { width: W.price }]}>{money(Number(it.price) || 0)}</Text>
              <Text style={[s.cell, s.r, { width: W.base }]}>{money(lineBase(it))}</Text>
              <Text style={[s.cell, s.c, { width: W.excise }]}>{it.excise || "без акциза"}</Text>
              <Text style={[s.cell, s.c, { width: W.rate }]}>{vatLabel(it.vatRate)}</Text>
              <Text style={[s.cell, s.r, { width: W.vat }]}>{money(lineVat(it))}</Text>
              <Text style={[s.cell, s.r, { width: W.total }]}>{money(lineTotal(it))}</Text>
              <Text style={[s.cell, s.c, { width: W.country }]}>
                {[it.countryCode, it.country].filter((x) => x && x !== "—").join(" / ") || "—"}
              </Text>
              <Text style={[s.cell, s.c, { width: W.gtd, borderRightWidth: 0, fontSize: 6.8 }]}>
                {it.customsDecl ? it.customsDecl.replace(/\/(?=.)/g, "/\n") : "—"}
              </Text>
            </View>
          ))}
          <View style={s.totalRow}>
            <Text style={[s.cell, s.th, { width: `${3 + 16 + 5 + 6 + 6 + 9}%` }]}>Всего к оплате</Text>
            <Text style={[s.cell, s.th, s.r, { width: W.base }]}>{money(totals.base)}</Text>
            <Text style={[s.cell, { width: W.excise }]}> </Text>
            <Text style={[s.cell, { width: W.rate }]}> </Text>
            <Text style={[s.cell, s.th, s.r, { width: W.vat }]}>{money(totals.vat)}</Text>
            <Text style={[s.cell, s.th, s.r, { width: W.total }]}>{money(totals.total)}</Text>
            <Text style={[s.cell, { width: W.country }]}> </Text>
            <Text style={[s.cell, { width: W.gtd, borderRightWidth: 0 }]}> </Text>
          </View>
        </View>

        {/* Transfer part */}
        <View style={s.block}>
          <Field label="Основание передачи (сдачи) / получения (приёмки)" value={data.basis} />
          {data.transport ? <Field label="Данные о транспортировке и грузе" value={data.transport} /> : null}
        </View>

        <View style={s.transfer}>
          <View style={s.tCol}>
            <Text style={s.tHead}>Товар (груз) передал / услуги, результаты работ, права сдал</Text>
            <TField label="Должность" value={data.handoverPosition} />
            <TField label="Ф. И. О." value={data.handoverName} />
            <TField label="Дата отгрузки, передачи (сдачи)" value={data.handoverDate} />
          </View>
          <View style={s.tCol}>
            <Text style={s.tHead}>Товар (груз) получил / услуги, результаты работ, права принял</Text>
            <TField label="Должность" value={data.receivePosition} />
            <TField label="Ф. И. О." value={data.receiveName} />
            <TField label="Дата получения (приёмки)" value={data.receiveDate} />
          </View>
        </View>

        <Text style={s.note}>
          Форма УПД рекомендована письмом ФНС России № ММВ-20-3/96@. Статус 1 — счёт-фактура и
          передаточный документ (акт/накладная); статус 2 — только передаточный документ. Графы
          прослеживаемости (12, 12а, 13, 14) заполняются отдельно для прослеживаемых товаров.
          Перед применением сверьте реквизиты с действующей редакцией формы.
        </Text>

        <Text style={s.footer} fixed>{brand}</Text>
      </Page>
    </Document>
  );
}
