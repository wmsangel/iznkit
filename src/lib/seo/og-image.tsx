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

/**
 * Renders a branded social-share image. Uses bundled Noto Sans so Cyrillic
 * titles render correctly (Satori has no system Cyrillic font).
 */
export async function ogImage({
  title,
  subtitle,
  accent = "#8b93f8",
  footer = "Free to try · PDF · EN / RU",
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
          background: "#0b1020",
          fontFamily: "Noto",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 620,
            height: 620,
            background: `radial-gradient(circle at center, ${accent}55 0%, transparent 70%)`,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${accent}, #a78bfa)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            iz
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>iznkit</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.08,
              maxWidth: 960,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#9aa6be",
              marginTop: 26,
              maxWidth: 880,
              lineHeight: 1.35,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ height: 8, width: 72, borderRadius: 4, background: accent }} />
          <div style={{ fontSize: 22, color: "#9aa6be" }}>{footer}</div>
        </div>
      </div>
    ),
    { ...size, fonts: await loadFonts() },
  );
}
