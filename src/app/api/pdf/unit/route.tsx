import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ensureFonts } from "@/lib/pdf/fonts";
import { UnitDocument, type UnitLabels } from "@/lib/pdf/unit-document";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { verifyUnlock } from "@/lib/payments/provider";
import type { UnitData } from "@/lib/tools/unit/model";

export const runtime = "nodejs";
const SKU = "tool:unit-economics";

export async function POST(req: NextRequest) {
  let body: { data?: UnitData; locale?: string; unlockToken?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body.data || typeof body.data.sellPrice !== "number") {
    return new Response("Missing data", { status: 400 });
  }
  const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
  const dict = getDictionary(locale);
  const unlocked = verifyUnlock(body.unlockToken, SKU);
  const t = dict.unit;
  const labels: UnitLabels = {
    docTitle: t.docTitle,
    inputsHeading: t.inputsHeading,
    resultsHeading: t.resultsHeading,
    sellPrice: t.sellPrice,
    cogs: t.cogs,
    commissionPct: t.commissionPct,
    logistics: t.logistics,
    packaging: t.packaging,
    otherFees: t.otherFees,
    adPerUnit: t.adPerUnit,
    taxPct: t.taxPct,
    returnRate: t.returnRate,
    profit: t.profit,
    margin: t.margin,
    roi: t.roi,
    adjustedProfit: t.adjustedProfit,
    commission: t.commission,
    tax: t.tax,
    totalCosts: t.totalCosts,
    breakEvenPrice: t.breakEvenPrice,
    disclaimer: t.disclaimer,
  };
  ensureFonts();
  const buffer = await renderToBuffer(
    <UnitDocument data={body.data} labels={labels} brand={dict.brand.name} watermark={!unlocked} />,
  );
  const filename = `unit-economics${unlocked ? "" : "-preview"}.pdf`;
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
