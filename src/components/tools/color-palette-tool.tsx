"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { track } from "@/lib/analytics";

interface Rgb {
  r: number;
  g: number;
  b: number;
}

interface Hsl {
  h: number;
  s: number;
  l: number;
}

function parseColor(str: string): Rgb | null {
  if (typeof document === "undefined" || !str.trim()) return null;
  const el = document.createElement("div");
  el.style.color = "";
  el.style.color = str;
  if (el.style.color === "") return null;
  el.style.display = "none";
  document.body.appendChild(el);
  const cs = getComputedStyle(el).color;
  document.body.removeChild(el);
  const m = cs.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(",").map((x) => parseFloat(x.trim()));
  return { r: parts[0], g: parts[1], b: parts[2] };
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
  const hh = ((h % 360) + 360) % 360;
  const ss = Math.max(0, Math.min(100, s)) / 100;
  const ll = Math.max(0, Math.min(100, l)) / 100;
  if (ss === 0) {
    const v = Math.round(ll * 255);
    return { r: v, g: v, b: v };
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const q = ll < 0.5 ? ll * (1 + ss) : ll + ss - ll * ss;
  const p = 2 * ll - q;
  const hk = hh / 360;
  return {
    r: Math.round(hue2rgb(p, q, hk + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hk) * 255),
    b: Math.round(hue2rgb(p, q, hk - 1 / 3) * 255),
  };
}

function toHex({ r, g, b }: Rgb): string {
  return (
    "#" +
    [r, g, b]
      .map((n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0"))
      .join("")
  );
}

function shadeSteps(base: Hsl, steps: number, toward: "tint" | "shade"): string[] {
  const out: string[] = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / (steps + 1);
    const l =
      toward === "tint"
        ? base.l + (100 - base.l) * t
        : base.l * (1 - t);
    out.push(toHex(hslToRgb({ ...base, l })));
  }
  return out;
}

function harmony(base: Hsl, offsets: number[]): string[] {
  return offsets.map((off) => toHex(hslToRgb({ ...base, h: base.h + off })));
}

function SwatchRow({
  title,
  colors,
  copied,
  onCopy,
  copyLabel,
  copiedLabel,
}: {
  title: string;
  colors: string[];
  copied: string | null;
  onCopy: (hex: string) => void;
  copyLabel: string;
  copiedLabel: string;
}) {
  return (
    <div>
      <div className="eyebrow mb-2">{title}</div>
      <div className="flex flex-wrap gap-2">
        {colors.map((hex) => (
          <button
            key={title + hex}
            type="button"
            onClick={() => onCopy(hex)}
            title={`${copyLabel} ${hex}`}
            className="group flex flex-col items-center gap-1 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 hover:border-[var(--accent)] transition-colors"
          >
            <span
              className="h-12 w-12 rounded-lg border border-[var(--border-strong)]"
              style={{ background: hex }}
            />
            <span className="font-mono text-[10px] text-[var(--muted)] group-hover:text-[var(--accent)]">
              {copied === hex ? copiedLabel : hex}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ColorPaletteTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).colorPalette;
  const [value, setValue] = useState("#1b6a49");
  const [copied, setCopied] = useState<string | null>(null);

  const rgb = useMemo(() => parseColor(value), [value]);
  const hsl = useMemo(() => (rgb ? rgbToHsl(rgb) : null), [rgb]);
  const baseHex = rgb ? toHex(rgb) : null;

  const palettes = useMemo(() => {
    if (!hsl || !baseHex) return null;
    return {
      tints: shadeSteps(hsl, 5, "tint"),
      shades: shadeSteps(hsl, 5, "shade"),
      complementary: harmony(hsl, [0, 180]),
      analogous: harmony(hsl, [-30, 0, 30]),
      triad: harmony(hsl, [0, 120, 240]),
    };
  }, [hsl, baseHex]);

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      track("tool_use", { tool: "color-palette", action: "copy" });
      setCopied(hex);
      setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1500);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <label
          className="w-12 h-12 rounded-xl border border-[var(--border-strong)] shrink-0 overflow-hidden cursor-pointer"
          style={{ background: baseHex ?? "transparent" }}
          aria-label={t.pick}
        >
          <input
            type="color"
            value={baseHex ?? "#000000"}
            onChange={(e) => setValue(e.target.value)}
            className="opacity-0 w-full h-full cursor-pointer"
          />
        </label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t.placeholder}
          spellCheck={false}
          className={`flex-1 rounded-lg border bg-[var(--card)] px-3 py-3 font-mono text-sm outline-none ${
            value && !rgb ? "border-[var(--bad)]" : "border-[var(--border)]"
          } focus:border-[var(--accent)]`}
        />
      </div>

      {palettes && baseHex ? (
        <div className="space-y-5">
          <SwatchRow
            title={t.base}
            colors={[baseHex]}
            copied={copied}
            onCopy={copy}
            copyLabel={t.copy}
            copiedLabel={t.copied}
          />
          <SwatchRow
            title={t.tints}
            colors={palettes.tints}
            copied={copied}
            onCopy={copy}
            copyLabel={t.copy}
            copiedLabel={t.copied}
          />
          <SwatchRow
            title={t.shades}
            colors={palettes.shades}
            copied={copied}
            onCopy={copy}
            copyLabel={t.copy}
            copiedLabel={t.copied}
          />
          <SwatchRow
            title={t.complementary}
            colors={palettes.complementary}
            copied={copied}
            onCopy={copy}
            copyLabel={t.copy}
            copiedLabel={t.copied}
          />
          <SwatchRow
            title={t.analogous}
            colors={palettes.analogous}
            copied={copied}
            onCopy={copy}
            copyLabel={t.copy}
            copiedLabel={t.copied}
          />
          <SwatchRow
            title={t.triad}
            colors={palettes.triad}
            copied={copied}
            onCopy={copy}
            copyLabel={t.copy}
            copiedLabel={t.copied}
          />
        </div>
      ) : value ? (
        <p className="text-sm text-[var(--bad)]">{t.invalid}</p>
      ) : null}
    </div>
  );
}
