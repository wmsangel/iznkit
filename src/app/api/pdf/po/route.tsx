import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { asciiSlug } from "@/lib/format";
import { ensureFonts } from "@/lib/pdf/fonts";
import { PoDocument, type PoLabels } from "@/lib/pdf/po-document";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { verifyUnlock } from "@/lib/payments/provider";
import type { PoData } from "@/lib/tools/po/model";

export const runtime = "nodejs";
const SKU = "tool:purchase-order";

export async function POST(req: NextRequest) {
  let body: { data?: PoData; locale?: string; unlockToken?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body.data || !Array.isArray(body.data.items)) {
    return new Response("Missing PO data", { status: 400 });
  }
  const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
  const dict = getDictionary(locale);
  const unlocked = verifyUnlock(body.unlockToken, SKU);
  const t = dict.po;
  const labels: PoLabels = {
    docTitle: t.docTitle,
    number: t.number,
    date: t.date,
    deliveryDate: t.deliveryDate,
    buyer: t.buyer,
    supplier: t.supplier,
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
    <PoDocument data={body.data} labels={labels} brand={dict.brand.name} watermark={!unlocked} />,
  );
  const filename = `purchase-order-${asciiSlug(body.data.number)}${unlocked ? "" : "-preview"}.pdf`;
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
