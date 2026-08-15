import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ensureFonts } from "@/lib/pdf/fonts";
import { TaxDocument, type TaxLabels } from "@/lib/pdf/tax-document";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { verifyUnlock } from "@/lib/payments/provider";
import type { TaxData } from "@/lib/tools/tax/model";

export const runtime = "nodejs";

const SKU = "tool:self-employed-tax";

export async function POST(req: NextRequest) {
  let body: { data?: TaxData; locale?: string; unlockToken?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body.data || typeof body.data.income !== "number") {
    return new Response("Missing data", { status: 400 });
  }

  const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
  const dict = getDictionary(locale);
  const unlocked = verifyUnlock(body.unlockToken, SKU);
  const t = dict.tax;

  const labels: TaxLabels = {
    docTitle: t.docTitle,
    inputsHeading: t.inputsHeading,
    resultsHeading: t.resultsHeading,
    income: t.income,
    expenses: t.expenses,
    taxRate: t.taxRate,
    base: t.base,
    taxLabel: t.taxLabel,
    afterTax: t.afterTax,
    takeHome: t.takeHome,
    effectiveRate: t.effectiveRate,
    perMonth: t.month,
    perYear: t.year,
    disclaimer: t.disclaimer,
  };

  ensureFonts();
  const buffer = await renderToBuffer(
    <TaxDocument
      data={body.data}
      labels={labels}
      brand={dict.brand.name}
      watermark={!unlocked}
    />,
  );

  const filename = `freelance-tax${unlocked ? "" : "-preview"}.pdf`;
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
