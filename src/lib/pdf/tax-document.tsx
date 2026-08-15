import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { DOC_FONT } from "./fonts";
import { formatMoney, formatPercent } from "@/lib/format";
import { computeTax, type TaxData } from "@/lib/tools/tax/model";

export interface TaxLabels {
  docTitle: string;
  inputsHeading: string;
  resultsHeading: string;
  income: string;
  expenses: string;
  taxRate: string;
  base: string;
  taxLabel: string;
  afterTax: string;
  takeHome: string;
  effectiveRate: string;
  perMonth: string;
  perYear: string;
  disclaimer: string;
}

const ACCENT = "#4f46e5";
const INK = "#111827";
const MUTED = "#6b7280";
const LINE = "#e5e7eb";
const SOFT = "#f9fafb";

const s = StyleSheet.create({
  page: {
    fontFamily: DOC_FONT,
    fontSize: 10,
    color: INK,
    paddingTop: 48,
    paddingBottom: 56,
    paddingHorizontal: 48,
    position: "relative",
  },
  title: { fontSize: 22, fontWeight: "bold", color: ACCENT, marginBottom: 4 },
  period: { color: MUTED, marginBottom: 18 },
  cards: { flexDirection: "row", gap: 10, marginBottom: 22 },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 6,
    padding: 10,
    backgroundColor: SOFT,
  },
  cardLabel: { color: MUTED, fontSize: 8, textTransform: "uppercase", marginBottom: 4 },
  cardValue: { fontSize: 15, fontWeight: "bold", color: ACCENT },
  heading: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: MUTED,
    marginTop: 8,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: LINE,
  },
  rowLabel: { color: MUTED },
  rowValue: { fontWeight: "bold" },
  grid2: { flexDirection: "row", gap: 24 },
  col: { flex: 1 },
  disclaimer: { marginTop: 24, fontSize: 8, color: MUTED },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    textAlign: "center",
    color: MUTED,
    fontSize: 8,
    borderTopWidth: 1,
    borderColor: LINE,
    paddingTop: 8,
  },
  watermark: {
    position: "absolute",
    top: "42%",
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#eef2ff",
    fontSize: 90,
    fontWeight: "bold",
    transform: "rotate(-24deg)",
  },
});

export interface TaxDocProps {
  data: TaxData;
  labels: TaxLabels;
  brand: string;
  watermark?: boolean;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  );
}

export function TaxDocument({ data, labels, brand, watermark }: TaxDocProps) {
  const r = computeTax(data);
  const c = data.currency;
  const m = (v: number) => formatMoney(v, c);
  const periodLabel = data.period === "year" ? labels.perYear : labels.perMonth;
  return (
    <Document title={labels.docTitle}>
      <Page size="A4" style={s.page}>
        {watermark ? <Text style={s.watermark} fixed>PREVIEW</Text> : null}
        <Text style={s.title}>{labels.docTitle}</Text>
        <Text style={s.period}>{periodLabel}</Text>

        <View style={s.cards}>
          <View style={s.card}>
            <Text style={s.cardLabel}>{labels.taxLabel}</Text>
            <Text style={s.cardValue}>{m(r.tax)}</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardLabel}>{labels.takeHome}</Text>
            <Text style={s.cardValue}>{m(r.takeHome)}</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardLabel}>{labels.effectiveRate}</Text>
            <Text style={s.cardValue}>{formatPercent(r.effectiveRate)}</Text>
          </View>
        </View>

        <View style={s.grid2}>
          <View style={s.col}>
            <Text style={s.heading}>{labels.inputsHeading}</Text>
            <Row label={labels.income} value={m(data.income)} />
            <Row label={labels.expenses} value={m(data.expenses)} />
            <Row label={labels.taxRate} value={`${data.taxRate}%`} />
          </View>
          <View style={s.col}>
            <Text style={s.heading}>{labels.resultsHeading}</Text>
            <Row label={labels.base} value={m(r.base)} />
            <Row label={labels.taxLabel} value={m(r.tax)} />
            <Row label={labels.afterTax} value={m(r.afterTax)} />
            <Row label={labels.takeHome} value={m(r.takeHome)} />
          </View>
        </View>

        <Text style={s.disclaimer}>{labels.disclaimer}</Text>
        <Text style={s.footer} fixed>{brand}</Text>
      </Page>
    </Document>
  );
}
