"use client";

import { useEffect, useMemo, useState } from "react";
import { track } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  computeSfTotals,
  emptySfItem,
  lineTotal,
  type SfItem,
  type VatRate,
} from "@/lib/tools/upd/model";
import { emptyUpd, type UpdData, type UpdStatus } from "@/lib/tools/upd/model";

const STORAGE_KEY = "izn.tools:upd:draft";
type DownloadState = "idle" | "working" | "error";

const money = (n: number) =>
  n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function UpdTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).sf; // shared form labels (seller/buyer/items/signatures)
  const u = getDictionary(locale).upd; // УПД-specific labels
  const [data, setData] = useState<UpdData>(emptyUpd);
  const [state, setState] = useState<DownloadState>("idle");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...emptyUpd(), ...JSON.parse(raw) });
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

  function set<K extends keyof UpdData>(key: K, value: UpdData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }
  function setItem(i: number, patch: Partial<SfItem>) {
    setData((d) => ({ ...d, items: d.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) }));
  }
  function addItem() {
    setData((d) => ({ ...d, items: [...d.items, emptySfItem()] }));
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
    setData(emptyUpd());
    setState("idle");
  }

  async function download() {
    setState("working");
    try {
      const res = await fetch("/api/pdf/upd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, locale }),
      });
      if (!res.ok) throw new Error(`PDF ${res.status}`);
      const blob = await res.blob();
      track("tool_use", { tool: "upd", action: "download" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `upd-${data.number || "draft"}.pdf`;
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
  const field = (key: keyof UpdData, label: string) => (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        className={inputCls}
        value={data[key] as string}
        onChange={(e) => set(key, e.target.value as UpdData[typeof key])}
      />
    </div>
  );
  const statusBtn = (active: boolean) =>
    `flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
    }`;

  return (
    <div className="space-y-8">
      {/* Status */}
      <div>
        <label className={labelCls}>{u.status}</label>
        <div className="flex gap-1 rounded-lg border border-[var(--border)] p-1 max-w-md">
          <button type="button" className={statusBtn(data.status === "1")} onClick={() => set("status", "1" as UpdStatus)}>{u.status1}</button>
          <button type="button" className={statusBtn(data.status === "2")} onClick={() => set("status", "2" as UpdStatus)}>{u.status2}</button>
        </div>
      </div>

      {/* Parties */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">{t.sellerTitle}</h2>
          {field("sellerName", t.sellerName)}
          {field("sellerAddress", t.address)}
          <div className="grid grid-cols-2 gap-3">
            {field("sellerInn", t.inn)}
            {field("sellerKpp", t.kpp)}
          </div>
          {field("shipper", t.shipper)}
        </div>
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">{t.buyerTitle}</h2>
          {field("buyerName", t.buyerName)}
          {field("buyerAddress", t.address)}
          <div className="grid grid-cols-2 gap-3">
            {field("buyerInn", t.inn)}
            {field("buyerKpp", t.kpp)}
          </div>
          {field("consignee", t.consignee)}
        </div>
      </div>

      {/* Doc meta */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {field("number", t.number)}
        {field("date", t.date)}
        {field("paymentDoc", t.paymentDoc)}
        {field("govContract", t.govContract)}
        {field("currencyName", t.currencyName)}
        {field("currencyCode", t.currencyCode)}
        {field("basis", u.basis)}
        {field("transport", u.transport)}
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
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div><label className={labelCls}>{t.excise}</label><input className={smallCls} value={it.excise} onChange={(e) => setItem(i, { excise: e.target.value })} /></div>
                <div><label className={labelCls}>{t.country}</label><input className={smallCls} value={it.country} onChange={(e) => setItem(i, { country: e.target.value })} /></div>
                <div><label className={labelCls}>{t.countryCode}</label><input className={smallCls} value={it.countryCode} onChange={(e) => setItem(i, { countryCode: e.target.value })} /></div>
                <div><label className={labelCls}>{t.customsDecl}</label><input className={smallCls} value={it.customsDecl} onChange={(e) => setItem(i, { customsDecl: e.target.value })} /></div>
              </div>
            </details>
          </div>
        ))}
        <button type="button" onClick={addItem} className="rounded-md border border-dashed border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]">+ {t.addItem}</button>
      </div>

      {/* Transfer part */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">{u.handoverTitle}</h2>
          {field("handoverPosition", u.position)}
          {field("handoverName", u.personName)}
          {field("handoverDate", u.shipDate)}
        </div>
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">{u.receiveTitle}</h2>
          {field("receivePosition", u.position)}
          {field("receiveName", u.personName)}
          {field("receiveDate", u.receiveDate)}
        </div>
      </div>

      {/* Signatures (СФ part) */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={data.isSoleTrader} onChange={(e) => set("isSoleTrader", e.target.checked)} />
          {t.isSoleTrader}
        </label>
        <div className="grid md:grid-cols-2 gap-3">
          {field("signerHead", data.isSoleTrader ? t.signerIp : t.signerHead)}
          {data.isSoleTrader ? field("ogrnip", t.ogrnip) : field("signerAccountant", t.signerAccountant)}
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

      <p className="text-xs text-[var(--muted)] leading-relaxed">{u.disclaimer}</p>
    </div>
  );
}
