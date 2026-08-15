import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer";
import { DOC_FONT } from "./fonts";
import { getCertDesign, type CertData } from "@/lib/tools/cert/model";

export interface CertLabels {
  docTitle: string;
  to: string;
  from: string;
  valid: string;
}

const s = StyleSheet.create({
  page: { fontFamily: DOC_FONT, position: "relative", padding: 34 },
  fill: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  band: { position: "absolute", top: 0, left: 0, right: 0, height: 78 },
  frameOuter: { position: "absolute", top: 16, left: 16, right: 16, bottom: 16, borderWidth: 1.5, borderStyle: "solid" },
  frameInner: { position: "absolute", top: 22, left: 22, right: 22, bottom: 22, borderWidth: 0.75, borderStyle: "solid" },
  body: { flex: 1, alignItems: "center", justifyContent: "center" },
  brand: { fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, textAlign: "center" },
  title: { fontSize: 17, fontWeight: "bold", letterSpacing: 3, textAlign: "center" },
  amount: { fontSize: 46, fontWeight: "bold", marginTop: 10, marginBottom: 10, textAlign: "center" },
  to: { fontSize: 12, textAlign: "center" },
  message: { fontSize: 11, opacity: 0.82, marginTop: 10, textAlign: "center", maxWidth: 380, lineHeight: 1.4 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  foot: { fontSize: 9, opacity: 0.75 },
  footStrong: { fontSize: 9, fontWeight: "bold" },
  watermark: { position: "absolute", top: "44%", left: 0, right: 0, textAlign: "center", fontSize: 70, fontWeight: "bold", opacity: 0.12, transform: "rotate(-20deg)" },
});

export interface CertDocProps {
  data: CertData;
  labels: CertLabels;
  brand: string;
  watermark?: boolean;
}

export function CertDocument({ data, labels, brand, watermark }: CertDocProps) {
  const d = getCertDesign(data.design);
  const hasImg = !!data.bgImage;
  return (
    <Document title={labels.docTitle}>
      <Page
        size="A5"
        orientation="landscape"
        style={[s.page, { backgroundColor: hasImg ? "#ffffff" : d.bg }]}
      >
        {hasImg ? (
          <>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image style={s.fill} src={data.bgImage as string} />
            <View style={[s.overlay, { backgroundColor: d.bg, opacity: 0.74 }]} />
          </>
        ) : null}

        {d.band ? <View style={[s.band, { backgroundColor: d.accent, opacity: 0.14 }]} /> : null}
        {d.frame !== "none" ? <View style={[s.frameOuter, { borderColor: d.accent }]} /> : null}
        {d.frame === "double" ? <View style={[s.frameInner, { borderColor: d.accent }]} /> : null}

        {watermark ? <Text style={[s.watermark, { color: d.ink }]} fixed>PREVIEW</Text> : null}

        <View style={s.body}>
          {data.brandName ? <Text style={[s.brand, { color: d.accent }]}>{data.brandName}</Text> : null}
          <Text style={[s.title, { color: d.ink }]}>{labels.docTitle}</Text>
          <Text style={[s.amount, { color: d.accent }]}>{data.amount || " "}</Text>
          {data.recipient ? (
            <Text style={[s.to, { color: d.ink }]}>
              {labels.to}: {data.recipient}
            </Text>
          ) : null}
          {data.message ? <Text style={[s.message, { color: d.ink }]}>{data.message}</Text> : null}
        </View>

        <View style={s.footer}>
          <Text style={[s.footStrong, { color: d.ink }]}>{data.code}</Text>
          <Text style={[s.foot, { color: d.ink }]}>
            {data.sender ? `${labels.from}: ${data.sender}` : brand}
          </Text>
          <Text style={[s.foot, { color: d.ink }]}>
            {data.expiry ? `${labels.valid}: ${data.expiry}` : ""}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
