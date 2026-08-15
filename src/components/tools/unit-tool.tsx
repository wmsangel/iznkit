"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { CURRENCIES, formatMoney, formatPercent } from "@/lib/format";
import { computeUnit, emptyUnit, type UnitData } from "@/lib/tools/unit/model";
import { Actions } from "./hourly-tool";
import { Stat, Line } from "./adroi-tool";

const SKU = "tool:unit-economics";
const STORAGE_KEY = "izn.tools:unit:draft";
type DownloadState = "idle" | "working" | "error" | "done";

export function UnitTool({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.unit;
  const tt = dict.tool;
  const [data, setData] = useState<UnitData>(emptyUnit);
  const [state, setState] = useState<DownloadState>("idle");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...emptyUnit(), ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data, hydrated]);

  const r = useMemo(() => computeUnit(data), [data]);
  const c = data.currency;
  const m = (v: number) => formatMoney(v, c);
  function set<K extends keyof UnitData>(key: K, value: UnitData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function downloadPdf(unlockToken: string | null) {
    const res = await fetch("/api/pdf/unit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, locale, unlockToken }),
    });
    if (!res.ok) throw new Error(`PDF ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `unit-economics${unlockToken ? "" : "-preview"}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
  async function onFreePreview() {
    setState("working");
    try {
      await downloadPdf(null);
      setState("idle");
    } catch {
      setState("error");
    }
  }
  async function onUnlock() {
    setState("working");
    try {
      const checkout = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: SKU }),
      }).then((res) => res.json());
      if (checkout.checkoutUrl) {
        window.location.href = checkout.checkoutUrl;
        return;
      }
      await downloadPdf(checkout.unlockToken);
      setState("done");
    } catch {
      setState("error");
    }
  }

  const inputCls = "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";
  const money = (key: keyof UnitData, label: string, step = "10") => (
    <div>
      <label className={labelCls}>{label}</label>
      <input type="number" step={step} className={inputCls} value={data[key] as number} onChange={(e) => set(key, Number(e.target.value) as UnitData[typeof key])} />
    </div>
  );
  const profitPositive = r.profit >= 0;

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <label className={labelCls}>{t.currency}</label>
          <select className={`${inputCls} max-w-40`} value={data.currency} onChange={(e) => set("currency", e.target.value)}>
            {CURRENCIES.map((cur) => <option key={cur} value={cur}>{cur}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {money("sellPrice", t.sellPrice)}
          {money("cogs", t.cogs)}
          {money("commissionPct", t.commissionPct, "0.5")}
          {money("logistics", t.logistics)}
          {money("packaging", t.packaging, "5")}
          {money("otherFees", t.otherFees, "5")}
          {money("adPerUnit", t.adPerUnit, "5")}
          {money("taxPct", t.taxPct, "0.5")}
          {money("returnRate", t.returnRate, "1")}
        </div>
      </div>
      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{t.resultsTitle}</div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label={t.profit} value={m(r.profit)} tone={profitPositive ? "good" : "bad"} />
          <Stat label={t.margin} value={formatPercent(r.margin)} />
          <Stat label={t.roi} value={formatPercent(r.roi)} />
          <Stat label={t.adjustedProfit} value={m(r.adjustedProfit)} tone={r.adjustedProfit >= 0 ? "good" : "bad"} />
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm divide-y divide-[var(--border)]">
          <Line label={t.commission} value={m(r.commission)} />
          <Line label={t.tax} value={m(r.tax)} />
          <Line label={t.totalCosts} value={m(r.totalCosts)} />
          <Line label={t.breakEvenPrice} value={m(r.breakEvenPrice)} />
        </div>
        <Actions t={tt} state={state} price="$5" onFree={onFreePreview} onUnlock={onUnlock} locale={locale} />
      </div>
    </div>
  );
}
