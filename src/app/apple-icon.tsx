import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

// Apple touch icon (180x180 PNG). Next injects <link rel="apple-touch-icon">.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default async function AppleIcon() {
  const font = await readFile(path.join(process.cwd(), "public", "fonts", "NotoSans-Bold.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#3d926e",
          color: "#ffffff",
          fontSize: 104,
          fontWeight: 700,
          letterSpacing: "-0.04em",
        }}
      >
        iz
      </div>
    ),
    { ...size, fonts: [{ name: "Noto", data: font, weight: 700, style: "normal" }] },
  );
}
