import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { asciiSlug } from "@/lib/format";
import { ensureFonts } from "@/lib/pdf/fonts";
import {
  InspectionDocument,
  type InspectionLabels,
} from "@/lib/pdf/inspection-document";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { verifyUnlock } from "@/lib/payments/provider";
import type { InspectionData } from "@/lib/tools/inspection/model";

export const runtime = "nodejs";

const SKU = "tool:inspection";

export async function POST(req: NextRequest) {
  let body: { data?: InspectionData; locale?: string; unlockToken?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body.data || !Array.isArray(body.data.items)) {
    return new Response("Missing inspection data", { status: 400 });
  }

  const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
  const dict = getDictionary(locale);
  const unlocked = verifyUnlock(body.unlockToken, SKU);
  const t = dict.inspection;

  const labels: InspectionLabels = {
    docTitle: t.docTitle,
    number: t.number,
    date: t.date,
    location: t.location,
    inspector: t.inspector,
    checklist: t.checklist,
    itemLabel: t.itemLabel,
    status: t.status,
    note: t.note,
    photos: t.photos,
    summary: t.summary,
    signature: t.signature,
    statusOk: t.statusOk,
    statusIssue: t.statusIssue,
    statusNa: t.statusNa,
  };

  ensureFonts();
  const buffer = await renderToBuffer(
    <InspectionDocument
      data={body.data}
      labels={labels}
      brand={dict.brand.name}
      watermark={!unlocked}
    />,
  );

  const filename = `inspection-${asciiSlug(body.data.number)}${unlocked ? "" : "-preview"}.pdf`;
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
