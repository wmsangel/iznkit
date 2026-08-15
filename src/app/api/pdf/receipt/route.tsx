import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { asciiSlug } from "@/lib/format";
import { ensureFonts } from "@/lib/pdf/fonts";
import { ReceiptDocument, type ReceiptLabels } from "@/lib/pdf/receipt-document";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { verifyUnlock } from "@/lib/payments/provider";
import type { PaymentMethod, ReceiptData } from "@/lib/tools/receipt/model";

export const runtime = "nodejs";

const SKU = "tool:receipt";

export async function POST(req: NextRequest) {
  let body: { data?: ReceiptData; locale?: string; unlockToken?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body.data || !Array.isArray(body.data.items)) {
    return new Response("Missing receipt data", { status: 400 });
  }

  const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
  const dict = getDictionary(locale);
  const unlocked = verifyUnlock(body.unlockToken, SKU);
  const t = dict.receipt;

  const methodMap: Record<PaymentMethod, string> = {
    cash: t.methodCash,
    card: t.methodCard,
    transfer: t.methodTransfer,
    other: t.methodOther,
  };

  const labels: ReceiptLabels = {
    docTitle: t.docTitle,
    paid: t.paid,
    from: t.from,
    to: t.to,
    number: t.number,
    date: t.date,
    method: t.method,
    methodValue: methodMap[body.data.method] ?? t.methodOther,
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
    <ReceiptDocument
      data={body.data}
      labels={labels}
      brand={dict.brand.name}
      watermark={!unlocked}
    />,
  );

  const filename = `receipt-${asciiSlug(body.data.number)}${unlocked ? "" : "-preview"}.pdf`;
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
