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

export function DiscountTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).discount;

  const [price, setPrice] = useState(120);
  const [percent, setPercent] = useState(25);

  useHydrateFromUrl((sp) => {
    setPrice(numParam(sp, "price", price));
    setPercent(numParam(sp, "percent", percent));
  });

  const saved = price * (percent / 100);
  const final = price - saved;

  const num = (v: string) => (v === "" ? 0 : Number(v));
  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="grid grid-cols-2 gap-3 self-start">
        <div>
          <label className={labelCls}>{t.price}</label>
          <input
            type="number"
            step="1"
            className={inputCls}
            value={price}
            onChange={(e) => setPrice(num(e.target.value))}
          />
        </div>
        <div>
          <label className={labelCls}>{t.percent}</label>
          <input
            type="number"
            step="1"
            className={inputCls}
            value={percent}
            onChange={(e) => setPercent(num(e.target.value))}
          />
        </div>
      </div>

      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.final}</div>
            <div className="mt-1 text-2xl font-bold gradient-text tabular-nums">{fmt(final)}</div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.saved}</div>
            <div className="mt-1 text-2xl font-bold text-emerald-500 tabular-nums">{fmt(saved)}</div>
          </div>
        </div>
        <ShareLink slug="discount-calculator" values={{ price, percent }} locale={locale} />
      </div>
    </div>
  );
}
