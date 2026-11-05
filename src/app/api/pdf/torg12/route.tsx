import { NextRequest } from "next/server";
import { asciiSlug } from "@/lib/format";
import { buildTorg12Pdf } from "@/lib/pdf2/torg12";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import type { Torg12Data } from "@/lib/tools/torg12/model";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { data?: Torg12Data; locale?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body.data || !Array.isArray(body.data.items)) {
    return new Response("Missing document data", { status: 400 });
  }

  const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
  const dict = getDictionary(locale);

  const bytes = await buildTorg12Pdf(body.data, dict.brand.name);

  const filename = `torg12-${asciiSlug(body.data.number || "draft")}.pdf`;
  return new Response(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
