import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { DOC_FONT } from "./fonts";
import { formatMoney, formatPercent } from "@/lib/format";
import { computeAdRoi, type AdRoiData } from "@/lib/tools/adroi/model";

export interface AdRoiLabels {
  docTitle: string;
  inputsHeading: string;
  resultsHeading: string;
  adSpend: string;
  revenue: string;
  grossMargin: string;
  otherCosts: string;
  roas: string;
  roi: string;
  netProfit: string;
  grossProfit: string;
  breakEvenRoas: string;
  disclaimer: string;
}

const ACCENT = "#4f46e5";
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
  watermark: { position: "absolute", top: "42%", left: 0, right: 0, textAlign: "center", color: "#eef2ff", fontSize: 90, fontWeight: "bold", transform: "rotate(-24deg)" },
});

export interface AdRoiDocProps {
  data: AdRoiData;
  labels: AdRoiLabels;
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

export function AdRoiDocument({ data, labels, brand, watermark }: AdRoiDocProps) {
  const r = computeAdRoi(data);
  const c = data.currency;
  const m = (v: number) => formatMoney(v, c);
  return (
    <Document title={labels.docTitle}>
      <Page size="A4" style={s.page}>
        {watermark ? <Text style={s.watermark} fixed>PREVIEW</Text> : null}
        <Text style={s.title}>{labels.docTitle}</Text>
        <View style={s.cards}>
          <View style={s.card}>
            <Text style={s.cardLabel}>{labels.roas}</Text>
            <Text style={s.cardValue}>{r.roas}×</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardLabel}>{labels.roi}</Text>
            <Text style={s.cardValue}>{formatPercent(r.roi)}</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardLabel}>{labels.netProfit}</Text>
            <Text style={s.cardValue}>{m(r.netProfit)}</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardLabel}>{labels.breakEvenRoas}</Text>
            <Text style={s.cardValue}>{r.breakEvenRoas}×</Text>
          </View>
        </View>
        <View style={s.grid2}>
          <View style={s.col}>
            <Text style={s.heading}>{labels.inputsHeading}</Text>
            <Row label={labels.adSpend} value={m(data.adSpend)} />
            <Row label={labels.revenue} value={m(data.revenue)} />
            <Row label={labels.grossMargin} value={`${data.grossMargin}%`} />
            <Row label={labels.otherCosts} value={m(data.otherCosts)} />
          </View>
          <View style={s.col}>
            <Text style={s.heading}>{labels.resultsHeading}</Text>
            <Row label={labels.grossProfit} value={m(r.grossProfit)} />
            <Row label={labels.netProfit} value={m(r.netProfit)} />
            <Row label={labels.roas} value={`${r.roas}×`} />
          </View>
        </View>
        <Text style={s.disclaimer}>{labels.disclaimer}</Text>
        <Text style={s.footer} fixed>{brand}</Text>
      </Page>
    </Document>
  );
}
