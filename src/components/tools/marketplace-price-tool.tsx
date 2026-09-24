"use client";

import { useState } from "react";
import Link from "next/link";
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

export function MarketplacePriceTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).mpPrice;

  const [cost, setCost] = useState(900);
  const [commissionPct, setCommissionPct] = useState(17);
  const [logistics, setLogistics] = useState(250);
  const [targetMargin, setTargetMargin] = useState(20);

  useHydrateFromUrl((sp) => {
    setCost(numParam(sp, "cost", cost));
    setCommissionPct(numParam(sp, "com", commissionPct));
    setLogistics(numParam(sp, "log", logistics));
    setTargetMargin(numParam(sp, "mrg", targetMargin));
  });

  const c = commissionPct / 100;
  const m = targetMargin / 100;
  // Solve P − COGS − P·c − logistics = m·P  →  P = (COGS + logistics) / (1 − c − m)
  const denom = 1 - c - m;
  const reachable = denom > 0;
  const price = reachable ? (cost + logistics) / denom : NaN;
  const commission = reachable ? price * c : NaN;
  const profit = reachable ? price * m : NaN;
  const markupPct = reachable && cost !== 0 ? (profit / cost) * 100 : NaN;

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
            <input type="number" step="10" className={inputCls} value={cost} onChange={(e) => setCost(num(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>{t.commissionPct} (%)</label>
            <input type="number" step="0.5" className={inputCls} value={commissionPct} onChange={(e) => setCommissionPct(num(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>{t.logistics}</label>
            <input type="number" step="10" className={inputCls} value={logistics} onChange={(e) => setLogistics(num(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>{t.targetMargin} (%)</label>
            <input type="number" step="1" className={inputCls} value={targetMargin} onChange={(e) => setTargetMargin(num(e.target.value))} />
          </div>
        </div>
        <p className="text-xs text-[var(--muted)] leading-relaxed">{t.note}</p>
        <div className="flex flex-col gap-1">
          <Link href={`/${locale}/tools/marketplace-payout`} className="text-sm font-medium text-[var(--accent)] hover:underline">
            {t.payoutLink}
          </Link>
          <Link href={`/${locale}/tools/unit-economics`} className="text-sm font-medium text-[var(--accent)] hover:underline">
            {t.unitLink}
          </Link>
        </div>
      </div>

      <div className="lg:sticky lg:top-20 self-start space-y-4">
        {reachable ? (
          <>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-center">
              <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.price}</div>
              <div className="mt-1 text-3xl font-bold tabular-nums text-[var(--accent)]">{fmt(price)}</div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.profit}</div>
                <div className="mt-1 text-lg font-bold tabular-nums text-emerald-500">{fmt(profit)}</div>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.commission}</div>
                <div className="mt-1 text-lg font-bold tabular-nums">{fmt(commission)}</div>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.markupPct}</div>
                <div className="mt-1 text-lg font-bold tabular-nums">{pct(markupPct)}</div>
              </div>
            </div>
            <ShareLink slug="marketplace-price" values={{ cost, com: commissionPct, log: logistics, mrg: targetMargin }} locale={locale} />
          </>
        ) : (
          <div className="rounded-xl border border-red-500/60 bg-[var(--card)] p-5 text-sm text-red-500 leading-relaxed">
            {t.impossible}
          </div>
        )}
      </div>
    </div>
  );
}
