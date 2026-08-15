import path from "node:path";
import { Font } from "@react-pdf/renderer";

let registered = false;

/**
 * Register a Cyrillic-capable font once per server process. @react-pdf ships
 * only Latin Helvetica, so RU documents would render blank without this.
 * Noto Sans is used (not Roboto) because some Roboto TTF builds trigger a
 * first-glyph-dropping bug in @react-pdf's text shaper.
 */
export function ensureFonts(): void {
  if (registered) return;
  const dir = path.join(process.cwd(), "public", "fonts");
  Font.register({
    family: "Doc",
    fonts: [
      { src: path.join(dir, "NotoSans-Regular.ttf"), fontWeight: "normal" },
      { src: path.join(dir, "NotoSans-Bold.ttf"), fontWeight: "bold" },
    ],
  });
  // Never hyphenate: the default splitter can drop the first glyph of some runs.
  Font.registerHyphenationCallback((word) => [word]);
  registered = true;
}

/** Font family name used by all PDF templates. */
export const DOC_FONT = "Doc";
