import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { DOC_FONT } from "./fonts";
import { computeAktTotals, type AktSverkiData } from "@/lib/tools/akt-sverki/model";

const INK = "#111827";
const MUTED = "#6b7280";
const LINE = "#9ca3af";
const LINE_SOFT = "#d1d5db";

const money = (n: number) =>
  n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const W = { date: "12%", doc: "36%", d1: "13%", c1: "13%", d2: "13%", c2: "13%" } as const;

const s = StyleSheet.create({
  page: { fontFamily: DOC_FONT, fontSize: 8, color: INK, paddingTop: 30, paddingBottom: 36, paddingHorizontal: 32 },
  title: { fontSize: 13, fontWeight: "bold", textAlign: "center", marginTop: 4 },
  sub: { textAlign: "center", color: MUTED, marginTop: 3, marginBottom: 10 },
  line: { flexDirection: "row", marginBottom: 2.5 },
  lbl: { color: MUTED, width: 110 },
  val: { flex: 1, fontWeight: "bold" },
  intro: { marginTop: 8, marginBottom: 6, lineHeight: 1.4 },
  table: { borderWidth: 1, borderColor: LINE },
  headRow: { flexDirection: "row", backgroundColor: "#f3f4f6", borderBottomWidth: 1, borderColor: LINE },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: LINE_SOFT },
  sumRow: { flexDirection: "row", backgroundColor: "#f9fafb", borderBottomWidth: 1, borderColor: LINE_SOFT },
  cell: { paddingVertical: 3, paddingHorizontal: 3, borderRightWidth: 1, borderColor: LINE_SOFT },
  th: { fontWeight: "bold", fontSize: 7, textAlign: "center" },
  sub2: { color: MUTED, fontSize: 5.8, textAlign: "center" },
  r: { textAlign: "right" },
  c: { textAlign: "center" },
  strong: { fontWeight: "bold" },
  summary: { marginTop: 10, lineHeight: 1.4 },
  sign: { marginTop: 18, flexDirection: "row", justifyContent: "space-between" },
  signCol: { width: "47%" },
  signHead: { fontWeight: "bold", marginBottom: 6 },
  signRow: { marginBottom: 8 },
  signLbl: { color: MUTED, fontSize: 7 },
  signVal: { borderBottomWidth: 1, borderColor: INK, fontWeight: "bold", minHeight: 11, fontSize: 8 },
  mp: { color: MUTED, fontSize: 7, marginTop: 8 },
  note: { marginTop: 16, color: MUTED, fontSize: 6.8, lineHeight: 1.4 },
  footer: { position: "absolute", bottom: 16, left: 32, right: 32, textAlign: "center", color: MUTED, fontSize: 6.8, borderTopWidth: 1, borderColor: LINE_SOFT, paddingTop: 6 },
});

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

/** One ledger line: org1 debit/credit filled, org2 side left blank for them. */
function LedgerRow({
  date, doc, debit, credit, strong, bg,
}: { date: string; doc: string; debit?: number; credit?: number; strong?: boolean; bg?: boolean }) {
  const tx = strong ? [s.strong] : [];
  return (
    <View style={bg ? s.sumRow : s.row} wrap={false}>
      <Text style={[s.cell, { width: W.date }, ...tx]}>{date}</Text>
      <Text style={[s.cell, { width: W.doc }, ...tx]}>{doc}</Text>
      <Text style={[s.cell, s.r, { width: W.d1 }, ...tx]}>{debit != null && debit !== 0 ? money(debit) : ""}</Text>
      <Text style={[s.cell, s.r, { width: W.c1 }, ...tx]}>{credit != null && credit !== 0 ? money(credit) : ""}</Text>
      <Text style={[s.cell, s.r, { width: W.d2 }]}>{""}</Text>
      <Text style={[s.cell, s.r, { width: W.c2, borderRightWidth: 0 }]}>{""}</Text>
    </View>
  );
}

