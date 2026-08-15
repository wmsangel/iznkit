import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { DOC_FONT } from "./fonts";
import { formatMoney } from "@/lib/format";
import { lineAmount, receiptTotal, type ReceiptData } from "@/lib/tools/receipt/model";
import { getThemeAccent } from "@/lib/design/themes";

export interface ReceiptLabels {
  docTitle: string;
  paid: string;
  from: string;
  to: string;
  number: string;
  date: string;
  method: string;
  methodValue: string;
  itemDesc: string;
  qty: string;
  price: string;
  amount: string;
  subtotal: string;
  tax: string;
  total: string;
  notes: string;
}

const ACCENT = "#4f46e5";
const GOOD = "#059669";
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 22,
  },
  docTitle: { fontSize: 26, fontWeight: "bold", color: ACCENT, letterSpacing: 1 },
  logo: { maxWidth: 160, maxHeight: 60, marginBottom: 10, objectFit: "contain" },
  paidBadge: {
    marginTop: 6,
    alignSelf: "flex-start",
    color: "#fff",
    backgroundColor: GOOD,
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  metaLabel: { color: MUTED, fontSize: 9 },
  metaValue: { fontWeight: "bold", marginBottom: 6, textAlign: "right" },
  parties: { flexDirection: "row", justifyContent: "space-between", marginBottom: 22 },
  partyBlock: { width: "48%" },
  partyLabel: { color: MUTED, fontSize: 9, textTransform: "uppercase", marginBottom: 4, letterSpacing: 0.5 },
  partyName: { fontWeight: "bold", fontSize: 12, marginBottom: 3 },
  partyDetails: { color: MUTED, lineHeight: 1.4 },
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: LINE,
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  th: { color: MUTED, fontSize: 9, fontWeight: "bold", textTransform: "uppercase" },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: LINE, paddingVertical: 7, paddingHorizontal: 6 },
  cDesc: { width: "46%" },
  cQty: { width: "14%", textAlign: "right" },
  cPrice: { width: "20%", textAlign: "right" },
  cAmount: { width: "20%", textAlign: "right" },
  totals: { marginTop: 16, marginLeft: "auto", width: "45%" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 },
  grandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginTop: 4,
    borderTopWidth: 2,
    borderColor: INK,
  },
  grandLabel: { fontWeight: "bold", fontSize: 12 },
  grandValue: { fontWeight: "bold", fontSize: 12, color: GOOD },
  notes: { marginTop: 28, paddingTop: 12, borderTopWidth: 1, borderColor: LINE },
  notesLabel: { color: MUTED, fontSize: 9, textTransform: "uppercase", marginBottom: 4 },
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
    fontSize: 96,
    fontWeight: "bold",
    transform: "rotate(-24deg)",
  },
});

export interface ReceiptDocProps {
  data: ReceiptData;
  labels: ReceiptLabels;
  brand: string;
  watermark?: boolean;
}

export function ReceiptDocument({ data, labels, brand, watermark }: ReceiptDocProps) {
  const totals = receiptTotal(data);
  const cur = data.currency;
  const accent = getThemeAccent(data.theme);
  return (
    <Document title={`${labels.docTitle} ${data.number}`}>
      <Page size="A4" style={s.page}>
        {watermark ? <Text style={s.watermark} fixed>PREVIEW</Text> : null}

        <View style={s.headerRow}>
          <View>
            {data.logo ? (
              /* eslint-disable-next-line jsx-a11y/alt-text */
              <Image style={s.logo} src={data.logo} />
            ) : null}
            <Text style={[s.docTitle, { color: accent }]}>{labels.docTitle}</Text>
            <Text style={s.paidBadge}>{labels.paid}</Text>
          </View>
          <View>
            <Text style={s.metaLabel}>{labels.number}</Text>
            <Text style={s.metaValue}>{data.number || "—"}</Text>
            <Text style={s.metaLabel}>{labels.date}</Text>
            <Text style={s.metaValue}>{data.date || "—"}</Text>
            <Text style={s.metaLabel}>{labels.method}</Text>
            <Text style={s.metaValue}>{labels.methodValue}</Text>
          </View>
        </View>

        <View style={s.parties}>
          <View style={s.partyBlock}>
            <Text style={s.partyLabel}>{labels.from}</Text>
            <Text style={s.partyName}>{data.fromName || "—"}</Text>
            <Text style={s.partyDetails}>{data.fromDetails}</Text>
          </View>
          <View style={s.partyBlock}>
            <Text style={s.partyLabel}>{labels.to}</Text>
            <Text style={s.partyName}>{data.toName || "—"}</Text>
          </View>
        </View>

        <View style={s.tableHead}>
          <Text style={[s.th, s.cDesc]}>{labels.itemDesc}</Text>
          <Text style={[s.th, s.cQty]}>{labels.qty}</Text>
          <Text style={[s.th, s.cPrice]}>{labels.price}</Text>
          <Text style={[s.th, s.cAmount]}>{labels.amount}</Text>
        </View>
        {data.items.map((item, i) => (
          <View style={s.row} key={i} wrap={false}>
            <Text style={s.cDesc}>{item.description || "—"}</Text>
            <Text style={s.cQty}>{item.qty}</Text>
            <Text style={s.cPrice}>{formatMoney(item.price, cur)}</Text>
            <Text style={s.cAmount}>{formatMoney(lineAmount(item), cur)}</Text>
          </View>
        ))}

        <View style={s.totals}>
          <View style={s.totalRow}>
            <Text style={{ color: MUTED }}>{labels.subtotal}</Text>
            <Text>{formatMoney(totals.subtotal, cur)}</Text>
          </View>
          {data.taxRate ? (
            <View style={s.totalRow}>
              <Text style={{ color: MUTED }}>
                {labels.tax} ({data.taxRate}%)
              </Text>
              <Text>{formatMoney(totals.tax, cur)}</Text>
            </View>
          ) : null}
          <View style={s.grandRow}>
            <Text style={s.grandLabel}>{labels.total}</Text>
            <Text style={s.grandValue}>{formatMoney(totals.total, cur)}</Text>
          </View>
        </View>

        {data.notes ? (
          <View style={s.notes}>
            <Text style={s.notesLabel}>{labels.notes}</Text>
            <Text>{data.notes}</Text>
          </View>
        ) : null}

        <Text style={s.footer} fixed>{brand}</Text>
      </Page>
    </Document>
  );
}
