"use client";
import { track } from "@/lib/analytics";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { emptyNda, resolveNda, type NdaData } from "@/lib/tools/nda/model";
import { DesignPicker } from "./design-picker";
import { getThemeAccent } from "@/lib/design/themes";
import { Actions } from "./hourly-tool";

const SKU = "tool:nda";
const STORAGE_KEY = "izn.tools:nda:draft";

type DownloadState = "idle" | "working" | "error" | "done";

export function NdaTool({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.nda;
  const tt = dict.tool;

  const [data, setData] = useState<NdaData>(emptyNda);
  const [state, setState] = useState<DownloadState>("idle");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...emptyNda(), ...JSON.parse(raw) });
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

  const resolved = useMemo(() => resolveNda(data, t), [data, t]);
  const accent = getThemeAccent(data.theme);

  function set<K extends keyof NdaData>(key: K, value: NdaData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function downloadPdf(unlockToken: string | null) {
    const res = await fetch("/api/pdf/nda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, locale, unlockToken }),
    });
    if (!res.ok) throw new Error(`PDF ${res.status}`);
    const blob = await res.blob();
    track("tool_use", { tool: "nda", action: "download" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nda${unlockToken ? "" : "-preview"}.pdf`;
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
        <DesignPicker value={data.theme} onChange={(id) => set("theme", id)} locale={locale} label={tt.design} />
        <label className="flex items-center gap-2 font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={data.mutual}
            onChange={(e) => set("mutual", e.target.checked)}
            className="accent-[var(--accent)]"
          />
          {t.mutual}
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <fieldset className="space-y-2">
            <legend className="font-semibold mb-1">{t.disclosingParty}</legend>
            <input
              className={inputCls}
              placeholder={t.partyName}
              value={data.disclosingName}
              onChange={(e) => set("disclosingName", e.target.value)}
            />
            <textarea
              className={inputCls}
              rows={2}
              placeholder={t.partyDetails}
              value={data.disclosingDetails}
              onChange={(e) => set("disclosingDetails", e.target.value)}
            />
          </fieldset>
          <fieldset className="space-y-2">
            <legend className="font-semibold mb-1">{t.receivingParty}</legend>
            <input
              className={inputCls}
              placeholder={t.partyName}
              value={data.receivingName}
              onChange={(e) => set("receivingName", e.target.value)}
            />
            <textarea
              className={inputCls}
              rows={2}
              placeholder={t.partyDetails}
              value={data.receivingDetails}
              onChange={(e) => set("receivingDetails", e.target.value)}
            />
          </fieldset>
        </div>

        <div>
          <label className={labelCls}>{t.purpose}</label>
          <input
            className={inputCls}
            placeholder={t.purposePlaceholder}
            value={data.purpose}
            onChange={(e) => set("purpose", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>{t.effectiveDate}</label>
            <input
              type="date"
              className={inputCls}
              value={data.effectiveDate}
              onChange={(e) => set("effectiveDate", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>{t.termMonths}</label>
            <input
              type="number"
              min={1}
              className={inputCls}
              value={data.termMonths}
              onChange={(e) => set("termMonths", Number(e.target.value))}
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className={labelCls}>{t.governingLaw}</label>
            <input
              className={inputCls}
              placeholder={t.governingLawPlaceholder}
              value={data.governingLaw}
              onChange={(e) => set("governingLaw", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Preview + actions */}
      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {t.previewTitle}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white text-slate-900 p-6 shadow-sm text-[13px] leading-relaxed max-h-[70vh] overflow-auto">
          <div className="text-center font-bold tracking-wide mb-4" style={{ color: accent }}>{t.docTitle}</div>
          <p className="mb-3 text-justify">{resolved.intro}</p>
          {resolved.clauses.map((c, i) => (
            <div key={i} className="mb-2.5">
              <div className="font-semibold">{c.h}</div>
              <div className="text-slate-700 text-justify">{c.b}</div>
            </div>
          ))}
          <div className="mt-6 grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="uppercase text-slate-400">{t.disclosingParty}</div>
              <div className="font-semibold">{data.disclosingName || "—"}</div>
              <div className="border-t border-slate-800 mt-8 pt-1 text-slate-400">
                Signature / Date
              </div>
            </div>
            <div>
              <div className="uppercase text-slate-400">{t.receivingParty}</div>
              <div className="font-semibold">{data.receivingName || "—"}</div>
              <div className="border-t border-slate-800 mt-8 pt-1 text-slate-400">
                Signature / Date
              </div>
            </div>
          </div>
          <p className="mt-4 pt-2 border-t border-slate-200 text-[10px] text-slate-400">
            {t.disclaimer}
          </p>
        </div>

        <Actions
          t={tt}
          state={state}
          price="$5"
          onFree={onFreePreview}
          onUnlock={onUnlock}
          locale={locale}
        />
      </div>
    </div>
  );
}
