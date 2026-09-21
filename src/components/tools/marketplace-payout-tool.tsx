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

export function MarketplacePayoutTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).mpPayout;

  const [price, setPrice] = useState(2000);
  const [commissionPct, setCommissionPct] = useState(17);
  const [logistics, setLogistics] = useState(250);
  const [otherFees, setOtherFees] = useState(0);

  useHydrateFromUrl((sp) => {
    setPrice(numParam(sp, "price", price));
    setCommissionPct(numParam(sp, "com", commissionPct));
    setLogistics(numParam(sp, "log", logistics));
    setOtherFees(numParam(sp, "fee", otherFees));
  });

  const commission = price * (commissionPct / 100);
  const deductions = commission + logistics + otherFees;
  const payout = price - deductions;
  const takeRate = price !== 0 ? (deductions / price) * 100 : NaN;
  const good = payout >= 0;

  const num = (v: string) => (v === "" ? 0 : Number(v));
  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4 self-start">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t.price}</label>
            <input type="number" step="10" className={inputCls} value={price} onChange={(e) => setPrice(num(e.target.value))} />
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
            <label className={labelCls}>{t.otherFees}</label>
            <input type="number" step="10" className={inputCls} value={otherFees} onChange={(e) => setOtherFees(num(e.target.value))} />
          </div>
        </div>
        <p className="text-xs text-[var(--muted)] leading-relaxed">{t.note}</p>
        <Link
          href={`/${locale}/tools/unit-economics`}
          className="inline-block text-sm font-medium text-[var(--accent)] hover:underline"
        >
          {t.unitLink}
        </Link>
      </div>

      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.payout}</div>
            <div className={`mt-1 text-xl font-bold tabular-nums ${good ? "text-emerald-500" : "text-red-500"}`}>{fmt(payout)}</div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.takeRate}</div>
            <div className="mt-1 text-xl font-bold tabular-nums text-[var(--accent)]">{pct(takeRate)}</div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm divide-y divide-[var(--border)]">
          <div className="flex justify-between py-2 first:pt-0">
            <span className="text-[var(--muted)]">{t.commission}</span>
            <span className="tabular-nums font-medium">{fmt(commission)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[var(--muted)]">{t.logistics}</span>
            <span className="tabular-nums font-medium">{fmt(logistics)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[var(--muted)]">{t.otherFees}</span>
            <span className="tabular-nums font-medium">{fmt(otherFees)}</span>
          </div>
          <div className="flex justify-between py-2 last:pb-0 font-semibold">
            <span>{t.deductions}</span>
            <span className="tabular-nums">{fmt(deductions)}</span>
          </div>
        </div>
        <ShareLink slug="marketplace-payout" values={{ price, com: commissionPct, log: logistics, fee: otherFees }} locale={locale} />
      </div>
    </div>
  );
}
