import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { asciiSlug } from "@/lib/format";
import { ensureFonts } from "@/lib/pdf/fonts";
import { AktSverkiDocument } from "@/lib/pdf/akt-sverki-document";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import type { AktSverkiData } from "@/lib/tools/akt-sverki/model";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { data?: AktSverkiData; locale?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body.data || !Array.isArray(body.data.rows)) {
    return new Response("Missing document data", { status: 400 });
  }

  const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
  const dict = getDictionary(locale);

  ensureFonts();
  const buffer = await renderToBuffer(<AktSverkiDocument data={body.data} brand={dict.brand.name} />);

  const filename = `akt-sverki-${asciiSlug(body.data.number || "draft")}.pdf`;
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
