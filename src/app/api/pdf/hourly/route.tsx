import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ensureFonts } from "@/lib/pdf/fonts";
import { HourlyDocument, type HourlyLabels } from "@/lib/pdf/hourly-document";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { verifyUnlock } from "@/lib/payments/provider";
import type { HourlyData } from "@/lib/tools/hourly/model";

export const runtime = "nodejs";

const SKU = "tool:hourly-rate";

export async function POST(req: NextRequest) {
  let body: { data?: HourlyData; locale?: string; unlockToken?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body.data || typeof body.data.desiredIncome !== "number") {
    return new Response("Missing data", { status: 400 });
  }

  const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
  const dict = getDictionary(locale);
  const unlocked = verifyUnlock(body.unlockToken, SKU);
  const t = dict.hourly;

  const labels: HourlyLabels = {
    docTitle: t.docTitle,
    inputsHeading: t.inputsHeading,
    resultsHeading: t.resultsHeading,
    desiredIncome: t.desiredIncome,
    expenses: t.expenses,
    taxRate: t.taxRate,
    billableHoursPerWeek: t.billableHoursPerWeek,
    workWeeksPerYear: t.workWeeksPerYear,
    profitMargin: t.profitMargin,
    hourlyRate: t.hourlyRate,
    dayRate: t.dayRate,
    billableHoursPerYear: t.billableHoursPerYear,
    revenueNeeded: t.revenueNeeded,
    monthlyRevenue: t.monthlyRevenue,
    perHour: t.perHour,
    disclaimer: t.disclaimer,
  };

  ensureFonts();
  const buffer = await renderToBuffer(
    <HourlyDocument
      data={body.data}
      labels={labels}
      brand={dict.brand.name}
      watermark={!unlocked}
    />,
  );

  const filename = `hourly-rate${unlocked ? "" : "-preview"}.pdf`;
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
