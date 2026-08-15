import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ensureFonts } from "@/lib/pdf/fonts";
import { RentalDocument, type RentalLabels } from "@/lib/pdf/rental-document";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { verifyUnlock } from "@/lib/payments/provider";
import type { RentalData } from "@/lib/tools/rental/model";

export const runtime = "nodejs";

const SKU = "tool:rental-yield";

export async function POST(req: NextRequest) {
  let body: { data?: RentalData; locale?: string; unlockToken?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body.data || typeof body.data.price !== "number") {
    return new Response("Missing rental data", { status: 400 });
  }

  const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
  const dict = getDictionary(locale);
  const unlocked = verifyUnlock(body.unlockToken, SKU);
  const t = dict.rental;

  const labels: RentalLabels = {
    docTitle: t.docTitle,
    inputsHeading: t.inputsHeading,
    resultsHeading: t.resultsHeading,
    price: t.price,
    purchaseCosts: t.purchaseCosts,
    monthlyRent: t.monthlyRent,
    vacancyRate: t.vacancyRate,
    monthlyExpenses: t.monthlyExpenses,
    downPayment: t.downPayment,
    interestRate: t.interestRate,
    loanTermYears: t.loanTermYears,
    grossYield: t.grossYield,
    netYield: t.netYield,
    monthlyCashFlow: t.monthlyCashFlow,
    annualCashFlow: t.annualCashFlow,
    cashOnCash: t.cashOnCash,
    payback: t.payback,
    noi: t.noi,
    cashInvested: t.cashInvested,
    monthlyMortgage: t.monthlyMortgage,
    years: t.years,
    na: t.na,
  };

  ensureFonts();
  const buffer = await renderToBuffer(
    <RentalDocument
      data={body.data}
      labels={labels}
      brand={dict.brand.name}
      watermark={!unlocked}
    />,
  );

  const filename = `rental-yield${unlocked ? "" : "-preview"}.pdf`;
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
