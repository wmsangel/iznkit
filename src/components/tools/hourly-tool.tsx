"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { computeHourly, emptyHourly, type HourlyData } from "@/lib/tools/hourly/model";
import { FREE_MODE } from "@/lib/payments/mode";
import { DONATE } from "@/lib/donate";

const SKU = "tool:hourly-rate";
const STORAGE_KEY = "izn.tools:hourly:draft";

type DownloadState = "idle" | "working" | "error" | "done";

export function HourlyTool({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.hourly;
  const tt = dict.tool;

  const [data, setData] = useState<HourlyData>(emptyHourly);
  const [state, setState] = useState<DownloadState>("idle");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...emptyHourly(), ...JSON.parse(raw) });
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

  const r = useMemo(() => computeHourly(data), [data]);
  const c = data.currency;
  const m = (v: number) => formatMoney(v, c);

  function set<K extends keyof HourlyData>(key: K, value: HourlyData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function downloadPdf(unlockToken: string | null) {
    const res = await fetch("/api/pdf/hourly", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, locale, unlockToken }),
    });
    if (!res.ok) throw new Error(`PDF ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hourly-rate${unlockToken ? "" : "-preview"}.pdf`;
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

  const money = (key: keyof HourlyData, label: string, step = "1000") => (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        type="number"
        step={step}
        className={inputCls}
        value={data[key] as number}
        onChange={(e) => set(key, Number(e.target.value) as HourlyData[typeof key])}
      />
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <label className={labelCls}>{t.currency}</label>
          <select
            className={`${inputCls} max-w-40`}
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
        <div className="grid grid-cols-2 gap-3">
          {money("desiredIncome", t.desiredIncome)}
          {money("expenses", t.expenses, "500")}
          {money("taxRate", t.taxRate, "1")}
          {money("profitMargin", t.profitMargin, "1")}
          {money("billableHoursPerWeek", t.billableHoursPerWeek, "1")}
          {money("workWeeksPerYear", t.workWeeksPerYear, "1")}
        </div>
      </div>

      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {t.resultsTitle}
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
            {t.hourlyRate}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl font-bold gradient-text">{m(r.hourlyRate)}</span>
            <span className="text-[var(--muted)] text-sm">{t.perHour}</span>
          </div>
          <div className="mt-1 text-sm text-[var(--muted)]">
            {t.dayRate}: <span className="font-semibold text-[var(--foreground)]">{m(r.dayRate)}</span>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm divide-y divide-[var(--border)]">
          <Line label={t.billableHoursPerYear} value={String(r.billableHoursPerYear)} />
          <Line label={t.revenueNeeded} value={m(r.revenueNeeded)} />
          <Line label={t.monthlyRevenue} value={m(r.monthlyRevenue)} />
          <Line label={t.preTaxIncome} value={m(r.preTaxIncome)} />
        </div>

        <Actions t={tt} state={state} price="$3" onFree={onFreePreview} onUnlock={onUnlock} locale={locale} />
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

export function Actions({
  t,
  state,
  price,
  onFree,
  onUnlock,
  locale,
}: {
  t: ReturnType<typeof getDictionary>["tool"];
  state: DownloadState;
  price: string;
  onFree: () => void;
  onUnlock: () => void;
  locale: Locale;
}) {
  // While payments aren't wired up, collapse to a single free download plus a
  // gentle donation ask. The stub already returns a clean, watermark-free PDF.
  if (FREE_MODE) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
        <p className="text-xs text-[var(--muted)]">{t.freeNote}</p>
        <button
          type="button"
          onClick={onUnlock}
          disabled={state === "working"}
          className="btn-primary w-full rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          {state === "working" ? t.generating : t.downloadFree}
        </button>
        {state === "done" ? <p className="text-xs text-[var(--good)]">{t.unlocked}</p> : null}
        {state === "error" ? <p className="text-xs text-[var(--bad)]">{t.error}</p> : null}
        <p className="text-xs text-[var(--muted)] pt-1 border-t border-[var(--border)] mt-1">
          <span className="inline-block pt-3">
            {t.donateNudge}{" "}
            <Link
              href={`/${locale}/${DONATE.path}`}
              className="text-[var(--accent)] font-medium hover:underline"
            >
              {t.donateCta} →
            </Link>
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
      <p className="text-xs text-[var(--muted)]">{t.freePreviewNote}</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={onFree}
          disabled={state === "working"}
          className="btn-outline flex-1 rounded-lg px-4 py-2.5 text-sm font-medium disabled:opacity-50"
        >
          {t.freePreview}
        </button>
        <button
          type="button"
          onClick={onUnlock}
          disabled={state === "working"}
          className="btn-primary flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          {state === "working" ? t.generating : `${t.unlockAndDownload} · ${price}`}
        </button>
      </div>
      {state === "done" ? <p className="text-xs text-[var(--good)]">{t.unlocked}</p> : null}
      {state === "error" ? <p className="text-xs text-[var(--bad)]">{t.error}</p> : null}
    </div>
  );
}
