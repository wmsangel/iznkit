"use client";
import { track } from "@/lib/analytics";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { CURRENCIES, formatMoney, formatPercent } from "@/lib/format";
import {
  TAX_PRESETS,
  computeTax,
  emptyTax,
  type TaxData,
} from "@/lib/tools/tax/model";
import { Actions } from "./hourly-tool";

const SKU = "tool:self-employed-tax";
const STORAGE_KEY = "izn.tools:tax:draft";

type DownloadState = "idle" | "working" | "error" | "done";

export function TaxTool({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.tax;
  const tt = dict.tool;

  const [data, setData] = useState<TaxData>(emptyTax);
  const [state, setState] = useState<DownloadState>("idle");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...emptyTax(), ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data, hydrated]);

  const r = useMemo(() => computeTax(data), [data]);
  const c = data.currency;
  const m = (v: number) => formatMoney(v, c);

  const presetLabel: Record<string, string> = {
    npd4: t.presetNpd4,
    npd6: t.presetNpd6,
    usn6: t.presetUsn6,
    usn15: t.presetUsn15,
    flat13: t.presetFlat13,
  };
  const activePreset = TAX_PRESETS.find(
    (p) => p.rate === data.taxRate && p.deduct === data.deductExpenses,
  )?.id;

  function set<K extends keyof TaxData>(key: K, value: TaxData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function downloadPdf(unlockToken: string | null) {
    const res = await fetch("/api/pdf/tax", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, locale, unlockToken }),
    });
    if (!res.ok) throw new Error(`PDF ${res.status}`);
    const blob = await res.blob();
    track("tool_use", { tool: "self-employed-tax", action: "download" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `freelance-tax${unlockToken ? "" : "-preview"}.pdf`;
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

  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <div>
            <label className={labelCls}>{t.currency}</label>
            <select
              className={`${inputCls} w-28`}
              value={data.currency}
              onChange={(e) => set("currency", e.target.value)}
            >
              {CURRENCIES.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>{t.period}</label>
            <div className="flex rounded-md border border-[var(--border)] overflow-hidden text-sm">
              {(["month", "year"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => set("period", p)}
                  className={`px-3 py-2 ${
                    data.period === p
                      ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                      : "text-[var(--muted)]"
                  }`}
                >
                  {p === "month" ? t.month : t.year}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className={labelCls}>{t.regime}</label>
          <div className="flex flex-wrap gap-2">
            {TAX_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setData((d) => ({ ...d, taxRate: p.rate, deductExpenses: p.deduct }))}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  activePreset === p.id
                    ? "border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-soft)]"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {presetLabel[p.id]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t.income}</label>
            <input
              type="number"
              step="1000"
              className={inputCls}
              value={data.income}
              onChange={(e) => set("income", Number(e.target.value))}
            />
          </div>
          <div>
            <label className={labelCls}>{t.expenses}</label>
            <input
              type="number"
              step="1000"
              className={inputCls}
              value={data.expenses}
              onChange={(e) => set("expenses", Number(e.target.value))}
            />
          </div>
          <div>
            <label className={labelCls}>{t.taxRate}</label>
            <input
              type="number"
              step="0.5"
              className={inputCls}
              value={data.taxRate}
              onChange={(e) => set("taxRate", Number(e.target.value))}
            />
          </div>
          <label className="flex items-end gap-2 pb-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={data.deductExpenses}
              onChange={(e) => set("deductExpenses", e.target.checked)}
              className="accent-[var(--accent)] mb-0.5"
            />
            {t.deductExpenses}
          </label>
        </div>
      </div>

      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {t.resultsTitle}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Stat label={t.taxLabel} value={m(r.tax)} />
          <Stat label={t.takeHome} value={m(r.takeHome)} tone="good" />
          <Stat label={t.effectiveRate} value={formatPercent(r.effectiveRate)} />
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm divide-y divide-[var(--border)]">
          <Line label={t.base} value={m(r.base)} />
          <Line label={t.afterTax} value={m(r.afterTax)} />
        </div>
        <Actions t={tt} state={state} price="$3" onFree={onFreePreview} onUnlock={onUnlock} locale={locale} />
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "good" }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="text-[10px] uppercase tracking-wide text-[var(--muted)] truncate">
        {label}
      </div>
      <div
        className={`mt-1 text-lg font-bold ${
          tone === "good" ? "text-emerald-500" : "text-[var(--accent)]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
