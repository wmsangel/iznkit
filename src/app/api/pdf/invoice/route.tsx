import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { asciiSlug } from "@/lib/format";
import { ensureFonts } from "@/lib/pdf/fonts";
import { InvoiceDocument, type InvoiceLabels } from "@/lib/pdf/invoice-document";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { verifyUnlock } from "@/lib/payments/provider";
import type { InvoiceData } from "@/lib/tools/invoice/model";

export const runtime = "nodejs";

const SKU = "tool:invoice";

export async function POST(req: NextRequest) {
  let body: { data?: InvoiceData; locale?: string; unlockToken?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body.data || !Array.isArray(body.data.items)) {
    return new Response("Missing invoice data", { status: 400 });
  }

  const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
  const dict = getDictionary(locale);
  const unlocked = verifyUnlock(body.unlockToken, SKU);

  const labels: InvoiceLabels = {
    docTitle: dict.invoice.docTitle,
    number: dict.invoice.number,
    date: dict.invoice.date,
    dueDate: dict.invoice.dueDate,
    from: dict.invoice.from,
    billedTo: dict.invoice.billedTo,
    itemDesc: dict.invoice.itemDesc,
    qty: dict.invoice.qty,
    price: dict.invoice.price,
    amount: dict.invoice.amount,
    subtotal: dict.invoice.subtotal,
    tax: dict.invoice.tax,
    total: dict.invoice.total,
    notes: dict.invoice.notes,
  };

  ensureFonts();
  const buffer = await renderToBuffer(
    <InvoiceDocument
      data={body.data}
      labels={labels}
      brand={dict.brand.name}
      watermark={!unlocked}
    />,
  );

  const filename = `invoice-${asciiSlug(body.data.number)}${unlocked ? "" : "-preview"}.pdf`;
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
