"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useHydrateFromUrl, numParam } from "@/lib/tools/share";
import { ShareLink } from "./share-link";

function fmtSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${Math.round(bytes)} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function ImageFileSizeTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).imageFileSize;

  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [depth, setDepth] = useState(24);

  useHydrateFromUrl((sp) => {
    setWidth(numParam(sp, "w", width));
    setHeight(numParam(sp, "h", height));
    setDepth(numParam(sp, "depth", depth));
  });

  const pixels = Math.max(0, width) * Math.max(0, height);
  const rawBytes = pixels * (depth / 8);
  const megapixels = pixels / 1e6;
  const jpegBytes = (pixels * 3) / 10; // ~10:1 vs 24-bit raw, rough guide

  const num = (v: string) => (v === "" ? 0 : Number(v));
  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";

  const depths: { value: number; label: string }[] = [
    { value: 24, label: t.d24 },
    { value: 32, label: t.d32 },
    { value: 8, label: t.d8 },
    { value: 1, label: t.d1 },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4 self-start">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t.width}</label>
            <input type="number" step="1" className={inputCls} value={width} onChange={(e) => setWidth(num(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>{t.height}</label>
            <input type="number" step="1" className={inputCls} value={height} onChange={(e) => setHeight(num(e.target.value))} />
          </div>
        </div>
        <div>
          <label className={labelCls}>{t.depth}</label>
          <select className={inputCls} value={depth} onChange={(e) => setDepth(Number(e.target.value))}>
            {depths.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">{t.uncompressed}</div>
          <div className="mt-1 text-3xl font-bold gradient-text tabular-nums">{fmtSize(rawBytes)}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.megapixels}</div>
            <div className="mt-1 text-lg font-bold tabular-nums">{megapixels.toFixed(1)} MP</div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.jpegEst}</div>
            <div className="mt-1 text-lg font-bold tabular-nums text-emerald-500">≈ {fmtSize(jpegBytes)}</div>
          </div>
        </div>
        <p className="text-xs text-[var(--muted)] leading-relaxed">{t.note}</p>
        <ShareLink slug="image-file-size" values={{ w: width, h: height, depth }} locale={locale} />
      </div>
    </div>
  );
}
