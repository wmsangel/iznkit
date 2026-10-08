import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { DOC_FONT } from "./fonts";
import {
  computeSfTotals,
  lineBase,
  lineVat,
  lineTotal,
  vatLabel,
  type SfData,
} from "@/lib/tools/schet-faktura/model";

const INK = "#111827";
const MUTED = "#6b7280";
const LINE = "#9ca3af";
const LINE_SOFT = "#d1d5db";

const money = (n: number) =>
  n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const s = StyleSheet.create({
  page: {
    fontFamily: DOC_FONT,
    fontSize: 7.5,
    color: INK,
    paddingTop: 28,
    paddingBottom: 36,
    paddingHorizontal: 28,
  },
  title: { fontSize: 13, fontWeight: "bold", marginBottom: 2 },
  sub: { fontSize: 8, color: MUTED, marginBottom: 10 },
  line: { flexDirection: "row", marginBottom: 2.5 },
  lbl: { color: MUTED, width: 180 },
  val: { flex: 1, fontWeight: "bold" },
  // table
  table: { marginTop: 10, borderWidth: 1, borderColor: LINE },
  headRow: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 1,
    borderColor: LINE,
  },
  numRow: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderColor: LINE,
  },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: LINE_SOFT },
  totalRow: { flexDirection: "row", backgroundColor: "#f9fafb" },
  cell: {
    paddingVertical: 3,
    paddingHorizontal: 3,
    borderRightWidth: 1,
    borderColor: LINE_SOFT,
  },
  th: { fontWeight: "bold", fontSize: 6.8 },
  gnum: { color: MUTED, fontSize: 6, textAlign: "center" },
  r: { textAlign: "right" },
  c: { textAlign: "center" },
  sign: { marginTop: 18, flexDirection: "row", justifyContent: "space-between" },
  signBlock: { width: "48%" },
  signLabel: { color: MUTED, marginBottom: 10 },
  signLine: { borderTopWidth: 1, borderColor: INK, paddingTop: 2, color: MUTED, fontSize: 6.5 },
  note: { marginTop: 14, color: MUTED, fontSize: 6.5, lineHeight: 1.4 },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 28,
    right: 28,
    textAlign: "center",
    color: MUTED,
    fontSize: 6.5,
    borderTopWidth: 1,
    borderColor: LINE_SOFT,
    paddingTop: 5,
  },
});

// Column widths (percent), graph 1 … 11.
const W = {
  no: "3%",
  name: "16%",
  unitCode: "5%",
  unit: "6%",
  qty: "6%",
  price: "9%",
  base: "10%",
  excise: "7%",
  rate: "6%",
  vat: "9%",
  total: "10%",
  country: "6%",
  gtd: "7%",
} as const;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.line}>
      <Text style={s.lbl}>{label}</Text>
      <Text style={s.val}>{value || "—"}</Text>
    </View>
  );
}

export function SchetFakturaDocument({ data, brand }: { data: SfData; brand: string }) {
  const totals = computeSfTotals(data);
  const sellerInnKpp = [data.sellerInn, data.sellerKpp].filter(Boolean).join(" / ") || "—";
  const buyerInnKpp = [data.buyerInn, data.buyerKpp].filter(Boolean).join(" / ") || "—";
  const currency = `${data.currencyName || "—"}, ${data.currencyCode || "—"}`;

  return (
    <Document title={`Счёт-фактура № ${data.number}`}>
      <Page size="A4" orientation="landscape" style={s.page}>
        <Text style={s.title}>
          Счёт-фактура № {data.number || "—"} от {data.date || "—"}
        </Text>
        <Text style={s.sub}>
          {data.correction
            ? `Исправление: ${data.correction}`
            : "Исправление № — от — (при составлении исправленного счёта-фактуры)"}
        </Text>

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
        {data.govContract ? (
          <Field label="Идентификатор гос. контракта" value={data.govContract} />
        ) : null}

        {/* Table */}
        <View style={s.table}>
          {/* header labels */}
          <View style={s.headRow}>
            <Text style={[s.cell, s.th, s.c, { width: W.no }]}>№ п/п</Text>
            <Text style={[s.cell, s.th, { width: W.name }]}>
              Наименование товара (работ, услуг)
            </Text>
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
            <Text style={[s.cell, s.th, s.c, { width: W.gtd, borderRightWidth: 0 }]}>
              № ГТД / РНПТ
            </Text>
          </View>
          {/* graph numbers */}
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
          {/* data rows */}
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
                {/* Global hyphenation is disabled, so long slash-delimited ГТД/РНПТ
                    numbers can't break mid-token — force a wrap after each slash. */}
                {it.customsDecl ? it.customsDecl.replace(/\/(?=.)/g, "/\n") : "—"}
              </Text>
            </View>
          ))}
          {/* totals */}
          <View style={s.totalRow}>
            <Text style={[s.cell, s.th, { width: `${3 + 16 + 5 + 6 + 6 + 9}%` }]}>
              Всего к оплате
            </Text>
            <Text style={[s.cell, s.th, s.r, { width: W.base }]}>{money(totals.base)}</Text>
            <Text style={[s.cell, { width: W.excise }]}> </Text>
            <Text style={[s.cell, { width: W.rate }]}> </Text>
            <Text style={[s.cell, s.th, s.r, { width: W.vat }]}>{money(totals.vat)}</Text>
            <Text style={[s.cell, s.th, s.r, { width: W.total }]}>{money(totals.total)}</Text>
            <Text style={[s.cell, { width: W.country }]}> </Text>
            <Text style={[s.cell, { width: W.gtd, borderRightWidth: 0 }]}> </Text>
          </View>
        </View>

        {/* Signatures */}
        <View style={s.sign}>
          <View style={s.signBlock}>
            <Text style={s.signLabel}>
              {data.isSoleTrader
                ? "Индивидуальный предприниматель (или иное уполномоченное лицо)"
                : "Руководитель организации или иное уполномоченное лицо"}
            </Text>
            <Text style={s.signLine}>
              {data.signerHead ? `${data.signerHead}` : "подпись / Ф. И. О."}
            </Text>
          </View>
          {!data.isSoleTrader ? (
            <View style={s.signBlock}>
              <Text style={s.signLabel}>Главный бухгалтер или иное уполномоченное лицо</Text>
              <Text style={s.signLine}>
                {data.signerAccountant ? `${data.signerAccountant}` : "подпись / Ф. И. О."}
              </Text>
            </View>
          ) : (
            <View style={s.signBlock}>
              <Text style={s.signLabel}>Реквизиты свидетельства о гос. регистрации ИП</Text>
              <Text style={s.signLine}>{data.ogrnip ? `ОГРНИП: ${data.ogrnip}` : "ОГРНИП"}</Text>
            </View>
          )}
        </View>

        <Text style={s.note}>
          Документ сформирован по форме счёта-фактуры (Постановление Правительства РФ № 1137).
          Графы прослеживаемости (12, 12а, 13, 14) заполняются отдельно для прослеживаемых товаров.
          Перед применением сверьте реквизиты с действующей редакцией формы.
        </Text>

        <Text style={s.footer} fixed>
          {brand}
        </Text>
      </Page>
    </Document>
  );
}
