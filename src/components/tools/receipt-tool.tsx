"use client";
import { track } from "@/lib/analytics";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { CURRENCIES, formatMoney } from "@/lib/format";
import {
  METHODS,
  emptyReceipt,
  lineAmount,
  receiptTotal,
  type PaymentMethod,
  type ReceiptData,
} from "@/lib/tools/receipt/model";
import { Actions } from "./hourly-tool";
import { DesignPicker } from "./design-picker";
import { getThemeAccent } from "@/lib/design/themes";

const SKU = "tool:receipt";
const STORAGE_KEY = "izn.tools:receipt:draft";
const MAX_LOGO_BYTES = 1024 * 1024;

type DownloadState = "idle" | "working" | "error" | "done";

export function ReceiptTool({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.receipt;
  const tt = dict.tool;

  const [data, setData] = useState<ReceiptData>(emptyReceipt);
  const [state, setState] = useState<DownloadState>("idle");
  const [hydrated, setHydrated] = useState(false);
  const logoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...emptyReceipt(), ...JSON.parse(raw) });
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

  const totals = useMemo(() => receiptTotal(data), [data]);
  const accent = getThemeAccent(data.theme);
  const methodLabels: Record<PaymentMethod, string> = {
    cash: t.methodCash,
    card: t.methodCard,
    transfer: t.methodTransfer,
    other: t.methodOther,
  };

  function set<K extends keyof ReceiptData>(key: K, value: ReceiptData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }
  function setItem(i: number, patch: Partial<ReceiptData["items"][number]>) {
    setData((d) => ({
      ...d,
      items: d.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)),
    }));
  }
  function addItem() {
    setData((d) => ({ ...d, items: [...d.items, { description: "", qty: 1, price: 0 }] }));
  }
  function removeItem(i: number) {
    setData((d) => ({
      ...d,
      items: d.items.length > 1 ? d.items.filter((_, idx) => idx !== i) : d.items,
    }));
  }
  function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > MAX_LOGO_BYTES) {
      setState("error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => set("logo", String(reader.result));
    reader.readAsDataURL(file);
  }
  function resetDraft() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setData(emptyReceipt());
    setState("idle");
    if (logoInput.current) logoInput.current.value = "";
  }

  async function downloadPdf(unlockToken: string | null) {
    const res = await fetch("/api/pdf/receipt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, locale, unlockToken }),
    });
    if (!res.ok) throw new Error(`PDF ${res.status}`);
    const blob = await res.blob();
    track("tool_use", { tool: "receipt", action: "download" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${data.number || "draft"}${unlockToken ? "" : "-preview"}.pdf`;
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

  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Form */}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            {data.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.logo}
                alt={t.logo}
                className="h-10 max-w-[120px] object-contain rounded border border-[var(--border)] bg-white p-1"
              />
            ) : null}
            <label className="text-sm text-[var(--accent)] hover:underline cursor-pointer">
              {data.logo ? t.logo : `+ ${t.uploadLogo}`}
              <input
                ref={logoInput}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={onLogo}
              />
            </label>
            {data.logo ? (
              <button
                type="button"
                onClick={() => {
                  set("logo", null);
                  if (logoInput.current) logoInput.current.value = "";
                }}
                className="text-sm text-[var(--muted)] hover:text-red-500"
              >
                {t.removeLogo}
              </button>
            ) : null}
          </div>
          <button
            type="button"
            onClick={resetDraft}
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ↺ {t.reset}
          </button>
        </div>

        <DesignPicker value={data.theme} onChange={(id) => set("theme", id)} locale={locale} label={tt.design} />

        <div className="grid sm:grid-cols-2 gap-4">
          <fieldset className="space-y-2">
            <legend className="font-semibold mb-1">{t.from}</legend>
            <input
              className={inputCls}
              placeholder={t.fromName}
              value={data.fromName}
              onChange={(e) => set("fromName", e.target.value)}
            />
            <textarea
              className={inputCls}
              rows={2}
              placeholder={t.fromDetails}
              value={data.fromDetails}
              onChange={(e) => set("fromDetails", e.target.value)}
            />
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="font-semibold mb-1">{t.to}</legend>
            <input
              className={inputCls}
              placeholder={t.toName}
              value={data.toName}
              onChange={(e) => set("toName", e.target.value)}
            />
          </fieldset>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className={labelCls}>{t.number}</label>
            <input className={inputCls} value={data.number} onChange={(e) => set("number", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>{t.date}</label>
            <input type="date" className={inputCls} value={data.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>{t.method}</label>
            <select
              className={inputCls}
              value={data.method}
              onChange={(e) => set("method", e.target.value as PaymentMethod)}
            >
              {METHODS.map((mth) => (
                <option key={mth} value={mth}>
                  {methodLabels[mth]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>{t.currency}</label>
            <select className={inputCls} value={data.currency} onChange={(e) => set("currency", e.target.value)}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset>
          <div className="flex items-center justify-between mb-2">
            <legend className="font-semibold">{t.items}</legend>
            <button type="button" onClick={addItem} className="text-sm text-[var(--accent)] hover:underline">
              + {t.addItem}
            </button>
          </div>
          <div className="space-y-2">
            {data.items.map((item, i) => (
              <div key={i} className="flex gap-2 items-start">
                <input
                  className={`${inputCls} flex-1`}
                  placeholder={t.itemDesc}
                  value={item.description}
                  onChange={(e) => setItem(i, { description: e.target.value })}
                />
                <input
                  type="number"
                  min={0}
                  className={`${inputCls} w-16`}
                  value={item.qty}
                  onChange={(e) => setItem(i, { qty: Number(e.target.value) })}
                />
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className={`${inputCls} w-24`}
                  value={item.price}
                  onChange={(e) => setItem(i, { price: Number(e.target.value) })}
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="px-2 py-2 text-[var(--muted)] hover:text-red-500"
                  aria-label={t.remove}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </fieldset>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{t.taxRate}</label>
            <input
              type="number"
              min={0}
              step="0.1"
              className={inputCls}
              value={data.taxRate}
              onChange={(e) => set("taxRate", Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>{t.notes}</label>
          <textarea
            className={inputCls}
            rows={2}
            placeholder={t.notesPlaceholder}
            value={data.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>
      </div>

      {/* Preview + actions */}
      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {t.previewTitle}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white text-slate-900 p-6 shadow-sm text-sm">
          <div className="flex justify-between items-start mb-5">
            <div>
              {data.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.logo} alt="" className="h-10 max-w-[140px] object-contain mb-2" />
              ) : null}
              <div className="text-2xl font-bold tracking-wide" style={{ color: accent }}>{t.docTitle}</div>
              <span className="inline-block mt-1 text-[10px] font-bold tracking-wider text-white bg-emerald-600 px-2 py-0.5 rounded">
                {t.paid}
              </span>
            </div>
            <div className="text-right text-xs">
              <div className="text-slate-500">{t.number}</div>
              <div className="font-semibold mb-1">{data.number || "—"}</div>
              <div className="text-slate-500">{t.date}</div>
              <div className="font-semibold mb-1">{data.date || "—"}</div>
              <div className="text-slate-500">{t.method}</div>
              <div className="font-semibold">{methodLabels[data.method]}</div>
            </div>
          </div>
          <div className="flex justify-between gap-4 mb-5">
            <div className="w-1/2">
              <div className="text-[10px] uppercase text-slate-400">{t.from}</div>
              <div className="font-semibold">{data.fromName || "—"}</div>
              <div className="text-slate-500 whitespace-pre-line text-xs">{data.fromDetails}</div>
            </div>
            <div className="w-1/2">
              <div className="text-[10px] uppercase text-slate-400">{t.to}</div>
              <div className="font-semibold">{data.toName || "—"}</div>
            </div>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-400 border-y border-slate-200">
                <th className="text-left py-1 font-medium">{t.itemDesc}</th>
                <th className="text-right py-1 font-medium">{t.qty}</th>
                <th className="text-right py-1 font-medium">{t.price}</th>
                <th className="text-right py-1 font-medium">{t.amount}</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-1.5">{item.description || "—"}</td>
                  <td className="text-right">{item.qty}</td>
                  <td className="text-right">{formatMoney(item.price, data.currency)}</td>
                  <td className="text-right">{formatMoney(lineAmount(item), data.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 ml-auto w-1/2 space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>{t.subtotal}</span>
              <span>{formatMoney(totals.subtotal, data.currency)}</span>
            </div>
            {data.taxRate ? (
              <div className="flex justify-between text-slate-500">
                <span>
                  {t.tax} ({data.taxRate}%)
                </span>
                <span>{formatMoney(totals.tax, data.currency)}</span>
              </div>
            ) : null}
            <div className="flex justify-between font-bold text-sm border-t-2 border-slate-800 pt-1.5 mt-1.5">
              <span>{t.total}</span>
              <span className="text-emerald-600">{formatMoney(totals.total, data.currency)}</span>
            </div>
          </div>
        </div>

        <Actions t={tt} state={state} price="$2" onFree={onFreePreview} onUnlock={onUnlock} locale={locale} />
      </div>
    </div>
  );
}
