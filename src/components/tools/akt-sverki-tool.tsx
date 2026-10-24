"use client";

import { useEffect, useMemo, useState } from "react";
import { track } from "@/lib/analytics";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  computeAktTotals,
  emptyAktRow,
  emptyAktSverki,
  type AktRow,
  type AktSverkiData,
} from "@/lib/tools/akt-sverki/model";

const STORAGE_KEY = "izn.tools:akt-sverki:draft";
type DownloadState = "idle" | "working" | "error";

const money = (n: number) =>
  n.toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function AktSverkiTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).aktSverki;
  const [data, setData] = useState<AktSverkiData>(emptyAktSverki);
  const [state, setState] = useState<DownloadState>("idle");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...emptyAktSverki(), ...JSON.parse(raw) });
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

  const totals = useMemo(() => computeAktTotals(data), [data]);

  function set<K extends keyof AktSverkiData>(key: K, value: AktSverkiData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }
  function setRow(i: number, patch: Partial<AktRow>) {
    setData((d) => ({ ...d, rows: d.rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)) }));
  }
  function addRow() {
    setData((d) => ({ ...d, rows: [...d.rows, emptyAktRow()] }));
  }
  function removeRow(i: number) {
    setData((d) => ({ ...d, rows: d.rows.length > 1 ? d.rows.filter((_, idx) => idx !== i) : d.rows }));
  }
  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setData(emptyAktSverki());
    setState("idle");
  }

  async function download() {
    setState("working");
    try {
      const res = await fetch("/api/pdf/akt-sverki", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, locale }),
      });
      if (!res.ok) throw new Error(`PDF ${res.status}`);
      const blob = await res.blob();
      track("tool_use", { tool: "akt-sverki", action: "download" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `akt-sverki-${data.number || "draft"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setState("idle");
    } catch {
      setState("error");
    }
  }

  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const smallCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 text-xs outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";
  const field = (key: keyof AktSverkiData, label: string) => (
    <div>
      <label className={labelCls}>{label}</label>
      <input
        className={inputCls}
        value={data[key] as string}
        onChange={(e) => set(key, e.target.value as AktSverkiData[typeof key])}
      />
    </div>
  );

  const beneficiary = totals.closing > 0 ? data.org1Name || t.org1 : data.org2Name || t.org2;

  return (
    <div className="space-y-8">
      {/* Parties */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">{t.org1Title}</h2>
          {field("org1Name", t.orgName)}
          {field("org1Details", t.orgDetails)}
        </div>
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">{t.org2Title}</h2>
          {field("org2Name", t.orgName)}
          {field("org2Details", t.orgDetails)}
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {field("number", t.number)}
        {field("date", t.date)}
        {field("periodFrom", t.periodFrom)}
        {field("periodTo", t.periodTo)}
        <div className="col-span-2 md:col-span-2">{field("contract", t.contract)}</div>
        <div>
          <label className={labelCls}>{t.opening}</label>
          <input
            className={inputCls}
            inputMode="decimal"
            value={data.openingBalance}
            onChange={(e) => set("openingBalance", e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>{t.openingSide}</label>
          <select
            className={inputCls}
            value={data.openingSide}
            onChange={(e) => set("openingSide", e.target.value as AktSverkiData["openingSide"])}
          >
            <option value="debit">{t.openingDebit}</option>
            <option value="credit">{t.openingCredit}</option>
          </select>
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">{t.rowsTitle}</h2>
        <p className="text-xs text-[var(--muted)]">{t.rowsHint}</p>
        {data.rows.map((r, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-end">
            <div className="col-span-3 sm:col-span-2">
              <label className={labelCls}>{t.rowDate}</label>
              <input className={smallCls} value={r.date} onChange={(e) => setRow(i, { date: e.target.value })} />
            </div>
            <div className="col-span-9 sm:col-span-5">
              <label className={labelCls}>{t.rowDoc}</label>
              <input className={smallCls} value={r.doc} onChange={(e) => setRow(i, { doc: e.target.value })} />
            </div>
            <div className="col-span-5 sm:col-span-2">
              <label className={labelCls}>{t.rowDebit}</label>
              <input className={smallCls} inputMode="decimal" value={r.debit} onChange={(e) => setRow(i, { debit: e.target.value })} />
            </div>
            <div className="col-span-5 sm:col-span-2">
              <label className={labelCls}>{t.rowCredit}</label>
              <input className={smallCls} inputMode="decimal" value={r.credit} onChange={(e) => setRow(i, { credit: e.target.value })} />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="w-full rounded-md border border-[var(--border)] px-2 py-1.5 text-xs text-[var(--muted)] hover:border-[var(--accent)]"
                aria-label={t.remove}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addRow}
          className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm font-medium hover:border-[var(--accent)]"
        >
          + {t.addRow}
        </button>
      </div>

      {/* Totals */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted)]">{t.turnoverDebit}</span>
          <span className="font-semibold tabular-nums">{money(totals.debit)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted)]">{t.turnoverCredit}</span>
          <span className="font-semibold tabular-nums">{money(totals.credit)}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-[var(--border)] pt-1.5">
          <span className="text-[var(--muted)]">{t.closingLabel}</span>
          <span className="font-semibold tabular-nums">{money(Math.abs(totals.closing))}</span>
        </div>
        <p className="text-sm text-[var(--foreground)] pt-1">
          {totals.closing === 0
            ? t.noDebt
            : `${t.debtInFavor} ${beneficiary} — ${money(Math.abs(totals.closing))} ₽`}
        </p>
      </div>

      {/* Signatures */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">{t.signFrom} {data.org1Name || t.org1}</h2>
          {field("org1SignPos", t.position)}
          {field("org1SignName", t.personName)}
        </div>
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">{t.signFrom} {data.org2Name || t.org2}</h2>
          {field("org2SignPos", t.position)}
          {field("org2SignName", t.personName)}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={download}
          disabled={state === "working"}
          className="btn-primary rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-60"
        >
          {state === "working" ? t.working : t.download}
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:border-[var(--accent)]"
        >
          {t.reset}
        </button>
        {state === "error" && <span className="text-sm text-red-500">{t.error}</span>}
      </div>
    </div>
  );
}
