"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  CURRENCIES,
  computeTotals,
  emptyInvoice,
  formatMoney,
  lineAmount,
  type InvoiceData,
} from "@/lib/tools/invoice/model";
import { TEMPLATES, getTemplate } from "@/lib/tools/invoice/templates";
import { Actions } from "./hourly-tool";

const SKU = "tool:invoice";
const STORAGE_KEY = "izn.tools:invoice:draft";
const MAX_LOGO_BYTES = 1024 * 1024; // 1 MB

type DownloadState = "idle" | "working" | "error" | "done";

export function InvoiceTool({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.invoice;
  const tt = dict.tool;

  const [data, setData] = useState<InvoiceData>(emptyInvoice);
  const [state, setState] = useState<DownloadState>("idle");
  const [hydrated, setHydrated] = useState(false);
  const logoInput = useRef<HTMLInputElement>(null);

  // Load any saved draft from the browser once, on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...emptyInvoice(), ...JSON.parse(raw) });
    } catch {
      /* ignore malformed drafts */
    }
    setHydrated(true);
  }, []);

  // Persist the draft locally on every change (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage full or unavailable — non-fatal */
    }
  }, [data, hydrated]);

  const totals = useMemo(() => computeTotals(data), [data]);
  const tpl = getTemplate(data.template);
  const accent = tpl.accent;

  function set<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }
  function setItem(i: number, patch: Partial<InvoiceData["items"][number]>) {
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
  function removeLogo() {
    set("logo", null);
    if (logoInput.current) logoInput.current.value = "";
  }
  function resetDraft() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setData(emptyInvoice());
    setState("idle");
    if (logoInput.current) logoInput.current.value = "";
  }

  async function downloadPdf(unlockToken: string | null) {
    const res = await fetch("/api/pdf/invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, locale, unlockToken }),
    });
    if (!res.ok) throw new Error(`PDF ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${data.number || "draft"}${unlockToken ? "" : "-preview"}.pdf`;
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
      // 1) create checkout -> in the stub this settles instantly and returns a token
      const checkout = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: SKU }),
      }).then((r) => r.json());

      if (checkout.checkoutUrl) {
        // Real providers redirect to a payment page; the webhook grants the unlock.
        window.location.href = checkout.checkoutUrl;
        return;
      }
      // 2) exchange the unlock token for a clean PDF
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
      {/* ---------- Form ---------- */}
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
                onClick={removeLogo}
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

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-[var(--muted)]">{t.template}:</span>
          {TEMPLATES.map((tp) => {
            const active = tp.id === data.template;
            return (
              <button
                key={tp.id}
                type="button"
                onClick={() => set("template", tp.id)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  active
                    ? "border-[var(--foreground)]"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tp.accent }}
                />
                {tp.label[locale]}
              </button>
            );
          })}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <fieldset className="space-y-2">
            <legend className="font-semibold mb-1">{t.from}</legend>
            <input
              className={inputCls}
              placeholder={t.yourName}
              value={data.fromName}
              onChange={(e) => set("fromName", e.target.value)}
            />
            <textarea
              className={inputCls}
              rows={3}
              placeholder={t.yourDetails}
              value={data.fromDetails}
              onChange={(e) => set("fromDetails", e.target.value)}
            />
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="font-semibold mb-1">{t.billTo}</legend>
            <input
              className={inputCls}
              placeholder={t.clientName}
              value={data.toName}
              onChange={(e) => set("toName", e.target.value)}
            />
            <textarea
              className={inputCls}
              rows={3}
              placeholder={t.clientDetails}
              value={data.toDetails}
              onChange={(e) => set("toDetails", e.target.value)}
            />
          </fieldset>
        </div>

        <fieldset>
          <legend className="font-semibold mb-2">{t.invoiceMeta}</legend>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className={labelCls}>{t.number}</label>
              <input
                className={inputCls}
                value={data.number}
                onChange={(e) => set("number", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>{t.date}</label>
              <input
                type="date"
                className={inputCls}
                value={data.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>{t.dueDate}</label>
              <input
                type="date"
                className={inputCls}
                value={data.dueDate}
                onChange={(e) => set("dueDate", e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>{t.currency}</label>
              <select
                className={inputCls}
                value={data.currency}
                onChange={(e) => set("currency", e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <div className="flex items-center justify-between mb-2">
            <legend className="font-semibold">{t.items}</legend>
            <button
              type="button"
              onClick={addItem}
              className="text-sm text-[var(--accent)] hover:underline"
            >
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
                  placeholder={t.qty}
                  value={item.qty}
                  onChange={(e) => setItem(i, { qty: Number(e.target.value) })}
                />
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className={`${inputCls} w-24`}
                  placeholder={t.price}
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
            rows={3}
            placeholder={t.notesPlaceholder}
            value={data.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </div>
      </div>

      {/* ---------- Preview + actions ---------- */}
      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {t.previewTitle}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white text-slate-900 p-6 shadow-sm text-sm">
          {tpl.header === "band" ? (
            <div
              className="flex justify-between items-start mb-6 -mx-6 -mt-6 px-6 pt-6 pb-4 rounded-t-xl"
              style={{ backgroundColor: accent }}
            >
              <div>
                {data.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.logo}
                    alt=""
                    className="h-12 max-w-[160px] object-contain mb-2"
                  />
                ) : null}
                <div className="text-2xl font-bold text-white tracking-wide">
                  {t.docTitle}
                </div>
              </div>
              <div className="text-right text-xs text-white">
                <div className="text-white/70">{t.number}</div>
                <div className="font-semibold mb-1">{data.number || "—"}</div>
                <div className="text-white/70">{t.date}</div>
                <div className="font-semibold">{data.date || "—"}</div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-2">
                <div>
                  {data.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.logo}
                      alt=""
                      className="h-12 max-w-[160px] object-contain mb-2"
                    />
                  ) : null}
                  <div
                    className="text-2xl font-bold tracking-wide"
                    style={{ color: tpl.header === "minimal" ? "#0f172a" : accent }}
                  >
                    {t.docTitle}
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-slate-500">{t.number}</div>
                  <div className="font-semibold mb-1">{data.number || "—"}</div>
                  <div className="text-slate-500">{t.date}</div>
                  <div className="font-semibold">{data.date || "—"}</div>
                </div>
              </div>
              <div
                className="mb-4"
                style={{
                  height: tpl.header === "minimal" ? 2 : 0,
                  backgroundColor: accent,
                }}
              />
            </>
          )}
          <div className="flex justify-between gap-4 mb-6">
            <div className="w-1/2">
              <div className="text-[10px] uppercase text-slate-400">{t.from}</div>
              <div className="font-semibold">{data.fromName || "—"}</div>
              <div className="text-slate-500 whitespace-pre-line text-xs">
                {data.fromDetails}
              </div>
            </div>
            <div className="w-1/2">
              <div className="text-[10px] uppercase text-slate-400">{t.billedTo}</div>
              <div className="font-semibold">{data.toName || "—"}</div>
              <div className="text-slate-500 whitespace-pre-line text-xs">
                {data.toDetails}
              </div>
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
                  <td className="text-right">
                    {formatMoney(lineAmount(item), data.currency)}
                  </td>
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
              <span style={{ color: accent }}>
                {formatMoney(totals.total, data.currency)}
              </span>
            </div>
          </div>
          {data.notes ? (
            <div className="mt-5 pt-3 border-t border-slate-200 text-xs">
              <div className="text-[10px] uppercase text-slate-400">{t.notes}</div>
              <div className="whitespace-pre-line text-slate-600">{data.notes}</div>
            </div>
          ) : null}
        </div>

        {/* Actions */}
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
