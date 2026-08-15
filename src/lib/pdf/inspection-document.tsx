import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { DOC_FONT } from "./fonts";
import { STATUS_COLOR, type InspectionData } from "@/lib/tools/inspection/model";
import { getThemeAccent } from "@/lib/design/themes";

export interface InspectionLabels {
  docTitle: string;
  number: string;
  date: string;
  location: string;
  inspector: string;
  checklist: string;
  itemLabel: string;
  status: string;
  note: string;
  photos: string;
  summary: string;
  signature: string;
  statusOk: string;
  statusIssue: string;
  statusNa: string;
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
    marginBottom: 16,
  },
  docTitle: { fontSize: 22, fontWeight: "bold", color: ACCENT, letterSpacing: 0.5 },
  metaLabel: { color: MUTED, fontSize: 9 },
  metaValue: { fontWeight: "bold", textAlign: "right", marginBottom: 4 },
  subject: { fontSize: 13, fontWeight: "bold", marginBottom: 6 },
  metaLine: { color: MUTED, marginBottom: 2 },
  metaLineStrong: { color: INK },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: MUTED,
    marginTop: 18,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: LINE,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  th: { color: MUTED, fontSize: 9, fontWeight: "bold", textTransform: "uppercase" },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: LINE,
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  cItem: { width: "42%" },
  cStatus: { width: "20%" },
  cNote: { width: "38%", color: "#374151" },
  pill: {
    alignSelf: "flex-start",
    color: "#fff",
    fontSize: 8,
    fontWeight: "bold",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  photoCell: { width: "47%" },
  photo: {
    width: "100%",
    height: 150,
    objectFit: "cover",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: LINE,
  },
  photoCaption: { fontSize: 8, color: MUTED, marginTop: 3 },
  summary: {
    marginTop: 4,
    lineHeight: 1.5,
    color: "#1f2937",
    textAlign: "justify",
  },
  sigWrap: { marginTop: 44, width: "55%" },
  sigLine: { borderTopWidth: 1, borderColor: INK, paddingTop: 4, fontSize: 9, color: MUTED },
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

export interface InspectionDocProps {
  data: InspectionData;
  labels: InspectionLabels;
  brand: string;
  watermark?: boolean;
}

export function InspectionDocument({ data, labels, brand, watermark }: InspectionDocProps) {
  const statusText = {
    ok: labels.statusOk,
    issue: labels.statusIssue,
    na: labels.statusNa,
  };
  const accent = getThemeAccent(data.theme);
  return (
    <Document title={`${labels.docTitle} ${data.number}`}>
      <Page size="A4" style={s.page}>
        {watermark ? <Text style={s.watermark} fixed>PREVIEW</Text> : null}

        <View style={s.headerRow}>
          <Text style={[s.docTitle, { color: accent }]}>{labels.docTitle}</Text>
          <View>
            <Text style={s.metaLabel}>{labels.number}</Text>
            <Text style={s.metaValue}>{data.number || "—"}</Text>
            <Text style={s.metaLabel}>{labels.date}</Text>
            <Text style={s.metaValue}>{data.date || "—"}</Text>
          </View>
        </View>

        {data.title ? <Text style={s.subject}>{data.title}</Text> : null}
        <Text style={s.metaLine}>
          {labels.location}: <Text style={s.metaLineStrong}>{data.location || "—"}</Text>
        </Text>
        <Text style={s.metaLine}>
          {labels.inspector}:{" "}
          <Text style={s.metaLineStrong}>
            {data.inspector || "—"}
            {data.inspectorDetails ? `, ${data.inspectorDetails}` : ""}
          </Text>
        </Text>

        {/* Checklist */}
        {data.items.length ? (
          <>
            <Text style={s.sectionTitle}>{labels.checklist}</Text>
            <View style={s.tableHead}>
              <Text style={[s.th, s.cItem]}>{labels.itemLabel}</Text>
              <Text style={[s.th, s.cStatus]}>{labels.status}</Text>
              <Text style={[s.th, s.cNote]}>{labels.note}</Text>
            </View>
            {data.items.map((item, i) => (
              <View style={s.row} key={i} wrap={false}>
                <Text style={s.cItem}>{item.label || "—"}</Text>
                <View style={s.cStatus}>
                  <Text style={[s.pill, { backgroundColor: STATUS_COLOR[item.status] }]}>
                    {statusText[item.status]}
                  </Text>
                </View>
                <Text style={s.cNote}>{item.note}</Text>
              </View>
            ))}
          </>
        ) : null}

        {/* Photos */}
        {data.photos.length ? (
          <>
            <Text style={s.sectionTitle}>{labels.photos}</Text>
            <View style={s.photoGrid}>
              {data.photos.map((p, i) => (
                <View style={s.photoCell} key={i} wrap={false}>
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image style={s.photo} src={p.src} />
                  {p.caption ? <Text style={s.photoCaption}>{p.caption}</Text> : null}
                </View>
              ))}
            </View>
          </>
        ) : null}

        {/* Summary */}
        {data.summary ? (
          <>
            <Text style={s.sectionTitle}>{labels.summary}</Text>
            <Text style={s.summary}>{data.summary}</Text>
          </>
        ) : null}

        <View style={s.sigWrap}>
          <Text style={s.metaLine}>{data.inspector || "—"}</Text>
          <Text style={s.sigLine}>{labels.signature}</Text>
        </View>

        <Text style={s.footer} fixed>{brand}</Text>
      </Page>
    </Document>
  );
}
