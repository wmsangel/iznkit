"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { CURRENCIES, formatMoney, round2 } from "@/lib/format";
import { Stat, Line } from "./adroi-tool";

export function LoanTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).loan;
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState(20000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(5);

  const r = useMemo(() => {
    const n = Math.max(1, Math.round(years * 12));
    const i = rate / 100 / 12;
    const monthly = i === 0 ? amount / n : (amount * i) / (1 - Math.pow(1 + i, -n));
    const totalPaid = round2(monthly * n);
    return {
      monthly: round2(monthly),
      totalPaid,
      totalInterest: round2(totalPaid - amount),
    };
  }, [amount, rate, years]);
  const m = (v: number) => formatMoney(v, currency);

  const inputCls = "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div>
          <label className={labelCls}>{t.currency}</label>
          <select className={`${inputCls} max-w-40`} value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>{t.amount}</label>
          <input type="number" min={0} step="1000" className={inputCls} value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t.rate}</label>
            <input type="number" min={0} step="0.1" className={inputCls} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>{t.termYears}</label>
            <input type="number" min={1} step="1" className={inputCls} value={years} onChange={(e) => setYears(Number(e.target.value))} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{t.resultsTitle}</div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.monthlyPayment}</div>
          <div className="mt-1 text-4xl font-bold gradient-text">{m(r.monthly)}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label={t.totalInterest} value={m(r.totalInterest)} />
          <Stat label={t.totalPaid} value={m(r.totalPaid)} />
        </div>
      </div>
    </div>
  );
}
