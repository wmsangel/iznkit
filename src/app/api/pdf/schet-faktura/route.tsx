import { NextRequest } from "next/server";
import { asciiSlug } from "@/lib/format";
import { buildSchetFakturaPdf } from "@/lib/pdf2/schet-faktura";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import type { SfData } from "@/lib/tools/schet-faktura/model";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { data?: SfData; locale?: string };
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

  const bytes = await buildSchetFakturaPdf(body.data, dict.brand.name);

  const filename = `schet-faktura-${asciiSlug(body.data.number || "draft")}.pdf`;
  return new Response(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
