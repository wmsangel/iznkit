import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { DOC_FONT } from "./fonts";
import { formatMoney, formatPercent } from "@/lib/format";
import { computeRental, type RentalData } from "@/lib/tools/rental/model";

export interface RentalLabels {
  docTitle: string;
  inputsHeading: string;
  resultsHeading: string;
  price: string;
  purchaseCosts: string;
  monthlyRent: string;
  vacancyRate: string;
  monthlyExpenses: string;
  downPayment: string;
  interestRate: string;
  loanTermYears: string;
  grossYield: string;
  netYield: string;
  monthlyCashFlow: string;
  annualCashFlow: string;
  cashOnCash: string;
  payback: string;
  noi: string;
  cashInvested: string;
  monthlyMortgage: string;
  years: string;
  na: string;
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
  title: { fontSize: 22, fontWeight: "bold", color: ACCENT, marginBottom: 20 },
  cards: { flexDirection: "row", gap: 10, marginBottom: 24 },
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

export interface RentalDocProps {
  data: RentalData;
  labels: RentalLabels;
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

export function RentalDocument({ data, labels, brand, watermark }: RentalDocProps) {
  const r = computeRental(data);
  const c = data.currency;
  const m = (v: number) => formatMoney(v, c);

  return (
    <Document title={labels.docTitle}>
      <Page size="A4" style={s.page}>
        {watermark ? <Text style={s.watermark} fixed>PREVIEW</Text> : null}

        <Text style={s.title}>{labels.docTitle}</Text>

        <View style={s.cards}>
          <View style={s.card}>
            <Text style={s.cardLabel}>{labels.grossYield}</Text>
            <Text style={s.cardValue}>{formatPercent(r.grossYield)}</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardLabel}>{labels.netYield}</Text>
            <Text style={s.cardValue}>{formatPercent(r.netYield)}</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardLabel}>{labels.monthlyCashFlow}</Text>
            <Text style={s.cardValue}>{m(r.monthlyCashFlow)}</Text>
          </View>
          <View style={s.card}>
            <Text style={s.cardLabel}>{labels.cashOnCash}</Text>
            <Text style={s.cardValue}>{formatPercent(r.cashOnCash)}</Text>
          </View>
        </View>

        <View style={s.grid2}>
          <View style={s.col}>
            <Text style={s.heading}>{labels.inputsHeading}</Text>
            <Row label={labels.price} value={m(data.price)} />
            <Row label={labels.purchaseCosts} value={m(data.purchaseCosts)} />
            <Row label={labels.monthlyRent} value={m(data.monthlyRent)} />
            <Row label={labels.vacancyRate} value={`${data.vacancyRate}%`} />
            <Row label={labels.monthlyExpenses} value={m(data.monthlyExpenses)} />
            {data.useMortgage ? (
              <>
                <Row label={labels.downPayment} value={m(data.downPayment)} />
                <Row label={labels.interestRate} value={`${data.interestRate}%`} />
                <Row
                  label={labels.loanTermYears}
                  value={`${data.loanTermYears} ${labels.years}`}
                />
              </>
            ) : null}
          </View>
          <View style={s.col}>
            <Text style={s.heading}>{labels.resultsHeading}</Text>
            <Row label={labels.noi} value={m(r.noi)} />
            <Row label={labels.cashInvested} value={m(r.cashInvested)} />
            {data.useMortgage ? (
              <Row label={labels.monthlyMortgage} value={m(r.monthlyMortgage)} />
            ) : null}
            <Row label={labels.annualCashFlow} value={m(r.annualCashFlow)} />
            <Row label={labels.monthlyCashFlow} value={m(r.monthlyCashFlow)} />
            <Row
              label={labels.payback}
              value={
                r.paybackYears === null
                  ? labels.na
                  : `${r.paybackYears} ${labels.years}`
              }
            />
          </View>
        </View>

        <Text style={s.footer} fixed>
          {brand}
        </Text>
      </Page>
    </Document>
  );
}
