"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { CURRENCIES, formatMoney, round2 } from "@/lib/format";
import { Stat } from "./adroi-tool";
import { useHydrateFromUrl, numParam } from "@/lib/tools/share";
import { ShareLink } from "./share-link";

const QUICK = [10, 15, 18, 20];

export function TipTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).tip;
  const [currency, setCurrency] = useState("USD");
  const [bill, setBill] = useState(60);
  const [pct, setPct] = useState(15);
  const [people, setPeople] = useState(2);

  useHydrateFromUrl((sp) => {
    const c = sp.get("cur");
    if (c) setCurrency(c);
    setBill(numParam(sp, "bill", bill));
    setPct(numParam(sp, "pct", pct));
    setPeople(numParam(sp, "people", people));
  });

  const r = useMemo(() => {
    const tip = round2(bill * (pct / 100));
    const total = round2(bill + tip);
    const per = round2(total / Math.max(1, people));
    return { tip, total, per };
  }, [bill, pct, people]);
  const m = (v: number) => formatMoney(v, currency);

  const inputCls = "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t.currency}</label>
            <select className={inputCls} value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>{t.bill}</label>
            <input type="number" min={0} step="1" className={inputCls} value={bill} onChange={(e) => setBill(Number(e.target.value))} />
          </div>
        </div>
        <div>
          <label className={labelCls}>{t.tipPct}</label>
          <div className="flex gap-2 items-center">
            <input type="number" min={0} step="1" className={`${inputCls} w-24`} value={pct} onChange={(e) => setPct(Number(e.target.value))} />
            <div className="flex gap-1.5">
              {QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setPct(q)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    pct === q ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {q}%
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className={labelCls}>{t.people}</label>
          <input type="number" min={1} step="1" className={`${inputCls} w-24`} value={people} onChange={(e) => setPeople(Number(e.target.value))} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{t.resultsTitle}</div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.perPerson}</div>
          <div className="mt-1 text-4xl font-bold gradient-text">{m(r.per)}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label={t.tipAmount} value={m(r.tip)} />
          <Stat label={t.total} value={m(r.total)} />
        </div>
        <ShareLink
          slug="tip-calculator"
          values={{ cur: currency, bill, pct, people }}
          locale={locale}
        />
      </div>
    </div>
  );
}