export function AktSverkiDocument({ data, brand }: { data: AktSverkiData; brand: string }) {
  const t = computeAktTotals(data);
  const org1 = data.org1Name || "Организация";
  const org2 = data.org2Name || "Контрагент";

  const openingDebit = t.opening > 0 ? Math.abs(t.opening) : undefined;
  const openingCredit = t.opening < 0 ? Math.abs(t.opening) : undefined;
  const closingDebit = t.closing > 0 ? Math.abs(t.closing) : undefined;
  const closingCredit = t.closing < 0 ? Math.abs(t.closing) : undefined;

  const period = [data.periodFrom, data.periodTo].filter(Boolean).join(" — ");
  const beneficiary = t.closing > 0 ? org1 : org2;
  const summary =
    t.closing === 0
      ? `По данным ${org1} на конец периода задолженность отсутствует.`
      : `По данным ${org1} на конец периода задолженность в пользу ${beneficiary} составляет ${money(Math.abs(t.closing))} руб.`;

  return (
    <Document title={`Акт сверки № ${data.number || ""}`.trim()}>
      <Page size="A4" style={s.page}>
        <Text style={s.title}>
          Акт сверки взаимных расчётов{data.number ? ` № ${data.number}` : ""}
          {data.date ? ` от ${data.date}` : ""}
        </Text>
        {period || data.contract ? (
          <Text style={s.sub}>
            {period ? `за период ${period}` : ""}
            {period && data.contract ? " · " : ""}
            {data.contract ? `по договору ${data.contract}` : ""}
          </Text>
        ) : (
          <View style={{ marginBottom: 6 }} />
        )}

        <Field label="Организация" value={[data.org1Name, data.org1Details].filter(Boolean).join(", ")} />
        <Field label="Контрагент" value={[data.org2Name, data.org2Details].filter(Boolean).join(", ")} />

        <Text style={s.intro}>
          Мы, нижеподписавшиеся, {org1} и {org2}, составили настоящий акт о том, что состояние
          взаимных расчётов по данным учёта следующее:
        </Text>

        <View style={s.table}>
          <View style={s.headRow}>
            <Text style={[s.cell, s.th, { width: W.date }]}>Дата</Text>
            <Text style={[s.cell, s.th, { width: W.doc }]}>Документ, операция</Text>
            <View style={[s.cell, { width: W.d1 }]}>
              <Text style={s.th}>Дебет</Text>
              <Text style={s.sub2} wrap={false}>по данным {org1}</Text>
            </View>
            <Text style={[s.cell, s.th, { width: W.c1 }]}>Кредит</Text>
            <View style={[s.cell, { width: W.d2 }]}>
              <Text style={s.th}>Дебет</Text>
              <Text style={s.sub2} wrap={false}>по данным {org2}</Text>
            </View>
            <Text style={[s.cell, s.th, { width: W.c2, borderRightWidth: 0 }]}>Кредит</Text>
          </View>

          <LedgerRow date="" doc="Сальдо на начало периода" debit={openingDebit} credit={openingCredit} strong bg />
          {data.rows
            .filter((r) => r.date || r.doc || r.debit || r.credit)
            .map((r, i) => (
              <LedgerRow key={i} date={r.date} doc={r.doc} debit={Number(r.debit) || 0} credit={Number(r.credit) || 0} />
            ))}
          <LedgerRow date="" doc="Обороты за период" debit={t.debit} credit={t.credit} strong bg />
          <LedgerRow date="" doc="Сальдо на конец периода" debit={closingDebit} credit={closingCredit} strong bg />
        </View>

        <Text style={s.summary}>{summary}</Text>

        <View style={s.sign}>
          <View style={s.signCol}>
            <Text style={s.signHead}>От {org1}</Text>
            <SignRow label="Должность" value={data.org1SignPos} />
            <SignRow label="Подпись / Ф. И. О." value={data.org1SignName} />
            <Text style={s.mp}>М. П.</Text>
          </View>
          <View style={s.signCol}>
            <Text style={s.signHead}>От {org2}</Text>
            <SignRow label="Должность" value={data.org2SignPos} />
            <SignRow label="Подпись / Ф. И. О." value={data.org2SignName} />
            <Text style={s.mp}>М. П.</Text>
          </View>
        </View>

        <Text style={s.note}>
          Акт сверки взаимных расчётов составляется в произвольной форме и не является унифицированным
          документом. Правая сторона таблицы («по данным {org2}») заполняется контрагентом. Проверьте
          реквизиты и суммы перед подписанием.
        </Text>

        <Text style={s.footer} fixed>{brand}</Text>
      </Page>
    </Document>
  );
}
