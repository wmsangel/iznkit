import type { PDFDocument, PDFFont } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { NOTO_REGULAR_B64, NOTO_BOLD_B64 } from "./fonts-data";

/** base64 → bytes, using atob (available on Node and on Cloudflare Workers). */
function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}

/**
 * Embed the Cyrillic-capable Noto Sans (regular + bold) into a pdf-lib document.
 * Fonts are inlined from base64 because Workers has no filesystem; `subset: true`
 * keeps only the glyphs actually used, so output stays small. Replaces the old
 * @react-pdf Font.register(process.cwd()/public/fonts) path, which relied on fs.
 */
export async function embedDocFonts(doc: PDFDocument): Promise<{ reg: PDFFont; bold: PDFFont }> {
  doc.registerFontkit(fontkit);
  const reg = await doc.embedFont(b64ToBytes(NOTO_REGULAR_B64), { subset: true });
  const bold = await doc.embedFont(b64ToBytes(NOTO_BOLD_B64), { subset: true });
  return { reg, bold };
}
