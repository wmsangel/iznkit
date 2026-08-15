import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { DOC_FONT } from "./fonts";
import { formatMoney, formatPercent } from "@/lib/format";
import { computeUnit, type UnitData } from "@/lib/tools/unit/model";

export interface UnitLabels {
  docTitle: string;
  inputsHeading: string;
  resultsHeading: string;
  sellPrice: string;
  cogs: string;
  commissionPct: string;
  logistics: string;
  packaging: string;
  otherFees: string;
  adPerUnit: string;
  taxPct: string;
  returnRate: string;
  profit: string;
  margin: string;
  roi: string;
  adjustedProfit: string;
  commission: string;
  tax: string;
  totalCosts: string;
  breakEvenPrice: string;
  disclaimer: string;
}

const ACCENT = "#4f46e5";
const GOOD = "#059669";
const BAD = "#e11d48";
const INK = "#111827";
const MUTED = "#6b7280";
const LINE = "#e5e7eb";
const SOFT = "#f9fafb";

const s = StyleSheet.create({
  page: { fontFamily: DOC_FONT, fontSize: 10, color: INK, paddingTop: 48, paddingBottom: 56, paddingHorizontal: 48, position: "relative" },
  title: { fontSize: 22, fontWeight: "bold", color: ACCENT, marginBottom: 20 },
  cards: { flexDirection: "row", gap: 10, marginBottom: 22 },
  card: { flex: 1, borderWidth: 1, borderColor: LINE, borderRadius: 6, padding: 10, backgroundColor: SOFT },
  cardLabel: { color: MUTED, fontSize: 8, textTransform: "uppercase", marginBottom: 4 },
  cardValue: { fontSize: 15, fontWeight: "bold", color: ACCENT },
  heading: { fontSize: 11, fontWeight: "bold", textTransform: "uppercase", color: MUTED, marginTop: 8, marginBottom: 8, letterSpacing: 0.5 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5, borderBottomWidth: 1, borderColor: LINE },
  rowLabel: { color: MUTED },
  rowValue: { fontWeight: "bold" },
  grid2: { flexDirection: "row", gap: 24 },
  col: { flex: 1 },
  disclaimer: { marginTop: 24, fontSize: 8, color: MUTED },
  footer: { position: "absolute", bottom: 24, left: 48, right: 48, textAlign: "center", color: MUTED, fontSize: 8, borderTopWidth: 1, borderColor: LINE, paddingTop: 8 },
  watermark: { position: "absolute", top: "42%", left: 0, right: 0, textAlign: "center", color: "#eef2ff", fontSize: 84, fontWeight: "bold", transform: "rotate(-24deg)" },
});

export interface UnitDocProps {
  data: UnitData;
  labels: UnitLabels;
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

export function UnitDocument({ data, labels, brand, watermark }: UnitDocProps) {
  const r = computeUnit(data);
  const c = data.currency;
  const m = (v: number) => formatMoney(v, c);
  const profitColor = r.profit >= 0 ? GOOD : BAD;
  return (
    <Document title={labels.docTitle}>
      <Page size="A4" style={s.page}>
        {watermark ? <Text style={s.watermark} fixed>PREVIEW</Text> : null}
        <Text style={s.title}>{labels.docTitle}</Text>
        <View style={s.cards}>
          <View style={s.card}>
            <Text style={s.cardLabel}>{labels.profit}</Text>
            <Text style={[s.cardValue, { color: profitColor }]}>{m(r.profit)}</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardLabel}>{labels.margin}</Text>
            <Text style={s.cardValue}>{formatPercent(r.margin)}</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardLabel}>{labels.roi}</Text>
            <Text style={s.cardValue}>{formatPercent(r.roi)}</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardLabel}>{labels.adjustedProfit}</Text>
            <Text style={s.cardValue}>{m(r.adjustedProfit)}</Text>
          </View>
        </View>
        <View style={s.grid2}>
          <View style={s.col}>
            <Text style={s.heading}>{labels.inputsHeading}</Text>
            <Row label={labels.sellPrice} value={m(data.sellPrice)} />
            <Row label={labels.cogs} value={m(data.cogs)} />
            <Row label={labels.commissionPct} value={`${data.commissionPct}%`} />
            <Row label={labels.logistics} value={m(data.logistics)} />
            <Row label={labels.packaging} value={m(data.packaging)} />
            <Row label={labels.otherFees} value={m(data.otherFees)} />
            <Row label={labels.adPerUnit} value={m(data.adPerUnit)} />
            <Row label={labels.taxPct} value={`${data.taxPct}%`} />
            <Row label={labels.returnRate} value={`${data.returnRate}%`} />
          </View>
          <View style={s.col}>
            <Text style={s.heading}>{labels.resultsHeading}</Text>
            <Row label={labels.commission} value={m(r.commission)} />
            <Row label={labels.tax} value={m(r.tax)} />
            <Row label={labels.totalCosts} value={m(r.totalCosts)} />
            <Row label={labels.profit} value={m(r.profit)} />
            <Row label={labels.breakEvenPrice} value={m(r.breakEvenPrice)} />
          </View>
        </View>
        <Text style={s.disclaimer}>{labels.disclaimer}</Text>
        <Text style={s.footer} fixed>{brand}</Text>
      </Page>
    </Document>
  );
}
