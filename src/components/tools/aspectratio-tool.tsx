"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useHydrateFromUrl, numParam } from "@/lib/tools/share";
import { ShareLink } from "./share-link";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
const r0 = (n: number) => (Number.isFinite(n) ? Math.round(n).toLocaleString("en-US") : "—");

export function AspectRatioTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).aspectRatio;

  const [rw, setRw] = useState(16);
  const [rh, setRh] = useState(9);
  const [newW, setNewW] = useState(1280);
  const [newH, setNewH] = useState(1080);

  useHydrateFromUrl((sp) => {
    setRw(numParam(sp, "rw", rw));
    setRh(numParam(sp, "rh", rh));
    setNewW(numParam(sp, "w", newW));
    setNewH(numParam(sp, "h", newH));
  });

  const g = rw > 0 && rh > 0 ? gcd(rw, rh) || 1 : 1;
  const ratioLabel = rw > 0 && rh > 0 ? `${rw / g} : ${rh / g}` : "—";
  const heightForWidth = rw !== 0 ? (newW * rh) / rw : NaN;
  const widthForHeight = rh !== 0 ? (newH * rw) / rh : NaN;

  const num = (v: string) => (v === "" ? 0 : Number(v));
  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4 self-start">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t.ratioW}</label>
            <input type="number" step="1" className={inputCls} value={rw} onChange={(e) => setRw(num(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>{t.ratioH}</label>
            <input type="number" step="1" className={inputCls} value={rh} onChange={(e) => setRh(num(e.target.value))} />
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.ratio}</div>
          <div className="mt-1 text-2xl font-bold gradient-text tabular-nums">{ratioLabel}</div>
        </div>
      </div>

      <div className="self-start space-y-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <label className={labelCls}>{t.newWidth}</label>
          <input type="number" step="1" className={inputCls} value={newW} onChange={(e) => setNewW(num(e.target.value))} />
          <div className="mt-3 flex items-baseline justify-between gap-2">
            <span className="text-xs text-[var(--muted)]">{t.heightResult}</span>
            <span className="text-xl font-bold text-[var(--accent)] tabular-nums">{r0(heightForWidth)}</span>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <label className={labelCls}>{t.newHeight}</label>
          <input type="number" step="1" className={inputCls} value={newH} onChange={(e) => setNewH(num(e.target.value))} />
          <div className="mt-3 flex items-baseline justify-between gap-2">
            <span className="text-xs text-[var(--muted)]">{t.widthResult}</span>
            <span className="text-xl font-bold text-[var(--accent)] tabular-nums">{r0(widthForHeight)}</span>
          </div>
        </div>
        <ShareLink slug="aspect-ratio-calculator" values={{ rw, rh, w: newW, h: newH }} locale={locale} />
      </div>
    </div>
  );
}
