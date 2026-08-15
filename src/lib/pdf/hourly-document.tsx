import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { DOC_FONT } from "./fonts";
import { formatMoney } from "@/lib/format";
import { computeHourly, type HourlyData } from "@/lib/tools/hourly/model";

export interface HourlyLabels {
  docTitle: string;
  inputsHeading: string;
  resultsHeading: string;
  desiredIncome: string;
  expenses: string;
  taxRate: string;
  billableHoursPerWeek: string;
  workWeeksPerYear: string;
  profitMargin: string;
  hourlyRate: string;
  dayRate: string;
  billableHoursPerYear: string;
  revenueNeeded: string;
  monthlyRevenue: string;
  perHour: string;
  disclaimer: string;
}

const ACCENT = "#4f46e5";
const INK = "#111827";
const MUTED = "#6b7280";
const LINE = "#e5e7eb";

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
  title: { fontSize: 22, fontWeight: "bold", color: ACCENT, marginBottom: 20 },
  hero: {
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#f9fafb",
    marginBottom: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  heroLabel: { color: MUTED, fontSize: 9, textTransform: "uppercase", marginBottom: 6 },
  heroValue: { fontSize: 30, fontWeight: "bold", color: ACCENT },
  heroSub: { color: MUTED, fontSize: 10 },
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

export interface HourlyDocProps {
  data: HourlyData;
  labels: HourlyLabels;
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

export function HourlyDocument({ data, labels, brand, watermark }: HourlyDocProps) {
  const r = computeHourly(data);
  const c = data.currency;
  const m = (v: number) => formatMoney(v, c);
  return (
    <Document title={labels.docTitle}>
      <Page size="A4" style={s.page}>
        {watermark ? <Text style={s.watermark} fixed>PREVIEW</Text> : null}
        <Text style={s.title}>{labels.docTitle}</Text>

        <View style={s.hero}>
          <View>
            <Text style={s.heroLabel}>{labels.hourlyRate}</Text>
            <Text style={s.heroValue}>
              {m(r.hourlyRate)} <Text style={s.heroSub}>{labels.perHour}</Text>
            </Text>
          </View>
          <Text style={s.heroSub}>
            {labels.dayRate}: {m(r.dayRate)}
          </Text>
        </View>

        <View style={s.grid2}>
          <View style={s.col}>
            <Text style={s.heading}>{labels.inputsHeading}</Text>
            <Row label={labels.desiredIncome} value={m(data.desiredIncome)} />
            <Row label={labels.expenses} value={m(data.expenses)} />
            <Row label={labels.taxRate} value={`${data.taxRate}%`} />
            <Row label={labels.billableHoursPerWeek} value={String(data.billableHoursPerWeek)} />
            <Row label={labels.workWeeksPerYear} value={String(data.workWeeksPerYear)} />
            <Row label={labels.profitMargin} value={`${data.profitMargin}%`} />
          </View>
          <View style={s.col}>
            <Text style={s.heading}>{labels.resultsHeading}</Text>
            <Row label={labels.billableHoursPerYear} value={String(r.billableHoursPerYear)} />
            <Row label={labels.revenueNeeded} value={m(r.revenueNeeded)} />
            <Row label={labels.monthlyRevenue} value={m(r.monthlyRevenue)} />
            <Row label={labels.dayRate} value={m(r.dayRate)} />
          </View>
        </View>

        <Text style={s.disclaimer}>{labels.disclaimer}</Text>
        <Text style={s.footer} fixed>{brand}</Text>
      </Page>
    </Document>
  );
}
