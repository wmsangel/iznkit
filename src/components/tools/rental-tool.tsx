"use client";
import { track } from "@/lib/analytics";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { CURRENCIES, formatMoney, formatPercent } from "@/lib/format";
import { Actions } from "./hourly-tool";
import {
  computeRental,
  emptyRental,
  type RentalData,
} from "@/lib/tools/rental/model";

const SKU = "tool:rental-yield";
const STORAGE_KEY = "izn.tools:rental:draft";

type DownloadState = "idle" | "working" | "error" | "done";

export function RentalTool({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.rental;
  const tt = dict.tool;

  const [data, setData] = useState<RentalData>(emptyRental);
  const [state, setState] = useState<DownloadState>("idle");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...emptyRental(), ...JSON.parse(raw) });
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

  const r = useMemo(() => computeRental(data), [data]);
  const c = data.currency;
  const m = (v: number) => formatMoney(v, c);

  function set<K extends keyof RentalData>(key: K, value: RentalData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function downloadPdf(unlockToken: string | null) {
    const res = await fetch("/api/pdf/rental", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, locale, unlockToken }),
    });
    if (!res.ok) throw new Error(`PDF ${res.status}`);
    const blob = await res.blob();
    track("tool_use", { tool: "rental-yield", action: "download" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rental-yield${unlockToken ? "" : "-preview"}.pdf`;
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
  const cashPositive = r.monthlyCashFlow >= 0;

  const money = (
    key: keyof RentalData,
    label: string,
    step = "1000",
  ) => (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        type="number"
        step={step}
        className={inputCls}
        value={data[key] as number}
        onChange={(e) => set(key, Number(e.target.value) as RentalData[typeof key])}
      />
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* ---------- Form ---------- */}
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

        <fieldset>
          <legend className="font-semibold mb-2">{t.propertyGroup}</legend>
          <div className="grid grid-cols-2 gap-3">
            {money("price", t.price)}
            {money("purchaseCosts", t.purchaseCosts, "500")}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-semibold mb-2">{t.rentGroup}</legend>
          <div className="grid grid-cols-2 gap-3">
            {money("monthlyRent", t.monthlyRent, "50")}
            {money("vacancyRate", t.vacancyRate, "1")}
            {money("monthlyExpenses", t.monthlyExpenses, "50")}
          </div>
        </fieldset>

        <fieldset>
          <div className="flex items-center gap-2 mb-2">
            <input
              id="useMortgage"
              type="checkbox"
              checked={data.useMortgage}
              onChange={(e) => set("useMortgage", e.target.checked)}
              className="accent-[var(--accent)]"
            />
            <label htmlFor="useMortgage" className="font-semibold cursor-pointer">
              {t.useMortgage}
            </label>
          </div>
          {data.useMortgage ? (
            <div className="grid grid-cols-3 gap-3">
              {money("downPayment", t.downPayment, "1000")}
              {money("interestRate", t.interestRate, "0.1")}
              {money("loanTermYears", t.loanTermYears, "1")}
            </div>
          ) : null}
        </fieldset>
      </div>

      {/* ---------- Results + actions ---------- */}
      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {t.resultsTitle}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat label={t.grossYield} value={formatPercent(r.grossYield)} />
          <Stat label={t.netYield} value={formatPercent(r.netYield)} />
          <Stat
            label={t.monthlyCashFlow}
            value={m(r.monthlyCashFlow)}
            tone={cashPositive ? "good" : "bad"}
          />
          <Stat label={t.cashOnCash} value={formatPercent(r.cashOnCash)} />
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm divide-y divide-[var(--border)]">
          <Line label={t.noi} value={m(r.noi)} />
          <Line label={t.cashInvested} value={m(r.cashInvested)} />
          {data.useMortgage ? (
            <Line label={t.monthlyMortgage} value={m(r.monthlyMortgage)} />
          ) : null}
          <Line label={t.annualCashFlow} value={m(r.annualCashFlow)} />
          <Line
            label={t.payback}
            value={r.paybackYears === null ? t.na : `${r.paybackYears} ${t.years}`}
          />
        </div>

        <Actions
          t={tt}
          state={state}
          price="$3"
          onFree={onFreePreview}
          onUnlock={onUnlock}
          locale={locale}
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good" | "bad";
}) {
  const color =
    tone === "good"
      ? "text-emerald-600"
      : tone === "bad"
        ? "text-red-500"
        : "text-[var(--accent)]";
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
        {label}
      </div>
      <div className={`mt-1 text-xl font-bold ${color}`}>{value}</div>
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
