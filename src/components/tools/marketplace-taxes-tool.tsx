"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useHydrateFromUrl, numParam } from "@/lib/tools/share";
import { useToolUsed } from "@/lib/tools/use-tool-used";
import { ShareLink } from "./share-link";

// Russian tax regimes for marketplace sellers, 2026.
// Federal baselines; УСН rates are regionally variable, so they're editable.
// This is an estimate, not tax advice — see the on-page notes.
const USN_MIN = 0.01; // минимальный налог УСН «Доходы−Расходы» — 1% от дохода
const AUSN_INCOME_RATE = 8; // АУСН «Доходы» — 8%
const AUSN_PROFIT_RATE = 20; // АУСН «Доходы−Расходы» — 20%
const AUSN_MIN = 0.03; // минимальный налог АУСН «Доходы−Расходы» — 3% от дохода
const NPD_LIMIT = 2_400_000; // лимит дохода НПД — 2,4 млн ₽/год
const VAT_THRESHOLD = 20_000_000; // ориентир порога НДС на УСН с 2026

type Row = { key: string; name: string; tax: number; note?: string; disabled?: boolean };

export function MarketplaceTaxesTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).mpTax;
  const markUsed = useToolUsed("marketplace-taxes");

  const [income, setIncome] = useState(5_000_000);
  const [expenses, setExpenses] = useState(3_000_000);
  const [contributions, setContributions] = useState(0);
  const [usnIncomeRate, setUsnIncomeRate] = useState(6);
  const [usnProfitRate, setUsnProfitRate] = useState(15);
  const [npdRate, setNpdRate] = useState(4);

  useHydrateFromUrl((sp) => {
    setIncome(numParam(sp, "inc", income));
    setExpenses(numParam(sp, "exp", expenses));
    setContributions(numParam(sp, "con", contributions));
    setUsnIncomeRate(numParam(sp, "ur", usnIncomeRate));
    setUsnProfitRate(numParam(sp, "pr", usnProfitRate));
    setNpdRate(numParam(sp, "npd", npdRate));
  });

  const base = Math.max(income - expenses, 0);

  const usnIncomeTax = Math.max(income * (usnIncomeRate / 100) - contributions, 0);
  const usnProfitTax = Math.max(base * (usnProfitRate / 100), income * USN_MIN);
  const ausnIncomeTax = income * (AUSN_INCOME_RATE / 100);
  const ausnProfitTax = Math.max(base * (AUSN_PROFIT_RATE / 100), income * AUSN_MIN);
  const npdTax = income * (npdRate / 100);
  const npdOverLimit = income > NPD_LIMIT;

  const rows: Row[] = [
    { key: "usnIncome", name: t.usnIncome, tax: usnIncomeTax },
    { key: "usnProfit", name: t.usnProfit, tax: usnProfitTax },
    { key: "ausnIncome", name: t.ausnIncome, tax: ausnIncomeTax },
    { key: "ausnProfit", name: t.ausnProfit, tax: ausnProfitTax },
    { key: "npd", name: t.npd, tax: npdTax, note: npdOverLimit ? t.npdOverLimit : undefined, disabled: npdOverLimit },
  ];

  const eligible = rows.filter((r) => !r.disabled);
  const bestTax = eligible.length ? Math.min(...eligible.map((r) => r.tax)) : NaN;

  const num = (v: string) => (v === "" ? 0 : Number(v));
  const fmt = (n: number) =>
    !Number.isFinite(n) ? "—" : `${Math.round(n).toLocaleString("ru-RU")} ₽`;
  const pct = (n: number) =>
    !Number.isFinite(n) ? "—" : `${n.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%`;

  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";
  const tabBtn = (active: boolean) =>
    `flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
    }`;

  return (
    <div className="grid lg:grid-cols-2 gap-8" onInput={markUsed}>
      <div className="space-y-4 self-start">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t.income}</label>
            <input type="number" step="50000" className={inputCls} value={income} onChange={(e) => setIncome(num(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>{t.expenses}</label>
            <input type="number" step="50000" className={inputCls} value={expenses} onChange={(e) => setExpenses(num(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>{t.usnIncomeRate} (%)</label>
            <input type="number" step="0.5" className={inputCls} value={usnIncomeRate} onChange={(e) => setUsnIncomeRate(num(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>{t.usnProfitRate} (%)</label>
            <input type="number" step="0.5" className={inputCls} value={usnProfitRate} onChange={(e) => setUsnProfitRate(num(e.target.value))} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>{t.contributions}</label>
            <input type="number" step="1000" className={inputCls} value={contributions} onChange={(e) => setContributions(num(e.target.value))} />
            <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">{t.contribHint}</p>
          </div>
        </div>

        <div>
          <label className={labelCls}>{t.npdRateLabel}</label>
          <div className="flex gap-1 rounded-lg border border-[var(--border)] p-1 max-w-80">
            <button type="button" className={tabBtn(npdRate === 4)} onClick={() => setNpdRate(4)}>{t.npd4}</button>
            <button type="button" className={tabBtn(npdRate === 6)} onClick={() => setNpdRate(6)}>{t.npd6}</button>
          </div>
        </div>

        <p className="text-xs text-[var(--muted)] leading-relaxed">{t.npdResaleNote}</p>
      </div>

      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{t.resultsTitle}</div>
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[var(--muted)]">
                <th className="px-4 py-2 font-medium">{t.colRegime}</th>
                <th className="px-4 py-2 font-medium text-right">{t.colTax}</th>
                <th className="px-4 py-2 font-medium text-right">{t.colEff}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {rows.map((r) => {
                const isBest = !r.disabled && r.tax === bestTax;
                return (
                  <tr key={r.key} className={isBest ? "bg-[var(--accent-soft)]" : ""}>
                    <td className="px-4 py-2.5">
                      <span className={r.disabled ? "text-[var(--muted)] line-through" : "font-medium"}>{r.name}</span>
                      {isBest ? <span className="ml-2 text-xs font-semibold text-[var(--accent)]">{t.best}</span> : null}
                      {r.note ? <div className="text-xs text-red-500 mt-0.5">{r.note}</div> : null}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{r.disabled ? "—" : fmt(r.tax)}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums text-[var(--muted)]">
                      {r.disabled || income <= 0 ? "—" : pct((r.tax / income) * 100)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {income > VAT_THRESHOLD ? (
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs leading-relaxed text-[var(--foreground)]">
            {t.vatNote}
          </div>
        ) : null}

        <p className="text-xs text-[var(--muted)] leading-relaxed">{t.disclaimer}</p>

        <ShareLink
          slug="marketplace-taxes"
          values={{ inc: income, exp: expenses, con: contributions, ur: usnIncomeRate, pr: usnProfitRate, npd: npdRate }}
          locale={locale}
        />
      </div>
    </div>
  );
}
