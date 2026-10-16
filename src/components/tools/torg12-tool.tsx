"use client";

import { useEffect, useMemo, useState } from "react";
import { track } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { computeSfTotals, lineTotal, type VatRate } from "@/lib/tools/torg12/model";
import { emptyTorg12, emptyTorg12Item, type Torg12Data, type Torg12Item } from "@/lib/tools/torg12/model";

const STORAGE_KEY = "izn.tools:torg12:draft";
type DownloadState = "idle" | "working" | "error";

const money = (n: number) =>
  n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function Torg12Tool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).torg12;
  const [data, setData] = useState<Torg12Data>(emptyTorg12);
  const [state, setState] = useState<DownloadState>("idle");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...emptyTorg12(), ...JSON.parse(raw) });
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

  const totals = useMemo(() => computeSfTotals(data), [data]);

  function set<K extends keyof Torg12Data>(key: K, value: Torg12Data[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }
  function setItem(i: number, patch: Partial<Torg12Item>) {
    setData((d) => ({ ...d, items: d.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) }));
  }
  function addItem() {
    setData((d) => ({ ...d, items: [...d.items, emptyTorg12Item()] }));
  }
  function removeItem(i: number) {
    setData((d) => ({ ...d, items: d.items.length > 1 ? d.items.filter((_, idx) => idx !== i) : d.items }));
  }
  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setData(emptyTorg12());
    setState("idle");
  }

  async function download() {
    setState("working");
    try {
      const res = await fetch("/api/pdf/torg12", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, locale }),
      });
      if (!res.ok) throw new Error(`PDF ${res.status}`);
      const blob = await res.blob();
      track("tool_use", { tool: "torg12", action: "download" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `torg12-${data.number || "draft"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setState("idle");
    } catch {
      setState("error");
    }
  }

  const num = (v: string) => (v === "" ? 0 : Number(v));
  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const smallCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-xs outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";
  const field = (key: keyof Torg12Data, label: string) => (
    <div>
      <label className={labelCls}>{label}</label>
      <input className={inputCls} value={data[key] as string} onChange={(e) => set(key, e.target.value as Torg12Data[typeof key])} />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Parties */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">{t.shipperTitle}</h2>
          {field("shipperName", t.shipperName)}
          {field("shipperAddress", t.address)}
          <div className="grid grid-cols-2 gap-3">
            {field("shipperOkpo", t.okpo)}
            {field("supplierName", t.supplier)}
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">{t.consigneeTitle}</h2>
          {field("consigneeName", t.consigneeName)}
          {field("consigneeAddress", t.address)}
          {field("payerName", t.payer)}
        </div>
      </div>

      {/* Doc meta */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {field("number", t.number)}
        {field("date", t.date)}
        {field("basis", t.basis)}
        {field("transportDoc", t.transportDoc)}
        {field("operationType", t.operationType)}
      </div>

      {/* Items */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">{t.itemsTitle}</h2>
        {data.items.map((it, i) => (
          <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 space-y-2">
            <div className="flex items-start gap-2">
              <input className={inputCls} value={it.name} placeholder={t.itemName} onChange={(e) => setItem(i, { name: e.target.value })} />
              <button type="button" onClick={() => removeItem(i)} className="shrink-0 rounded-md border border-[var(--border)] px-2 py-2 text-xs text-[var(--muted)] hover:border-red-500 hover:text-red-500" aria-label={t.remove}>✕</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              <div><label className={labelCls}>{t.qty}</label><input type="number" step="1" className={smallCls} value={it.qty} onChange={(e) => setItem(i, { qty: num(e.target.value) })} /></div>
              <div><label className={labelCls}>{t.unit}</label><input className={smallCls} value={it.unit} onChange={(e) => setItem(i, { unit: e.target.value })} /></div>
              <div><label className={labelCls}>{t.unitCode}</label><input className={smallCls} value={it.unitCode} onChange={(e) => setItem(i, { unitCode: e.target.value })} /></div>
              <div><label className={labelCls}>{t.price}</label><input type="number" step="0.01" className={smallCls} value={it.price} onChange={(e) => setItem(i, { price: num(e.target.value) })} /></div>
              <div>
                <label className={labelCls}>{t.vatRate}</label>
                <select className={smallCls} value={it.vatRate} onChange={(e) => setItem(i, { vatRate: e.target.value as VatRate })}>
                  <option value="20">20%</option>
                  <option value="10">10%</option>
                  <option value="0">0%</option>
                  <option value="none">{t.vatNone}</option>
                </select>
              </div>
              <div><label className={labelCls}>{t.lineTotal}</label><div className="px-2 py-1.5 text-xs font-medium tabular-nums">{money(lineTotal(it))}</div></div>
            </div>
            <details className="text-xs">
              <summary className="cursor-pointer text-[var(--muted)]">{t.more}</summary>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div><label className={labelCls}>{t.code}</label><input className={smallCls} value={it.code} onChange={(e) => setItem(i, { code: e.target.value })} /></div>
                <div><label className={labelCls}>{t.pkgType}</label><input className={smallCls} value={it.pkgType} onChange={(e) => setItem(i, { pkgType: e.target.value })} /></div>
                <div><label className={labelCls}>{t.perPlace}</label><input className={smallCls} value={it.perPlace} onChange={(e) => setItem(i, { perPlace: e.target.value })} /></div>
                <div><label className={labelCls}>{t.places}</label><input className={smallCls} value={it.places} onChange={(e) => setItem(i, { places: e.target.value })} /></div>
                <div><label className={labelCls}>{t.grossMass}</label><input className={smallCls} value={it.grossMass} onChange={(e) => setItem(i, { grossMass: e.target.value })} /></div>
              </div>
            </details>
          </div>
        ))}
        <button type="button" onClick={addItem} className="rounded-md border border-dashed border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]">+ {t.addItem}</button>
      </div>

      {/* Cargo summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {field("appendixSheets", t.appendixSheets)}
        {field("totalPlaces", t.totalPlaces)}
        {field("totalNetMass", t.totalNetMass)}
        {field("totalGrossMass", t.totalGrossMass)}
      </div>

      {/* Signatures */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">{t.releaseTitle}</h2>
          <div className="grid grid-cols-2 gap-3">
            {field("releaseAllowedPos", t.position)}
            {field("releaseAllowedName", t.personName)}
          </div>
          {field("accountantName", t.accountant)}
          <div className="grid grid-cols-2 gap-3">
            {field("releasedByPos", t.releasedByPos)}
            {field("releasedByName", t.personName)}
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">{t.receiveTitle}</h2>
          <div className="grid grid-cols-2 gap-3">
            {field("receivedByPos", t.position)}
            {field("receivedByName", t.personName)}
          </div>
          {field("proxyInfo", t.proxy)}
        </div>
      </div>

      {/* Totals + actions */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-2">
        <div className="flex justify-between text-sm"><span className="text-[var(--muted)]">{t.totalBase}</span><span className="tabular-nums font-medium">{money(totals.base)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-[var(--muted)]">{t.totalVat}</span><span className="tabular-nums font-medium">{money(totals.vat)}</span></div>
        <div className="flex justify-between text-base font-semibold border-t border-[var(--border)] pt-2"><span>{t.totalPay}</span><span className="tabular-nums text-[var(--accent)]">{money(totals.total)} ₽</span></div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={download} disabled={state === "working"} className="rounded-lg bg-[var(--accent)] text-[var(--accent-fg)] px-5 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-60">
          {state === "working" ? t.working : t.download}
        </button>
        <button type="button" onClick={reset} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">{t.reset}</button>
        {state === "error" ? <span className="text-sm text-red-500">{t.error}</span> : null}
      </div>

      <p className="text-xs text-[var(--muted)] leading-relaxed">{t.disclaimer}</p>
    </div>
  );
}
