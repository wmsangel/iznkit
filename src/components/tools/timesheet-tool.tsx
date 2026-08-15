"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { CURRENCIES, formatMoney } from "@/lib/format";
import { emptyTimesheet, timesheetTotals, type TimesheetData } from "@/lib/tools/timesheet/model";
import { Actions } from "./hourly-tool";

const SKU = "tool:timesheet";
const STORAGE_KEY = "izn.tools:timesheet:draft";
type DownloadState = "idle" | "working" | "error" | "done";

export function TimesheetTool({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.timesheet;
  const tt = dict.tool;
  const [data, setData] = useState<TimesheetData>(emptyTimesheet);
  const [state, setState] = useState<DownloadState>("idle");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...emptyTimesheet(), ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data, hydrated]);

  const totals = useMemo(() => timesheetTotals(data), [data]);
  const hasRate = (Number(data.hourlyRate) || 0) > 0;
  function set<K extends keyof TimesheetData>(key: K, value: TimesheetData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }
  function setEntry(i: number, patch: Partial<TimesheetData["entries"][number]>) {
    setData((d) => ({ ...d, entries: d.entries.map((e, idx) => (idx === i ? { ...e, ...patch } : e)) }));
  }
  function addEntry() {
    setData((d) => ({ ...d, entries: [...d.entries, { date: new Date().toISOString().slice(0, 10), hours: 8, note: "" }] }));
  }
  function removeEntry(i: number) {
    setData((d) => ({ ...d, entries: d.entries.length > 1 ? d.entries.filter((_, idx) => idx !== i) : d.entries }));
  }

  async function downloadPdf(unlockToken: string | null) {
    const res = await fetch("/api/pdf/timesheet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, locale, unlockToken }),
    });
    if (!res.ok) throw new Error(`PDF ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `timesheet${unlockToken ? "" : "-preview"}.pdf`;
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
      }).then((r) => r.json());
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

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t.workerName}</label>
            <input className={inputCls} value={data.workerName} onChange={(e) => set("workerName", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>{t.project}</label>
            <input className={inputCls} value={data.project} onChange={(e) => set("project", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>{t.period}</label>
            <input className={inputCls} placeholder={t.periodPlaceholder} value={data.period} onChange={(e) => set("period", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>{t.currency}</label>
              <select className={inputCls} value={data.currency} onChange={(e) => set("currency", e.target.value)}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>{t.hourlyRate}</label>
              <input type="number" min={0} step="1" className={inputCls} value={data.hourlyRate} onChange={(e) => set("hourlyRate", Number(e.target.value))} />
            </div>
          </div>
        </div>

        <fieldset>
          <div className="flex items-center justify-between mb-2">
            <legend className="font-semibold">{t.entries}</legend>
            <button type="button" onClick={addEntry} className="text-sm text-[var(--accent)] hover:underline">+ {t.addEntry}</button>
          </div>
          <div className="space-y-2">
            {data.entries.map((e, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input type="date" className={`${inputCls} w-36`} value={e.date} onChange={(ev) => setEntry(i, { date: ev.target.value })} />
                <input type="number" min={0} step="0.25" className={`${inputCls} w-20`} value={e.hours} onChange={(ev) => setEntry(i, { hours: Number(ev.target.value) })} />
                <input className={`${inputCls} flex-1`} placeholder={t.notePlaceholder} value={e.note} onChange={(ev) => setEntry(i, { note: ev.target.value })} />
                <button type="button" onClick={() => removeEntry(i)} className="px-2 py-2 text-[var(--muted)] hover:text-red-500" aria-label={t.remove}>✕</button>
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{t.previewTitle}</div>
        <div className="rounded-xl border border-[var(--border)] bg-white text-slate-900 p-6 shadow-sm text-sm">
          <div className="text-xl font-bold text-[var(--accent)] tracking-wide mb-3">{t.docTitle}</div>
          <div className="flex justify-between text-xs mb-3">
            <div>
              <div className="text-slate-500">{t.workerName}: <span className="text-slate-800 font-semibold">{data.workerName || "—"}</span></div>
              <div className="text-slate-500">{t.project}: <span className="text-slate-800 font-semibold">{data.project || "—"}</span></div>
            </div>
            <div className="text-right text-slate-500">{t.period}<br /><span className="text-slate-800 font-semibold">{data.period || "—"}</span></div>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-400 border-y border-slate-200">
                <th className="text-left py-1 font-medium">{t.date}</th>
                <th className="text-right py-1 font-medium">{t.hours}</th>
                <th className="text-left py-1 font-medium pl-3">{t.note}</th>
              </tr>
            </thead>
            <tbody>
              {data.entries.map((e, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-1.5">{e.date || "—"}</td>
                  <td className="text-right">{e.hours}</td>
                  <td className="pl-3 text-slate-600">{e.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 ml-auto w-1/2 space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>{t.totalHours}</span>
              <span className="font-semibold text-slate-800">{totals.totalHours}</span>
            </div>
            {hasRate ? (
              <div className="flex justify-between font-bold text-sm border-t-2 border-slate-800 pt-1.5 mt-1.5">
                <span>{t.totalPay}</span>
                <span className="text-[var(--accent)]">{formatMoney(totals.totalPay, data.currency)}</span>
              </div>
            ) : null}
          </div>
        </div>
        <Actions t={tt} state={state} price="$3" onFree={onFreePreview} onUnlock={onUnlock} locale={locale} />
      </div>
    </div>
  );
}
