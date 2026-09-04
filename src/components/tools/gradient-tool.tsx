"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { track } from "@/lib/analytics";
import { useHydrateFromUrl, numParam } from "@/lib/tools/share";
import { ShareLink } from "./share-link";

type GradType = "linear" | "radial";

export function GradientTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).cssGradient;

  const [type, setType] = useState<GradType>("linear");
  const [angle, setAngle] = useState(90);
  const [c1, setC1] = useState("#7c3aed");
  const [c2, setC2] = useState("#4faa82");
  const [copied, setCopied] = useState(false);

  useHydrateFromUrl((sp) => {
    const ty = sp.get("type");
    if (ty === "linear" || ty === "radial") setType(ty);
    setAngle(numParam(sp, "angle", angle));
    const a = sp.get("c1");
    if (a) setC1(a);
    const b = sp.get("c2");
    if (b) setC2(b);
  });

  const grad =
    type === "linear"
      ? `linear-gradient(${angle}deg, ${c1}, ${c2})`
      : `radial-gradient(circle, ${c1}, ${c2})`;
  const css = `background: ${grad};`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(css);
      track("tool_use", { tool: "css-gradient-generator", action: "copy" });
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  }

  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";
  const tabCls = (active: boolean) =>
    `flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
    }`;
  const swatch = (value: string, set: (v: string) => void, label: string) => (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1.5">
        <input
          type="color"
          value={value}
          onChange={(e) => set(e.target.value)}
          className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
          aria-label={label}
        />
        <span className="text-sm font-mono">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="flex gap-1 rounded-lg border border-[var(--border)] p-1 max-w-64">
          <button type="button" className={tabCls(type === "linear")} onClick={() => setType("linear")}>
            {t.linear}
          </button>
          <button type="button" className={tabCls(type === "radial")} onClick={() => setType("radial")}>
            {t.radial}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {swatch(c1, setC1, t.color1)}
          {swatch(c2, setC2, t.color2)}
        </div>
        {type === "linear" ? (
          <div>
            <label className={labelCls}>
              {t.angle}: {angle}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
          </div>
        ) : null}
      </div>

      <div className="self-start space-y-3">
        <div className="h-44 rounded-2xl border border-[var(--border)]" style={{ background: grad }} />
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 flex items-center gap-3">
          <code className="min-w-0 flex-1 text-xs font-mono break-all text-[var(--foreground)]">{css}</code>
          <button
            type="button"
            onClick={copy}
            className="shrink-0 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
          >
            {copied ? t.copied : t.copy}
          </button>
        </div>
        <ShareLink slug="css-gradient-generator" values={{ type, angle, c1, c2 }} locale={locale} />
      </div>
    </div>
  );
}
