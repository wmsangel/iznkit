"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { CURRENCIES, formatMoney, formatPercent } from "@/lib/format";
import { computeAdRoi, emptyAdRoi, type AdRoiData } from "@/lib/tools/adroi/model";
import { Actions } from "./hourly-tool";

const SKU = "tool:ad-roi";
const STORAGE_KEY = "izn.tools:adroi:draft";
type DownloadState = "idle" | "working" | "error" | "done";

export function AdRoiTool({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.adroi;
  const tt = dict.tool;
  const [data, setData] = useState<AdRoiData>(emptyAdRoi);
  const [state, setState] = useState<DownloadState>("idle");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...emptyAdRoi(), ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data, hydrated]);

  const r = useMemo(() => computeAdRoi(data), [data]);
  const c = data.currency;
  const m = (v: number) => formatMoney(v, c);
  function set<K extends keyof AdRoiData>(key: K, value: AdRoiData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function downloadPdf(unlockToken: string | null) {
    const res = await fetch("/api/pdf/adroi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, locale, unlockToken }),
    });
    if (!res.ok) throw new Error(`PDF ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ad-roi${unlockToken ? "" : "-preview"}.pdf`;
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
  const money = (key: keyof AdRoiData, label: string, step = "100") => (
    <div>
      <label className={labelCls}>{label}</label>
      <input type="number" step={step} className={inputCls} value={data[key] as number} onChange={(e) => set(key, Number(e.target.value) as AdRoiData[typeof key])} />
    </div>
  );
  const roiPositive = r.netProfit >= 0;

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <label className={labelCls}>{t.currency}</label>
          <select className={`${inputCls} max-w-40`} value={data.currency} onChange={(e) => set("currency", e.target.value)}>
            {CURRENCIES.map((cur) => <option key={cur} value={cur}>{cur}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {money("adSpend", t.adSpend)}
          {money("revenue", t.revenue)}
          {money("grossMargin", t.grossMargin, "1")}
          {money("otherCosts", t.otherCosts, "50")}
        </div>
      </div>
      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{t.resultsTitle}</div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label={t.roas} value={`${r.roas}×`} />
          <Stat label={t.roi} value={formatPercent(r.roi)} tone={roiPositive ? "good" : "bad"} />
          <Stat label={t.netProfit} value={m(r.netProfit)} tone={roiPositive ? "good" : "bad"} />
          <Stat label={t.breakEvenRoas} value={`${r.breakEvenRoas}×`} />
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm divide-y divide-[var(--border)]">
          <Line label={t.grossProfit} value={m(r.grossProfit)} />
          <Line label={t.netProfit} value={m(r.netProfit)} />
        </div>
        <Actions t={tt} state={state} price="$3" onFree={onFreePreview} onUnlock={onUnlock} locale={locale} />
      </div>
    </div>
  );
}

export function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
  const color = tone === "good" ? "text-emerald-500" : tone === "bad" ? "text-red-500" : "text-[var(--accent)]";
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="text-[10px] uppercase tracking-wide text-[var(--muted)] truncate">{label}</div>
      <div className={`mt-1 text-xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

export function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
