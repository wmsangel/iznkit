import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { asciiSlug } from "@/lib/format";
import { ensureFonts } from "@/lib/pdf/fonts";
import { CertDocument, type CertLabels } from "@/lib/pdf/cert-document";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { verifyUnlock } from "@/lib/payments/provider";
import type { CertData } from "@/lib/tools/cert/model";

export const runtime = "nodejs";
const SKU = "tool:gift-certificate";

export async function POST(req: NextRequest) {
  let body: { data?: CertData; locale?: string; unlockToken?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body.data || typeof body.data.design !== "string") {
    return new Response("Missing data", { status: 400 });
  }
  const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
  const dict = getDictionary(locale);
  const unlocked = verifyUnlock(body.unlockToken, SKU);
  const t = dict.cert;
  const labels: CertLabels = {
    docTitle: t.docTitle,
    to: t.to,
    from: t.from,
    valid: t.valid,
  };
  ensureFonts();
  const buffer = await renderToBuffer(
    <CertDocument data={body.data} labels={labels} brand={dict.brand.name} watermark={!unlocked} />,
  );
  const filename = `gift-certificate-${asciiSlug(body.data.code)}${unlocked ? "" : "-preview"}.pdf`;
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
