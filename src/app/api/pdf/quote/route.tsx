import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { asciiSlug } from "@/lib/format";
import { ensureFonts } from "@/lib/pdf/fonts";
import { QuoteDocument, type QuoteLabels } from "@/lib/pdf/quote-document";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { verifyUnlock } from "@/lib/payments/provider";
import type { QuoteData } from "@/lib/tools/quote/model";

export const runtime = "nodejs";

const SKU = "tool:quote";

export async function POST(req: NextRequest) {
  let body: { data?: QuoteData; locale?: string; unlockToken?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body.data || !Array.isArray(body.data.items)) {
    return new Response("Missing quote data", { status: 400 });
  }

  const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
  const dict = getDictionary(locale);
  const unlocked = verifyUnlock(body.unlockToken, SKU);
  const t = dict.quote;

  const labels: QuoteLabels = {
    docTitle: t.docTitle,
    number: t.number,
    date: t.date,
    validUntil: t.validUntil,
    from: t.from,
    to: t.to,
    itemDesc: t.itemDesc,
    qty: t.qty,
    price: t.price,
    amount: t.amount,
    subtotal: t.subtotal,
    tax: t.tax,
    total: t.total,
    notes: t.notes,
  };

  ensureFonts();
  const buffer = await renderToBuffer(
    <QuoteDocument
      data={body.data}
      labels={labels}
      brand={dict.brand.name}
      watermark={!unlocked}
    />,
  );

  const filename = `quote-${asciiSlug(body.data.number)}${unlocked ? "" : "-preview"}.pdf`;
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
