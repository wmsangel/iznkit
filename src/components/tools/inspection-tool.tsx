"use client";
import { track } from "@/lib/analytics";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import {
  STATUSES,
  STATUS_COLOR,
  emptyInspection,
  type InspectionData,
  type ItemStatus,
} from "@/lib/tools/inspection/model";
import { DesignPicker } from "./design-picker";
import { getThemeAccent } from "@/lib/design/themes";
import { Actions } from "./hourly-tool";

const SKU = "tool:inspection";
const STORAGE_KEY = "izn.tools:inspection:draft";
const MAX_PHOTOS = 10;
const MAX_EDGE = 1400; // px — downscale photos before embedding

type DownloadState = "idle" | "working" | "error" | "done";

/** Downscale an image file to a JPEG data URL to keep the PDF small. */
function resizeToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no canvas"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function InspectionTool({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.inspection;
  const tt = dict.tool;

  const [data, setData] = useState<InspectionData>(emptyInspection);
  const [state, setState] = useState<DownloadState>("idle");
  const [hydrated, setHydrated] = useState(false);
  const photoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...emptyInspection(), ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      // Photos are heavy — keep drafts small and quota-safe by not persisting them.
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, photos: [] }));
    } catch {
      /* ignore */
    }
  }, [data, hydrated]);

  const statusText: Record<ItemStatus, string> = {
    ok: t.statusOk,
    issue: t.statusIssue,
    na: t.statusNa,
  };
  const accent = getThemeAccent(data.theme);

  function set<K extends keyof InspectionData>(key: K, value: InspectionData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }
  function setItem(i: number, patch: Partial<InspectionData["items"][number]>) {
    setData((d) => ({
      ...d,
      items: d.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)),
    }));
  }
  function addItem() {
    setData((d) => ({ ...d, items: [...d.items, { label: "", status: "ok", note: "" }] }));
  }
  function removeItem(i: number) {
    setData((d) => ({ ...d, items: d.items.filter((_, idx) => idx !== i) }));
  }

  async function onPhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    try {
      const room = MAX_PHOTOS - data.photos.length;
      const picked = files.filter((f) => f.type.startsWith("image/")).slice(0, room);
      const srcs = await Promise.all(picked.map(resizeToDataUrl));
      setData((d) => ({
        ...d,
        photos: [...d.photos, ...srcs.map((src) => ({ src, caption: "" }))],
      }));
    } catch {
      setState("error");
    } finally {
      if (photoInput.current) photoInput.current.value = "";
    }
  }
  function setCaption(i: number, caption: string) {
    setData((d) => ({
      ...d,
      photos: d.photos.map((p, idx) => (idx === i ? { ...p, caption } : p)),
    }));
  }
  function removePhoto(i: number) {
    setData((d) => ({ ...d, photos: d.photos.filter((_, idx) => idx !== i) }));
  }
  function resetDraft() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setData(emptyInspection());
    setState("idle");
  }

  async function downloadPdf(unlockToken: string | null) {
    const res = await fetch("/api/pdf/inspection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, locale, unlockToken }),
    });
    if (!res.ok) throw new Error(`PDF ${res.status}`);
    const blob = await res.blob();
    track("tool_use", { tool: "inspection-report", action: "download" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inspection-${data.number || "report"}${unlockToken ? "" : "-preview"}.pdf`;
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
        <div className="flex justify-end -mb-2">
          <button
            type="button"
            onClick={resetDraft}
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ↺ {t.reset}
          </button>
        </div>

        <DesignPicker value={data.theme} onChange={(id) => set("theme", id)} locale={locale} label={tt.design} />

        <div>
          <label className={labelCls}>{t.subject}</label>
          <input
            className={inputCls}
            placeholder={t.subjectPlaceholder}
            value={data.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>
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
          <div className="col-span-2">
            <label className={labelCls}>{t.location}</label>
            <input
              className={inputCls}
              placeholder={t.locationPlaceholder}
              value={data.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t.inspector}</label>
            <input
              className={inputCls}
              value={data.inspector}
              onChange={(e) => set("inspector", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>{t.inspectorDetails}</label>
            <input
              className={inputCls}
              value={data.inspectorDetails}
              onChange={(e) => set("inspectorDetails", e.target.value)}
            />
          </div>
        </div>

        {/* Checklist */}
        <fieldset>
          <div className="flex items-center justify-between mb-2">
            <legend className="font-semibold">{t.checklist}</legend>
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
                  placeholder={t.itemPlaceholder}
                  value={item.label}
                  onChange={(e) => setItem(i, { label: e.target.value })}
                />
                <select
                  className={`${inputCls} w-28`}
                  value={item.status}
                  onChange={(e) => setItem(i, { status: e.target.value as ItemStatus })}
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {statusText[st]}
                    </option>
                  ))}
                </select>
                <input
                  className={`${inputCls} flex-1`}
                  placeholder={t.notePlaceholder}
                  value={item.note}
                  onChange={(e) => setItem(i, { note: e.target.value })}
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

        {/* Photos */}
        <fieldset>
          <div className="flex items-center justify-between mb-2">
            <legend className="font-semibold">
              {t.photos}{" "}
              <span className="text-[var(--muted)] font-normal text-sm">
                {data.photos.length}/{MAX_PHOTOS}
              </span>
            </legend>
            <label
              className={`text-sm cursor-pointer ${
                data.photos.length >= MAX_PHOTOS
                  ? "text-[var(--muted)] pointer-events-none"
                  : "text-[var(--accent)] hover:underline"
              }`}
            >
              + {t.addPhotos}
              <input
                ref={photoInput}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onPhotos}
              />
            </label>
          </div>
          {data.photos.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {data.photos.map((p, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.src}
                      alt=""
                      className="w-full h-24 object-cover rounded-lg border border-[var(--border)]"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-5 h-5 grid place-items-center rounded-full bg-black/60 text-white text-xs"
                      aria-label={t.removePhoto}
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    className={`${inputCls} text-xs py-1.5`}
                    placeholder={t.photoCaption}
                    value={p.caption}
                    onChange={(e) => setCaption(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </fieldset>

        <div>
          <label className={labelCls}>{t.summary}</label>
          <textarea
            className={inputCls}
            rows={3}
            placeholder={t.summaryPlaceholder}
            value={data.summary}
            onChange={(e) => set("summary", e.target.value)}
          />
        </div>
      </div>

      {/* Preview + actions */}
      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {t.previewTitle}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-white text-slate-900 p-6 shadow-sm text-sm max-h-[70vh] overflow-auto">
          <div className="flex justify-between items-start mb-4">
            <div className="text-lg font-bold tracking-wide" style={{ color: accent }}>
              {t.docTitle}
            </div>
            <div className="text-right text-xs">
              <div className="text-slate-500">{t.number}</div>
              <div className="font-semibold mb-1">{data.number || "—"}</div>
              <div className="text-slate-500">{t.date}</div>
              <div className="font-semibold">{data.date || "—"}</div>
            </div>
          </div>
          {data.title ? <div className="font-bold mb-1">{data.title}</div> : null}
          <div className="text-xs text-slate-500">
            {t.location}: <span className="text-slate-800">{data.location || "—"}</span>
          </div>
          <div className="text-xs text-slate-500 mb-3">
            {t.inspector}:{" "}
            <span className="text-slate-800">{data.inspector || "—"}</span>
          </div>

          {data.items.length ? (
            <table className="w-full text-xs mb-3">
              <thead>
                <tr className="text-slate-400 border-y border-slate-200">
                  <th className="text-left py-1 font-medium">{t.itemLabel}</th>
                  <th className="text-left py-1 font-medium w-24">{t.status}</th>
                  <th className="text-left py-1 font-medium">{t.note}</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, i) => (
                  <tr key={i} className="border-b border-slate-100 align-top">
                    <td className="py-1.5">{item.label || "—"}</td>
                    <td>
                      <span
                        className="inline-block text-[10px] text-white font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: STATUS_COLOR[item.status] }}
                      >
                        {statusText[item.status]}
                      </span>
                    </td>
                    <td className="text-slate-600">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {data.photos.length ? (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {data.photos.map((p, i) => (
                <div key={i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.src}
                    alt=""
                    className="w-full h-20 object-cover rounded border border-slate-200"
                  />
                  {p.caption ? (
                    <div className="text-[10px] text-slate-500 mt-0.5">{p.caption}</div>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          {data.summary ? (
            <div className="text-xs text-slate-700 whitespace-pre-line">{data.summary}</div>
          ) : null}
          <div className="mt-8 w-1/2 border-t border-slate-800 pt-1 text-[10px] text-slate-400">
            {t.signature}
          </div>
        </div>

        <Actions
          t={tt}
          state={state}
          price="$4"
          onFree={onFreePreview}
          onUnlock={onUnlock}
          locale={locale}
        />
      </div>
    </div>
  );
}
