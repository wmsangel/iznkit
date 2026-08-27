"use client";
import { track } from "@/lib/analytics";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** Parse any CSS color string via the browser; null if invalid. */
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

function toHex({ r, g, b }: Rgb): string {
  return (
    "#" +
    [r, g, b]
      .map((n) => Math.round(n).toString(16).padStart(2, "0"))
      .join("")
  );
}

function toHsl({ r, g, b }: Rgb): string {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0,
    s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export function ColorTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).color;

  const [value, setValue] = useState("#1b6a49");
  const [copied, setCopied] = useState<string | null>(null);

  const rgb = useMemo(() => parseColor(value), [value]);
  const results = useMemo(() => {
    if (!rgb) return null;
    return {
      hex: toHex(rgb),
      rgb: `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`,
      hsl: toHsl(rgb),
    };
  }, [rgb]);

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      track("tool_use", { tool: "color", action: "copy" });
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const swatch = results?.hex ?? "transparent";

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <label
          className="w-12 h-12 rounded-xl border border-[var(--border-strong)] shrink-0 overflow-hidden cursor-pointer"
          style={{ background: swatch }}
          aria-label={t.pick}
        >
          <input
            type="color"
            value={results?.hex ?? "#000000"}
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

      {results ? (
        <div className="rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
          {(["hex", "rgb", "hsl"] as const).map((k) => (
            <div key={k} className="flex items-center gap-3 px-4 py-3">
              <span className="eyebrow w-12">{t[k]}</span>
              <span className="flex-1 font-mono text-sm break-all">{results[k]}</span>
              <button
                type="button"
                onClick={() => copy(results[k], k)}
                className="text-xs font-medium text-[var(--accent)] hover:underline shrink-0"
              >
                {copied === k ? t.copied : t.copy}
              </button>
            </div>
          ))}
        </div>
      ) : value ? (
        <p className="text-sm text-[var(--bad)]">{t.invalid}</p>
      ) : null}
    </div>
  );
}
