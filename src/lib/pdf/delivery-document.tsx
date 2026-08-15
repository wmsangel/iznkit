import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { DOC_FONT } from "./fonts";
import { formatMoney } from "@/lib/format";
import { lineAmount, deliveryTotals, type DeliveryData } from "@/lib/tools/delivery/model";
import { getThemeAccent } from "@/lib/design/themes";

export interface DeliveryLabels {
  docTitle: string;
  number: string;
  date: string;
  shipper: string;
  consignee: string;
  itemDesc: string;
  unit: string;
  qty: string;
  price: string;
  amount: string;
  total: string;
  notes: string;
  releasedBy: string;
  receivedBy: string;
  signature: string;
}

const ACCENT = "#4f46e5";
const INK = "#111827";
const MUTED = "#6b7280";
const LINE = "#e5e7eb";

const s = StyleSheet.create({
  page: { fontFamily: DOC_FONT, fontSize: 10, color: INK, paddingTop: 48, paddingBottom: 56, paddingHorizontal: 48, position: "relative" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 },
  headerLeft: { flex: 1, paddingRight: 16 },
  docTitle: { fontSize: 19, fontWeight: "bold", color: ACCENT, letterSpacing: 0.5 },
  logo: { maxWidth: 160, maxHeight: 60, marginBottom: 10, objectFit: "contain" },
  metaLabel: { color: MUTED, fontSize: 9 },
  metaValue: { fontWeight: "bold", marginBottom: 6, textAlign: "right" },
  parties: { flexDirection: "row", justifyContent: "space-between", marginBottom: 22 },
  partyBlock: { width: "48%" },
  partyLabel: { color: MUTED, fontSize: 9, textTransform: "uppercase", marginBottom: 4, letterSpacing: 0.5 },
  partyName: { fontWeight: "bold", fontSize: 12, marginBottom: 3 },
  partyDetails: { color: MUTED, lineHeight: 1.4 },
  tableHead: { flexDirection: "row", backgroundColor: "#f9fafb", borderTopWidth: 1, borderBottomWidth: 1, borderColor: LINE, paddingVertical: 6, paddingHorizontal: 6 },
  th: { color: MUTED, fontSize: 9, fontWeight: "bold", textTransform: "uppercase" },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: LINE, paddingVertical: 7, paddingHorizontal: 6 },
  cDesc: { width: "40%" },
  cUnit: { width: "12%", textAlign: "center" },
  cQty: { width: "13%", textAlign: "right" },
  cPrice: { width: "17%", textAlign: "right" },
  cAmount: { width: "18%", textAlign: "right" },
  totals: { marginTop: 14, marginLeft: "auto", width: "45%" },
  grandRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderTopWidth: 2, borderColor: INK },
  grandLabel: { fontWeight: "bold", fontSize: 12 },
  grandValue: { fontWeight: "bold", fontSize: 12, color: ACCENT },
  notes: { marginTop: 22, paddingTop: 10, borderTopWidth: 1, borderColor: LINE },
  notesLabel: { color: MUTED, fontSize: 9, textTransform: "uppercase", marginBottom: 4 },
  sigWrap: { flexDirection: "row", justifyContent: "space-between", marginTop: 42 },
  sigCol: { width: "45%" },
  sigLabel: { color: MUTED, fontSize: 9, textTransform: "uppercase", marginBottom: 22 },
  sigLine: { borderTopWidth: 1, borderColor: INK, paddingTop: 4, fontSize: 9, color: MUTED },
  footer: { position: "absolute", bottom: 24, left: 48, right: 48, textAlign: "center", color: MUTED, fontSize: 8, borderTopWidth: 1, borderColor: LINE, paddingTop: 8 },
  watermark: { position: "absolute", top: "42%", left: 0, right: 0, textAlign: "center", color: "#eef2ff", fontSize: 84, fontWeight: "bold", transform: "rotate(-24deg)" },
});

export interface DeliveryDocProps {
  data: DeliveryData;
  labels: DeliveryLabels;
  brand: string;
  watermark?: boolean;
}

export function DeliveryDocument({ data, labels, brand, watermark }: DeliveryDocProps) {
  const totals = deliveryTotals(data);
  const cur = data.currency;
  const accent = getThemeAccent(data.theme);
  return (
    <Document title={`${labels.docTitle} ${data.number}`}>
      <Page size="A4" style={s.page}>
        {watermark ? <Text style={s.watermark} fixed>PREVIEW</Text> : null}
        <View style={s.headerRow}>
          <View style={s.headerLeft}>
            {data.logo ? (
              /* eslint-disable-next-line jsx-a11y/alt-text */
              <Image style={s.logo} src={data.logo} />
            ) : null}
            <Text style={[s.docTitle, { color: accent }]}>{labels.docTitle}</Text>
          </View>
          <View>
            <Text style={s.metaLabel}>{labels.number}</Text>
            <Text style={s.metaValue}>{data.number || "—"}</Text>
            <Text style={s.metaLabel}>{labels.date}</Text>
            <Text style={s.metaValue}>{data.date || "—"}</Text>
          </View>
        </View>

        <View style={s.parties}>
          <View style={s.partyBlock}>
            <Text style={s.partyLabel}>{labels.shipper}</Text>
            <Text style={s.partyName}>{data.shipperName || "—"}</Text>
            <Text style={s.partyDetails}>{data.shipperDetails}</Text>
          </View>
          <View style={s.partyBlock}>
            <Text style={s.partyLabel}>{labels.consignee}</Text>
            <Text style={s.partyName}>{data.consigneeName || "—"}</Text>
            <Text style={s.partyDetails}>{data.consigneeDetails}</Text>
          </View>
        </View>

        <View style={s.tableHead}>
          <Text style={[s.th, s.cDesc]}>{labels.itemDesc}</Text>
          <Text style={[s.th, s.cUnit]}>{labels.unit}</Text>
          <Text style={[s.th, s.cQty]}>{labels.qty}</Text>
          <Text style={[s.th, s.cPrice]}>{labels.price}</Text>
          <Text style={[s.th, s.cAmount]}>{labels.amount}</Text>
        </View>
        {data.items.map((item, i) => (
          <View style={s.row} key={i} wrap={false}>
            <Text style={s.cDesc}>{item.description || "—"}</Text>
            <Text style={s.cUnit}>{item.unit}</Text>
            <Text style={s.cQty}>{item.qty}</Text>
            <Text style={s.cPrice}>{formatMoney(item.price, cur)}</Text>
            <Text style={s.cAmount}>{formatMoney(lineAmount(item), cur)}</Text>
          </View>
        ))}

        <View style={s.totals}>
          <View style={s.grandRow}>
            <Text style={s.grandLabel}>{labels.total}</Text>
            <Text style={[s.grandValue, { color: accent }]}>{formatMoney(totals.total, cur)}</Text>
          </View>
        </View>

        {data.notes ? (
          <View style={s.notes}>
            <Text style={s.notesLabel}>{labels.notes}</Text>
            <Text>{data.notes}</Text>
          </View>
        ) : null}

        <View style={s.sigWrap}>
          <View style={s.sigCol}>
            <Text style={s.sigLabel}>{labels.releasedBy}</Text>
            <Text style={s.sigLine}>{labels.signature}</Text>
          </View>
          <View style={s.sigCol}>
            <Text style={s.sigLabel}>{labels.receivedBy}</Text>
            <Text style={s.sigLine}>{labels.signature}</Text>
          </View>
        </View>

        <Text style={s.footer} fixed>{brand}</Text>
      </Page>
    </Document>
  );
}
