import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ensureFonts } from "@/lib/pdf/fonts";
import { AdRoiDocument, type AdRoiLabels } from "@/lib/pdf/adroi-document";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { verifyUnlock } from "@/lib/payments/provider";
import type { AdRoiData } from "@/lib/tools/adroi/model";

export const runtime = "nodejs";
const SKU = "tool:ad-roi";

export async function POST(req: NextRequest) {
  let body: { data?: AdRoiData; locale?: string; unlockToken?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body.data || typeof body.data.adSpend !== "number") {
    return new Response("Missing data", { status: 400 });
  }
  const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
  const dict = getDictionary(locale);
  const unlocked = verifyUnlock(body.unlockToken, SKU);
  const t = dict.adroi;
  const labels: AdRoiLabels = {
    docTitle: t.docTitle,
    inputsHeading: t.inputsHeading,
    resultsHeading: t.resultsHeading,
    adSpend: t.adSpend,
    revenue: t.revenue,
    grossMargin: t.grossMargin,
    otherCosts: t.otherCosts,
    roas: t.roas,
    roi: t.roi,
    netProfit: t.netProfit,
    grossProfit: t.grossProfit,
    breakEvenRoas: t.breakEvenRoas,
    disclaimer: t.disclaimer,
  };
  ensureFonts();
  const buffer = await renderToBuffer(
    <AdRoiDocument data={body.data} labels={labels} brand={dict.brand.name} watermark={!unlocked} />,
  );
  const filename = `ad-roi${unlocked ? "" : "-preview"}.pdf`;
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
