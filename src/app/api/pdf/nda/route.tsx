import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ensureFonts } from "@/lib/pdf/fonts";
import { NdaDocument, type NdaLabels } from "@/lib/pdf/nda-document";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { verifyUnlock } from "@/lib/payments/provider";
import { resolveNda, type NdaData } from "@/lib/tools/nda/model";

export const runtime = "nodejs";

const SKU = "tool:nda";

export async function POST(req: NextRequest) {
  let body: { data?: NdaData; locale?: string; unlockToken?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body.data || typeof body.data.disclosingName !== "string") {
    return new Response("Missing NDA data", { status: 400 });
  }

  const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
  const dict = getDictionary(locale);
  const unlocked = verifyUnlock(body.unlockToken, SKU);
  const t = dict.nda;

  const resolved = resolveNda(body.data, t);
  const labels: NdaLabels = {
    docTitle: t.docTitle,
    disclosingParty: t.disclosingParty,
    receivingParty: t.receivingParty,
    signatures: t.signatures,
    disclaimer: t.disclaimer,
  };

  ensureFonts();
  const buffer = await renderToBuffer(
    <NdaDocument
      data={body.data}
      resolved={resolved}
      labels={labels}
      brand={dict.brand.name}
      watermark={!unlocked}
    />,
  );

  const filename = `nda${unlocked ? "" : "-preview"}.pdf`;
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
