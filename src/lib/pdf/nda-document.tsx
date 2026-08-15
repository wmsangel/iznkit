import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { DOC_FONT } from "./fonts";
import type { NdaData, ResolvedNda } from "@/lib/tools/nda/model";
import { getThemeAccent } from "@/lib/design/themes";

export interface NdaLabels {
  docTitle: string;
  disclosingParty: string;
  receivingParty: string;
  signatures: string;
  disclaimer: string;
}

const INK = "#111827";
const MUTED = "#6b7280";
const LINE = "#d1d5db";

const s = StyleSheet.create({
  page: {
    fontFamily: DOC_FONT,
    fontSize: 10.5,
    color: INK,
    lineHeight: 1.5,
    paddingTop: 56,
    paddingBottom: 64,
    paddingHorizontal: 56,
    position: "relative",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  intro: { marginBottom: 16, textAlign: "justify" },
  clauseH: { fontWeight: "bold", marginTop: 10, marginBottom: 3 },
  clauseB: { textAlign: "justify", color: "#1f2937" },
  sigWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  sigCol: { width: "45%" },
  sigLabel: { color: MUTED, fontSize: 9, textTransform: "uppercase", marginBottom: 4 },
  sigName: { fontWeight: "bold" },
  sigDetails: { color: MUTED, fontSize: 9, marginBottom: 28 },
  sigLine: { borderTopWidth: 1, borderColor: INK, paddingTop: 4, fontSize: 9, color: MUTED },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: MUTED,
    marginTop: 36,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  disclaimer: {
    marginTop: 28,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: LINE,
    fontSize: 8,
    color: MUTED,
    fontStyle: "normal",
  },
  footer: {
    position: "absolute",
    bottom: 26,
    left: 56,
    right: 56,
    textAlign: "center",
    color: MUTED,
    fontSize: 8,
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

export interface NdaDocProps {
  data: NdaData;
  resolved: ResolvedNda;
  labels: NdaLabels;
  brand: string;
  watermark?: boolean;
}

export function NdaDocument({ data, resolved, labels, brand, watermark }: NdaDocProps) {
  const accent = getThemeAccent(data.theme);
  return (
    <Document title={labels.docTitle}>
      <Page size="A4" style={s.page}>
        {watermark ? <Text style={s.watermark} fixed>PREVIEW</Text> : null}

        <Text style={[s.title, { color: accent }]}>{labels.docTitle}</Text>
        <Text style={s.intro}>{resolved.intro}</Text>

        {resolved.clauses.map((c, i) => (
          <View key={i} wrap={false}>
            <Text style={s.clauseH}>{c.h}</Text>
            <Text style={s.clauseB}>{c.b}</Text>
          </View>
        ))}

        <Text style={s.sectionTitle}>{labels.signatures}</Text>
        <View style={s.sigWrap}>
          <View style={s.sigCol}>
            <Text style={s.sigLabel}>{labels.disclosingParty}</Text>
            <Text style={s.sigName}>{data.disclosingName || "—"}</Text>
            <Text style={s.sigDetails}>{data.disclosingDetails}</Text>
            <Text style={s.sigLine}>Signature / Date</Text>
          </View>
          <View style={s.sigCol}>
            <Text style={s.sigLabel}>{labels.receivingParty}</Text>
            <Text style={s.sigName}>{data.receivingName || "—"}</Text>
            <Text style={s.sigDetails}>{data.receivingDetails}</Text>
            <Text style={s.sigLine}>Signature / Date</Text>
          </View>
        </View>

        <Text style={s.disclaimer}>{labels.disclaimer}</Text>
        <Text style={s.footer} fixed>{brand}</Text>
      </Page>
    </Document>
  );
}
