import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { DOC_FONT } from "./fonts";
import { computeSfTotals, lineBase, lineVat, lineTotal, vatLabel } from "@/lib/tools/schet-faktura/model";
import type { Torg12Data } from "@/lib/tools/torg12/model";

const INK = "#111827";
const MUTED = "#6b7280";
const LINE = "#9ca3af";
const LINE_SOFT = "#d1d5db";

const money = (n: number) =>
  n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const s = StyleSheet.create({
  page: { fontFamily: DOC_FONT, fontSize: 7, color: INK, paddingTop: 26, paddingBottom: 34, paddingHorizontal: 24 },
  title: { fontSize: 12, fontWeight: "bold", textAlign: "center", marginTop: 6, marginBottom: 8 },
  line: { flexDirection: "row", marginBottom: 2.5 },
  lbl: { color: MUTED, width: 150 },
  val: { flex: 1, fontWeight: "bold" },
  two: { flexDirection: "row", justifyContent: "space-between" },
  twoCol: { width: "49%" },
  table: { marginTop: 8, borderWidth: 1, borderColor: LINE },
  headRow: { flexDirection: "row", backgroundColor: "#f3f4f6", borderBottomWidth: 1, borderColor: LINE },
  numRow: { flexDirection: "row", backgroundColor: "#f9fafb", borderBottomWidth: 1, borderColor: LINE },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: LINE_SOFT },
  totalRow: { flexDirection: "row", backgroundColor: "#f9fafb" },
  cell: { paddingVertical: 2.5, paddingHorizontal: 2, borderRightWidth: 1, borderColor: LINE_SOFT },
  th: { fontWeight: "bold", fontSize: 6.2 },
  gnum: { color: MUTED, fontSize: 5.5, textAlign: "center" },
  r: { textAlign: "right" },
  c: { textAlign: "center" },
  summary: { marginTop: 8 },
  sign: { marginTop: 12, flexDirection: "row", justifyContent: "space-between" },
  signCol: { width: "48%" },
  signRow: { marginBottom: 7 },
  signLbl: { color: MUTED, fontSize: 6.5 },
  signVal: { borderBottomWidth: 1, borderColor: INK, fontWeight: "bold", minHeight: 9, fontSize: 7 },
  note: { marginTop: 12, color: MUTED, fontSize: 6.3, lineHeight: 1.4 },
  footer: { position: "absolute", bottom: 14, left: 24, right: 24, textAlign: "center", color: MUTED, fontSize: 6.3, borderTopWidth: 1, borderColor: LINE_SOFT, paddingTop: 5 },
});

const W = {
  no: "3%", name: "16%", code: "5%", unit: "5%", unitCode: "4%", pkg: "5%", perPlace: "5%",
  places: "5%", gross: "6%", qty: "6%", price: "8%", base: "9%", rate: "5%", vat: "8%", total: "10%",
} as const;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.line}>
      <Text style={s.lbl}>{label}</Text>
      <Text style={s.val}>{value || "—"}</Text>
    </View>
  );
}
function SignRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.signRow}>
      <Text style={s.signLbl}>{label}</Text>
      <Text style={s.signVal}>{value || " "}</Text>
    </View>
  );
}

