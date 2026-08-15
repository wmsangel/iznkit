import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { DOC_FONT } from "./fonts";
import { formatMoney } from "@/lib/format";
import { timesheetTotals, type TimesheetData } from "@/lib/tools/timesheet/model";

export interface TimesheetLabels {
  docTitle: string;
  workerName: string;
  project: string;
  period: string;
  date: string;
  hours: string;
  note: string;
  totalHours: string;
  totalPay: string;
  hourlyRate: string;
  signature: string;
}

const ACCENT = "#4f46e5";
const INK = "#111827";
const MUTED = "#6b7280";
const LINE = "#e5e7eb";

const s = StyleSheet.create({
  page: { fontFamily: DOC_FONT, fontSize: 10, color: INK, paddingTop: 48, paddingBottom: 56, paddingHorizontal: 48, position: "relative" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 },
  headerLeft: { flex: 1, paddingRight: 16 },
  docTitle: { fontSize: 19, fontWeight: "bold", color: ACCENT, letterSpacing: 0.5 },
  logo: { maxWidth: 160, maxHeight: 60, marginBottom: 10, objectFit: "contain" },
  metaLine: { color: MUTED, marginBottom: 2 },
  metaStrong: { color: INK, fontWeight: "bold" },
  metaRight: { textAlign: "right" },
  metaBlock: { marginBottom: 6 },
  tableHead: { flexDirection: "row", backgroundColor: "#f9fafb", borderTopWidth: 1, borderBottomWidth: 1, borderColor: LINE, paddingVertical: 6, paddingHorizontal: 6, marginTop: 8 },
  th: { color: MUTED, fontSize: 9, fontWeight: "bold", textTransform: "uppercase" },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: LINE, paddingVertical: 7, paddingHorizontal: 6 },
  cDate: { width: "24%" },
  cHours: { width: "16%", textAlign: "right" },
  cNote: { width: "60%", paddingLeft: 12, color: "#374151" },
  totals: { marginTop: 16, marginLeft: "auto", width: "45%" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  grandRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, marginTop: 4, borderTopWidth: 2, borderColor: INK },
  grandLabel: { fontWeight: "bold", fontSize: 12 },
  grandValue: { fontWeight: "bold", fontSize: 12, color: ACCENT },
  sigWrap: { marginTop: 44, width: "55%" },
  sigLine: { borderTopWidth: 1, borderColor: INK, paddingTop: 4, fontSize: 9, color: MUTED },
  footer: { position: "absolute", bottom: 24, left: 48, right: 48, textAlign: "center", color: MUTED, fontSize: 8, borderTopWidth: 1, borderColor: LINE, paddingTop: 8 },
  watermark: { position: "absolute", top: "42%", left: 0, right: 0, textAlign: "center", color: "#eef2ff", fontSize: 90, fontWeight: "bold", transform: "rotate(-24deg)" },
});

export interface TimesheetDocProps {
  data: TimesheetData;
  labels: TimesheetLabels;
  brand: string;
  watermark?: boolean;
}

export function TimesheetDocument({ data, labels, brand, watermark }: TimesheetDocProps) {
  const totals = timesheetTotals(data);
  const cur = data.currency;
  const hasRate = (Number(data.hourlyRate) || 0) > 0;
  return (
    <Document title={labels.docTitle}>
      <Page size="A4" style={s.page}>
        {watermark ? <Text style={s.watermark} fixed>PREVIEW</Text> : null}
        <View style={s.headerRow}>
          <View style={s.headerLeft}>
            {data.logo ? (
              /* eslint-disable-next-line jsx-a11y/alt-text */
              <Image style={s.logo} src={data.logo} />
            ) : null}
            <Text style={s.docTitle}>{labels.docTitle}</Text>
          </View>
          <View>
            <Text style={s.metaLine}>{labels.period}</Text>
            <Text style={[s.metaStrong, s.metaRight]}>{data.period || "—"}</Text>
          </View>
        </View>

        <View style={s.metaBlock}>
          <Text style={s.metaLine}>
            {labels.workerName}: <Text style={s.metaStrong}>{data.workerName || "—"}</Text>
          </Text>
          <Text style={s.metaLine}>
            {labels.project}: <Text style={s.metaStrong}>{data.project || "—"}</Text>
          </Text>
        </View>

        <View style={s.tableHead}>
          <Text style={[s.th, s.cDate]}>{labels.date}</Text>
          <Text style={[s.th, s.cHours]}>{labels.hours}</Text>
          <Text style={[s.th, s.cNote]}>{labels.note}</Text>
        </View>
        {data.entries.map((e, i) => (
          <View style={s.row} key={i} wrap={false}>
            <Text style={s.cDate}>{e.date || "—"}</Text>
            <Text style={s.cHours}>{e.hours}</Text>
            <Text style={s.cNote}>{e.note}</Text>
          </View>
        ))}

        <View style={s.totals}>
          {hasRate ? (
            <View style={s.totalRow}>
              <Text style={{ color: MUTED }}>{labels.hourlyRate}</Text>
              <Text>{formatMoney(data.hourlyRate, cur)}</Text>
            </View>
          ) : null}
          <View style={s.totalRow}>
            <Text style={{ color: MUTED }}>{labels.totalHours}</Text>
            <Text style={{ fontWeight: "bold" }}>{totals.totalHours}</Text>
          </View>
          {hasRate ? (
            <View style={s.grandRow}>
              <Text style={s.grandLabel}>{labels.totalPay}</Text>
              <Text style={s.grandValue}>{formatMoney(totals.totalPay, cur)}</Text>
            </View>
          ) : (
            <View style={s.grandRow}>
              <Text style={s.grandLabel}>{labels.totalHours}</Text>
              <Text style={s.grandValue}>{totals.totalHours}</Text>
            </View>
          )}
        </View>

        <View style={s.sigWrap}>
          <Text style={s.metaLine}>{data.workerName || "—"}</Text>
          <Text style={s.sigLine}>{labels.signature}</Text>
        </View>

        <Text style={s.footer} fixed>{brand}</Text>
      </Page>
    </Document>
  );
}
