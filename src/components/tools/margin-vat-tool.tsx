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

export function MarginVatTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).marginVat;

  const [cost, setCost] = useState(60);
  const [price, setPrice] = useState(120);
  const [vat, setVat] = useState(20);
  const [includesVat, setIncludesVat] = useState(true);

  useHydrateFromUrl((sp) => {
    setCost(numParam(sp, "cost", cost));
    setPrice(numParam(sp, "price", price));
    setVat(numParam(sp, "vat", vat));
    setIncludesVat(numParam(sp, "inc", 1) !== 0);
  });

  const r = vat / 100;
  // Net (ex-VAT) figures — margin is only meaningful on these, VAT is pass-through.
  const netCost = includesVat ? cost / (1 + r) : cost;
  const netPrice = includesVat ? price / (1 + r) : price;
  const profit = netPrice - netCost;
  const marginPct = netPrice !== 0 ? (profit / netPrice) * 100 : NaN;
  const markupPct = netCost !== 0 ? (profit / netCost) * 100 : NaN;
  // VAT you remit = output VAT − input VAT (VAT on the value you added).
  const vatPayable = (netPrice - netCost) * r;
  const good = profit >= 0;

  const num = (v: string) => (v === "" ? 0 : Number(v));
  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4 self-start">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t.cost}</label>
            <input type="number" step="1" className={inputCls} value={cost} onChange={(e) => setCost(num(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>{t.price}</label>
            <input type="number" step="1" className={inputCls} value={price} onChange={(e) => setPrice(num(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>{t.vatRate} (%)</label>
            <input type="number" step="1" className={inputCls} value={vat} onChange={(e) => setVat(num(e.target.value))} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
          <input
            type="checkbox"
            checked={includesVat}
            onChange={(e) => setIncludesVat(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          {t.includesVat}
        </label>
        <p className="text-xs text-[var(--muted)] leading-relaxed">{t.note}</p>
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
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="rounded-lg border border-[var(--border)] p-3">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.netCost}</div>
            <div className="mt-1 font-semibold tabular-nums">{fmt(netCost)}</div>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-3">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.netPrice}</div>
            <div className="mt-1 font-semibold tabular-nums">{fmt(netPrice)}</div>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-3">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.vatPayable}</div>
            <div className="mt-1 font-semibold tabular-nums">{fmt(vatPayable)}</div>
          </div>
        </div>
        <ShareLink slug="margin-vat" values={{ cost, price, vat, inc: includesVat ? 1 : 0 }} locale={locale} />
      </div>
    </div>
  );
}
