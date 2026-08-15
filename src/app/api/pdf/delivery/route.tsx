import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { asciiSlug } from "@/lib/format";
import { ensureFonts } from "@/lib/pdf/fonts";
import { DeliveryDocument, type DeliveryLabels } from "@/lib/pdf/delivery-document";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { verifyUnlock } from "@/lib/payments/provider";
import type { DeliveryData } from "@/lib/tools/delivery/model";

export const runtime = "nodejs";
const SKU = "tool:delivery-note";

export async function POST(req: NextRequest) {
  let body: { data?: DeliveryData; locale?: string; unlockToken?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body.data || !Array.isArray(body.data.items)) {
    return new Response("Missing data", { status: 400 });
  }
  const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
  const dict = getDictionary(locale);
  const unlocked = verifyUnlock(body.unlockToken, SKU);
  const t = dict.delivery;
  const labels: DeliveryLabels = {
    docTitle: t.docTitle,
    number: t.number,
    date: t.date,
    shipper: t.shipper,
    consignee: t.consignee,
    itemDesc: t.itemDesc,
    unit: t.unit,
    qty: t.qty,
    price: t.price,
    amount: t.amount,
    total: t.total,
    notes: t.notes,
    releasedBy: t.releasedBy,
    receivedBy: t.receivedBy,
    signature: t.signature,
  };
  ensureFonts();
  const buffer = await renderToBuffer(
    <DeliveryDocument data={body.data} labels={labels} brand={dict.brand.name} watermark={!unlocked} />,
  );
  const filename = `delivery-note-${asciiSlug(body.data.number)}${unlocked ? "" : "-preview"}.pdf`;
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