export function Torg12Document({ data, brand }: { data: Torg12Data; brand: string }) {
  const totals = computeSfTotals(data);
  const shipper = [data.shipperName, data.shipperAddress].filter(Boolean).join(", ");

  return (
    <Document title={`Товарная накладная № ${data.number}`}>
      <Page size="A4" orientation="landscape" style={s.page}>
        <View style={s.two}>
          <View style={s.twoCol}>
            <Field label="Грузоотправитель" value={shipper} />
            <Field label="ОКПО грузоотправителя" value={data.shipperOkpo} />
            <Field label="Поставщик" value={data.supplierName} />
            <Field label="Плательщик" value={data.payerName} />
          </View>
          <View style={s.twoCol}>
            <Field label="Грузополучатель" value={[data.consigneeName, data.consigneeAddress].filter(Boolean).join(", ")} />
            <Field label="Основание" value={data.basis} />
            <Field label="Транспортная накладная" value={data.transportDoc} />
            <Field label="Вид операции" value={data.operationType} />
          </View>
        </View>

        <Text style={s.title}>ТОВАРНАЯ НАКЛАДНАЯ (ТОРГ-12) № {data.number || "—"} от {data.date || "—"}</Text>

        {/* Goods table — графы 1–15 */}
        <View style={s.table}>
          <View style={s.headRow}>
            <Text style={[s.cell, s.th, s.c, { width: W.no }]}>№</Text>
            <Text style={[s.cell, s.th, { width: W.name }]}>Товар (наименование, характеристика, сорт, артикул)</Text>
            <Text style={[s.cell, s.th, s.c, { width: W.code }]}>Код</Text>
            <Text style={[s.cell, s.th, s.c, { width: W.unit }]}>Ед. изм.</Text>
            <Text style={[s.cell, s.th, s.c, { width: W.unitCode }]}>Код ОКЕИ</Text>
            <Text style={[s.cell, s.th, s.c, { width: W.pkg }]}>Вид упак.</Text>
            <Text style={[s.cell, s.th, s.r, { width: W.perPlace }]}>Кол-во в месте</Text>
            <Text style={[s.cell, s.th, s.r, { width: W.places }]}>Мест, штук</Text>
            <Text style={[s.cell, s.th, s.r, { width: W.gross }]}>Масса брутто</Text>
            <Text style={[s.cell, s.th, s.r, { width: W.qty }]}>Кол-во (нетто)</Text>
            <Text style={[s.cell, s.th, s.r, { width: W.price }]}>Цена, руб.</Text>
            <Text style={[s.cell, s.th, s.r, { width: W.base }]}>Сумма без НДС</Text>
            <Text style={[s.cell, s.th, s.c, { width: W.rate }]}>Ставка НДС</Text>
            <Text style={[s.cell, s.th, s.r, { width: W.vat }]}>Сумма НДС</Text>
            <Text style={[s.cell, s.th, s.r, { width: W.total, borderRightWidth: 0 }]}>Сумма с НДС</Text>
          </View>
          <View style={s.numRow}>
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"].map((g, i) => {
              const widths = [W.no, W.name, W.code, W.unit, W.unitCode, W.pkg, W.perPlace, W.places, W.gross, W.qty, W.price, W.base, W.rate, W.vat, W.total];
              return <Text key={g} style={[s.cell, s.gnum, { width: widths[i], borderRightWidth: i === 14 ? 0 : 1 }]}>{g}</Text>;
            })}
          </View>
          {data.items.map((it, i) => (
            <View style={s.row} key={i} wrap={false}>
              <Text style={[s.cell, s.c, { width: W.no }]}>{i + 1}</Text>
              <Text style={[s.cell, { width: W.name }]}>{it.name || "—"}</Text>
              <Text style={[s.cell, s.c, { width: W.code }]}>{it.code || "—"}</Text>
              <Text style={[s.cell, s.c, { width: W.unit }]}>{it.unit || "—"}</Text>
              <Text style={[s.cell, s.c, { width: W.unitCode }]}>{it.unitCode || "—"}</Text>
              <Text style={[s.cell, s.c, { width: W.pkg }]}>{it.pkgType || "—"}</Text>
              <Text style={[s.cell, s.r, { width: W.perPlace }]}>{it.perPlace || "—"}</Text>
              <Text style={[s.cell, s.r, { width: W.places }]}>{it.places || "—"}</Text>
              <Text style={[s.cell, s.r, { width: W.gross }]}>{it.grossMass || "—"}</Text>
              <Text style={[s.cell, s.r, { width: W.qty }]}>{it.qty || 0}</Text>
              <Text style={[s.cell, s.r, { width: W.price }]}>{money(Number(it.price) || 0)}</Text>
              <Text style={[s.cell, s.r, { width: W.base }]}>{money(lineBase(it))}</Text>
              <Text style={[s.cell, s.c, { width: W.rate }]}>{vatLabel(it.vatRate)}</Text>
              <Text style={[s.cell, s.r, { width: W.vat }]}>{money(lineVat(it))}</Text>
              <Text style={[s.cell, s.r, { width: W.total, borderRightWidth: 0 }]}>{money(lineTotal(it))}</Text>
            </View>
          ))}
          <View style={s.totalRow}>
            <Text style={[s.cell, s.th, { width: `${3 + 16 + 5 + 5 + 4 + 5 + 5 + 5 + 6 + 6 + 8}%` }]}>Всего по накладной</Text>
            <Text style={[s.cell, s.th, s.r, { width: W.base }]}>{money(totals.base)}</Text>
            <Text style={[s.cell, { width: W.rate }]}> </Text>
            <Text style={[s.cell, s.th, s.r, { width: W.vat }]}>{money(totals.vat)}</Text>
            <Text style={[s.cell, s.th, s.r, { width: W.total, borderRightWidth: 0 }]}>{money(totals.total)}</Text>
          </View>
        </View>

        <View style={s.summary}>
          <View style={s.line}>
            <Text style={s.lbl}>Товарная накладная имеет приложение на листах</Text>
            <Text style={s.val}>{data.appendixSheets || "—"}</Text>
            <Text style={[s.lbl, { marginLeft: 16 }]}>Всего мест</Text>
            <Text style={s.val}>{data.totalPlaces || "—"}</Text>
          </View>
          <View style={s.line}>
            <Text style={s.lbl}>Масса груза (нетто)</Text>
            <Text style={s.val}>{data.totalNetMass || "—"}</Text>
            <Text style={[s.lbl, { marginLeft: 16 }]}>Масса груза (брутто)</Text>
            <Text style={s.val}>{data.totalGrossMass || "—"}</Text>
          </View>
          <View style={s.line}>
            <Text style={s.lbl}>Всего отпущено на сумму, руб.</Text>
            <Text style={s.val}>{money(totals.total)}</Text>
          </View>
        </View>

        <View style={s.sign}>
          <View style={s.signCol}>
            <SignRow label="Отпуск груза разрешил (должность)" value={data.releaseAllowedPos} />
            <SignRow label="Ф. И. О." value={data.releaseAllowedName} />
            <SignRow label="Главный бухгалтер (Ф. И. О.)" value={data.accountantName} />
            <SignRow label="Отпуск груза произвёл (должность)" value={data.releasedByPos} />
            <SignRow label="Ф. И. О." value={data.releasedByName} />
          </View>
          <View style={s.signCol}>
            <SignRow label="Груз получил / принял (должность)" value={data.receivedByPos} />
            <SignRow label="Ф. И. О." value={data.receivedByName} />
            <SignRow label="По доверенности № , выданной" value={data.proxyInfo} />
            <Text style={{ color: MUTED, fontSize: 6.5, marginTop: 6 }}>М. П.</Text>
          </View>
        </View>

        <Text style={s.note}>
          Форма ТОРГ-12 (унифицированная форма № ТОРГ-12, Постановление Госкомстата России № 132).
          Применяется для оформления продажи (отпуска) товарно-материальных ценностей.
          Перед применением сверьте реквизиты с действующей редакцией формы.
        </Text>

        <Text style={s.footer} fixed>{brand}</Text>
      </Page>
    </Document>
  );
}
