import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { DOC_FONT } from "./fonts";
import {
  computeTotals,
  formatMoney,
  lineAmount,
  type InvoiceData,
} from "@/lib/tools/invoice/model";
import { getTemplate } from "@/lib/tools/invoice/templates";

export interface InvoiceLabels {
  docTitle: string;
  number: string;
  date: string;
  dueDate: string;
  from: string;
  billedTo: string;
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
    marginBottom: 28,
  },
  docTitle: { fontSize: 26, fontWeight: "bold", color: ACCENT, letterSpacing: 1 },
  logo: { maxWidth: 160, maxHeight: 64, marginBottom: 10, objectFit: "contain" },
  band: {
    marginTop: -48,
    marginHorizontal: -48,
    paddingHorizontal: 48,
    paddingTop: 40,
    paddingBottom: 24,
    marginBottom: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  bandTitle: { fontSize: 26, fontWeight: "bold", color: "#ffffff", letterSpacing: 1 },
  metaLabelLight: { color: "rgba(255,255,255,0.75)", fontSize: 9 },
  metaValueLight: { color: "#ffffff", fontWeight: "bold", marginBottom: 6, textAlign: "right" },
  minimalRule: { height: 2, marginBottom: 28 },
  metaLabel: { color: MUTED, fontSize: 9 },
  metaValue: { fontWeight: "bold", marginBottom: 6, textAlign: "right" },
  parties: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  partyBlock: { width: "48%" },
  partyLabel: {
    color: MUTED,
    fontSize: 9,
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
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
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: LINE,
    paddingVertical: 7,
    paddingHorizontal: 6,
  },
  th: { color: MUTED, fontSize: 9, fontWeight: "bold", textTransform: "uppercase" },
  cDesc: { width: "46%" },
  cQty: { width: "14%", textAlign: "right" },
  cPrice: { width: "20%", textAlign: "right" },
  cAmount: { width: "20%", textAlign: "right" },
  totals: { marginTop: 16, marginLeft: "auto", width: "45%" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  grandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginTop: 4,
    borderTopWidth: 2,
    borderColor: INK,
  },
  grandLabel: { fontWeight: "bold", fontSize: 12 },
  grandValue: { fontWeight: "bold", fontSize: 12, color: ACCENT },
  notes: { marginTop: 30, paddingTop: 12, borderTopWidth: 1, borderColor: LINE },
  notesLabel: { color: MUTED, fontSize: 9, textTransform: "uppercase", marginBottom: 4 },
  notesText: { color: INK, lineHeight: 1.5 },
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

export interface InvoiceDocProps {
  data: InvoiceData;
  labels: InvoiceLabels;
  brand: string;
  watermark?: boolean;
}

export function InvoiceDocument({ data, labels, brand, watermark }: InvoiceDocProps) {
  const totals = computeTotals(data);
  const cur = data.currency;
  const tpl = getTemplate(data.template);
  const accent = tpl.accent;

  const logo = data.logo ? (
    /* eslint-disable-next-line jsx-a11y/alt-text */
    <Image style={s.logo} src={data.logo} />
  ) : null;

  const meta = (light: boolean) => (
    <View>
      <Text style={light ? s.metaLabelLight : s.metaLabel}>{labels.number}</Text>
      <Text style={light ? s.metaValueLight : s.metaValue}>{data.number || "—"}</Text>
      <Text style={light ? s.metaLabelLight : s.metaLabel}>{labels.date}</Text>
      <Text style={light ? s.metaValueLight : s.metaValue}>{data.date || "—"}</Text>
      <Text style={light ? s.metaLabelLight : s.metaLabel}>{labels.dueDate}</Text>
      <Text style={light ? s.metaValueLight : s.metaValue}>{data.dueDate || "—"}</Text>
    </View>
  );

  return (
    <Document title={`${labels.docTitle} ${data.number}`}>
      <Page size="A4" style={s.page}>
        {watermark ? <Text style={s.watermark} fixed>PREVIEW</Text> : null}

        {tpl.header === "band" ? (
          <View style={[s.band, { backgroundColor: accent }]}>
            <View>
              {logo}
              <Text style={s.bandTitle}>{labels.docTitle}</Text>
            </View>
            {meta(true)}
          </View>
        ) : (
          <>
            <View style={s.headerRow}>
              <View>
                {logo}
                <Text
                  style={[
                    s.docTitle,
                    { color: tpl.header === "minimal" ? INK : accent },
                  ]}
                >
                  {labels.docTitle}
                </Text>
              </View>
              {meta(false)}
            </View>
            {tpl.header === "minimal" ? (
              <View style={[s.minimalRule, { backgroundColor: accent }]} />
            ) : null}
          </>
        )}

        <View style={s.parties}>
          <View style={s.partyBlock}>
            <Text style={s.partyLabel}>{labels.from}</Text>
            <Text style={s.partyName}>{data.fromName || "—"}</Text>
            <Text style={s.partyDetails}>{data.fromDetails}</Text>
          </View>
          <View style={s.partyBlock}>
            <Text style={s.partyLabel}>{labels.billedTo}</Text>
            <Text style={s.partyName}>{data.toName || "—"}</Text>
            <Text style={s.partyDetails}>{data.toDetails}</Text>
          </View>
        </View>

        <View style={s.tableHead}>
          <Text style={[s.th, s.cDesc]}>{labels.itemDesc}</Text>
          <Text style={[s.th, s.cQty]}>{labels.qty}</Text>
          <Text style={[s.th, s.cPrice]}>{labels.price}</Text>
          <Text style={[s.th, s.cAmount]}>{labels.amount}</Text>
        </View>
        {data.items.map((item, i) => (
          <View style={s.tableRow} key={i} wrap={false}>
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
            <Text style={[s.grandValue, { color: accent }]}>
              {formatMoney(totals.total, cur)}
            </Text>
          </View>
        </View>

        {data.notes ? (
          <View style={s.notes}>
            <Text style={s.notesLabel}>{labels.notes}</Text>
            <Text style={s.notesText}>{data.notes}</Text>
          </View>
        ) : null}

        <Text style={s.footer} fixed>
          {brand}
        </Text>
      </Page>
    </Document>
  );
}
