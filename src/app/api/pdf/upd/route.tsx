import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { asciiSlug } from "@/lib/format";
import { ensureFonts } from "@/lib/pdf/fonts";
import { UpdDocument } from "@/lib/pdf/upd-document";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import type { UpdData } from "@/lib/tools/upd/model";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { data?: UpdData; locale?: string };
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

  ensureFonts();
  const buffer = await renderToBuffer(<UpdDocument data={body.data} brand={dict.brand.name} />);

  const filename = `upd-${asciiSlug(body.data.number || "draft")}.pdf`;
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
