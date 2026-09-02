"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useHydrateFromUrl, numParam } from "@/lib/tools/share";
import { ShareLink } from "./share-link";

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function pct(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return `${n.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
}

export function MarginTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).margin;

  const [cost, setCost] = useState(60);
  const [price, setPrice] = useState(100);

  useHydrateFromUrl((sp) => {
    setCost(numParam(sp, "cost", cost));
    setPrice(numParam(sp, "price", price));
  });

  const profit = price - cost;
  const marginPct = price !== 0 ? (profit / price) * 100 : NaN;
  const markupPct = cost !== 0 ? (profit / cost) * 100 : NaN;
  const good = profit >= 0;

  const num = (v: string) => (v === "" ? 0 : Number(v));
  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="grid grid-cols-2 gap-3 self-start">
        <div>
          <label className={labelCls}>{t.cost}</label>
          <input type="number" step="1" className={inputCls} value={cost} onChange={(e) => setCost(num(e.target.value))} />
        </div>
        <div>
          <label className={labelCls}>{t.price}</label>
          <input type="number" step="1" className={inputCls} value={price} onChange={(e) => setPrice(num(e.target.value))} />
        </div>
      </div>

      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.marginPct}</div>
            <div className={`mt-1 text-xl font-bold tabular-nums ${good ? "text-[var(--accent)]" : "text-red-500"}`}>{pct(marginPct)}</div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.markupPct}</div>
            <div className="mt-1 text-xl font-bold tabular-nums">{pct(markupPct)}</div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.profit}</div>
            <div className={`mt-1 text-xl font-bold tabular-nums ${good ? "text-emerald-500" : "text-red-500"}`}>{fmt(profit)}</div>
          </div>
        </div>
        <ShareLink slug="margin-calculator" values={{ cost, price }} locale={locale} />
      </div>
    </div>
  );
}
