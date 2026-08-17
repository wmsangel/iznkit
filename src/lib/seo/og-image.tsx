import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFonts() {
  const dir = path.join(process.cwd(), "public", "fonts");
  const [reg, bold] = await Promise.all([
    readFile(path.join(dir, "NotoSans-Regular.ttf")),
    readFile(path.join(dir, "NotoSans-Bold.ttf")),
  ]);
  return [
    { name: "Noto", data: reg, weight: 400 as const, style: "normal" as const },
    { name: "Noto", data: bold, weight: 700 as const, style: "normal" as const },
  ];
}

const BRAND = "#4faa82"; // on-brand green used across the card

/**
 * Renders a branded social-share image in the calm iznkit palette. Uses bundled
 * Noto Sans so Cyrillic titles render correctly (Satori has no system Cyrillic
 * font). The `accent` argument is accepted for backwards-compatibility but the
 * card is intentionally single-brand for consistency.
 */
export async function ogImage({
  title,
  subtitle,
  footer = "Free right now · EN / RU",
}: {
  title: string;
  subtitle: string;
  accent?: string;
  footer?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#0c0e0c",
          fontFamily: "Noto",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 10,
            height: "100%",
            background: BRAND,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: BRAND,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#06130c",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            iz
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#e9e9e3" }}>iznkit</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: "#f4f4ef",
              lineHeight: 1.08,
              maxWidth: 960,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#9a9a90",
              marginTop: 26,
              maxWidth: 880,
              lineHeight: 1.35,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ height: 8, width: 72, borderRadius: 4, background: BRAND }} />
          <div style={{ fontSize: 22, color: "#9a9a90" }}>{footer}</div>
        </div>
      </div>
    ),
    { ...size, fonts: await loadFonts() },
  );
}
