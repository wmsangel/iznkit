"use client";

import { useState, useMemo } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useHydrateFromUrl, numParam } from "@/lib/tools/share";
import { ShareLink } from "./share-link";

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return Math.round(n).toLocaleString("en-US");
}

export function CompoundTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).compound;

  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(10);
  const [n, setN] = useState(12); // compounds per year
  const [monthly, setMonthly] = useState(200);
  const [gran, setGran] = useState<"month" | "year">("month");

  useHydrateFromUrl((sp) => {
    setPrincipal(numParam(sp, "principal", principal));
    setRate(numParam(sp, "rate", rate));
    setYears(numParam(sp, "years", years));
    setN(numParam(sp, "n", n));
    setMonthly(numParam(sp, "monthly", monthly));
  });

  const r = rate / 100;
  const fvPrincipal = principal * Math.pow(1 + r / n, n * years);
  // effective monthly rate implied by the compounding frequency
  const im = Math.pow(1 + r / n, n / 12) - 1;
  const months = 12 * years;
  const fvDeposits =
    monthly === 0
      ? 0
      : im === 0
        ? monthly * months
        : monthly * ((Math.pow(1 + im, months) - 1) / im);

  const futureValue = fvPrincipal + fvDeposits;
  const totalContributions = principal + monthly * months;
  const totalInterest = futureValue - totalContributions;

  // Period-by-period schedule, iterated so it reconciles with the closed-form
  // future value: balance = balance·(1+im) + deposit each month. Cumulative
  // interest per row = balance − deposited. Capped so the table never explodes.
  const schedule = useMemo(() => {
    const rows: { label: number; deposited: number; interest: number; balance: number }[] = [];
    const totalMonths = Math.max(0, Math.min(months, 1200));
    let balance = principal;
    for (let m = 1; m <= totalMonths; m++) {
      balance = balance * (1 + im) + monthly;
      if (gran === "month" || m % 12 === 0) {
        const deposited = principal + monthly * m;
        rows.push({
          label: gran === "month" ? m : m / 12,
          deposited,
          interest: balance - deposited,
          balance,
        });
      }
    }
    return rows;
  }, [principal, monthly, im, months, gran]);

  const num = (v: string) => (v === "" ? 0 : Number(v));
  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";

  const FREQS: { value: number; label: string }[] = [
    { value: 1, label: t.annually },
    { value: 2, label: t.semiannually },
    { value: 4, label: t.quarterly },
    { value: 12, label: t.monthlyFreq },
    { value: 365, label: t.daily },
  ];

  const tabCls = (active: boolean) =>
    `rounded-md px-3 py-1 text-sm font-medium transition-colors ${
      active ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
    }`;

  return (
    <div className="space-y-10">
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t.principal}</label>
            <input type="number" step="100" className={inputCls} value={principal} onChange={(e) => setPrincipal(num(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>{t.monthly}</label>
            <input type="number" step="10" className={inputCls} value={monthly} onChange={(e) => setMonthly(num(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>{t.rate}</label>
            <input type="number" step="0.1" className={inputCls} value={rate} onChange={(e) => setRate(num(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>{t.years}</label>
            <input type="number" step="1" className={inputCls} value={years} onChange={(e) => setYears(num(e.target.value))} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>{t.frequency}</label>
            <select className={inputCls} value={n} onChange={(e) => setN(Number(e.target.value))}>
              {FREQS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">{t.futureValue}</div>
          <div className="mt-1 text-3xl font-bold gradient-text tabular-nums">{fmt(futureValue)}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.totalContributions}</div>
            <div className="mt-1 text-lg font-bold tabular-nums">{fmt(totalContributions)}</div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.totalInterest}</div>
            <div className="mt-1 text-lg font-bold text-emerald-500 tabular-nums">{fmt(totalInterest)}</div>
          </div>
        </div>
        <ShareLink
          slug="compound-interest"
          values={{ principal, rate, years, n, monthly }}
          locale={locale}
        />
      </div>
    </div>

    <section>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-lg font-semibold">{t.scheduleTitle}</h2>
        <div className="flex gap-1 rounded-lg border border-[var(--border)] p-1">
          <button type="button" className={tabCls(gran === "month")} onClick={() => setGran("month")}>
            {t.byMonth}
          </button>
          <button type="button" className={tabCls(gran === "year")} onClick={() => setGran("year")}>
            {t.byYear}
          </button>
        </div>
      </div>
      <div className="mt-4 max-h-96 overflow-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-[var(--card-2)]">
            <tr className="text-left border-b border-[var(--border)]">
              <th className="px-4 py-2.5 font-semibold">{gran === "month" ? t.colMonth : t.colYear}</th>
              <th className="px-4 py-2.5 font-semibold text-right">{t.colDeposited}</th>
              <th className="px-4 py-2.5 font-semibold text-right">{t.colInterest}</th>
              <th className="px-4 py-2.5 font-semibold text-right">{t.colBalance}</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row) => (
              <tr key={row.label} className="border-b border-[var(--border)] last:border-0">
                <td className="px-4 py-2 tabular-nums text-[var(--muted)]">{row.label}</td>
                <td className="px-4 py-2 tabular-nums text-right">{fmt(row.deposited)}</td>
                <td className="px-4 py-2 tabular-nums text-right text-emerald-500">{fmt(row.interest)}</td>
                <td className="px-4 py-2 tabular-nums text-right font-medium">{fmt(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
    </div>
  );
}
