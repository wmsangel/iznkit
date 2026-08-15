"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { CERT_DESIGNS, emptyCert, getCertDesign, type CertData } from "@/lib/tools/cert/model";
import { Actions } from "./hourly-tool";

const SKU = "tool:gift-certificate";
const STORAGE_KEY = "izn.tools:cert:draft";
const MAX_EDGE = 1600;

type DownloadState = "idle" | "working" | "error" | "done";

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
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function CertTool({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.cert;
  const tt = dict.tool;

  const [data, setData] = useState<CertData>(emptyCert);
  const [state, setState] = useState<DownloadState>("idle");
  const [hydrated, setHydrated] = useState(false);
  const imgInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...emptyCert(), ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      // don't persist the (heavy) background image
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, bgImage: null }));
    } catch {}
  }, [data, hydrated]);

  const d = getCertDesign(data.design);
  function set<K extends keyof CertData>(key: K, value: CertData[K]) {
    setData((s) => ({ ...s, [key]: value }));
  }
  async function onImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    try {
      set("bgImage", await resizeToDataUrl(file));
    } catch {
      setState("error");
    } finally {
      if (imgInput.current) imgInput.current.value = "";
    }
  }
  function resetDraft() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setData(emptyCert());
    setState("idle");
    if (imgInput.current) imgInput.current.value = "";
  }

  async function downloadPdf(unlockToken: string | null) {
    const res = await fetch("/api/pdf/cert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, locale, unlockToken }),
    });
    if (!res.ok) throw new Error(`PDF ${res.status}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gift-certificate${unlockToken ? "" : "-preview"}.pdf`;
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
      {/* Form + designs */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="font-semibold">{t.design}</span>
          <button type="button" onClick={resetDraft} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">↺ {t.reset}</button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {CERT_DESIGNS.map((des) => {
            const active = des.id === data.design;
            return (
              <button
                key={des.id}
                type="button"
                onClick={() => set("design", des.id)}
                title={des.label[locale]}
                aria-label={des.label[locale]}
                className={`relative aspect-[1.4/1] rounded-md overflow-hidden border transition-transform ${
                  active ? "ring-2 ring-[var(--foreground)] border-transparent scale-105" : "border-[var(--border)] hover:scale-105"
                }`}
                style={{ backgroundColor: des.bg }}
              >
                {des.band ? (
                  <span className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: des.accent, opacity: 0.6 }} />
                ) : null}
                {des.frame !== "none" ? (
                  <span className="absolute inset-1 rounded-sm" style={{ border: `1px solid ${des.accent}` }} />
                ) : null}
                <span className="absolute inset-0 grid place-items-center text-[8px] font-bold" style={{ color: des.accent }}>
                  ★
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          {data.bgImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.bgImage} alt="" className="h-10 w-16 object-cover rounded border border-[var(--border)]" />
          ) : null}
          <label className="text-sm text-[var(--accent)] hover:underline cursor-pointer">
            {data.bgImage ? t.bgImage : `+ ${t.uploadImage}`}
            <input ref={imgInput} type="file" accept="image/*" className="hidden" onChange={onImage} />
          </label>
          {data.bgImage ? (
            <button type="button" onClick={() => set("bgImage", null)} className="text-sm text-[var(--muted)] hover:text-red-500">{t.removeImage}</button>
          ) : null}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t.brandName}</label>
            <input className={inputCls} placeholder={t.brandPlaceholder} value={data.brandName} onChange={(e) => set("brandName", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>{t.amount}</label>
            <input className={inputCls} placeholder={t.amountPlaceholder} value={data.amount} onChange={(e) => set("amount", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>{t.recipient}</label>
            <input className={inputCls} placeholder={t.recipientPlaceholder} value={data.recipient} onChange={(e) => set("recipient", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>{t.sender}</label>
            <input className={inputCls} placeholder={t.senderPlaceholder} value={data.sender} onChange={(e) => set("sender", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>{t.code}</label>
            <input className={inputCls} value={data.code} onChange={(e) => set("code", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>{t.expiry}</label>
            <input type="date" className={inputCls} value={data.expiry} onChange={(e) => set("expiry", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>{t.message}</label>
          <textarea className={inputCls} rows={2} placeholder={t.messagePlaceholder} value={data.message} onChange={(e) => set("message", e.target.value)} />
        </div>
      </div>

      {/* Preview + actions */}
      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{t.previewTitle}</div>
        <div
          className="relative rounded-xl overflow-hidden shadow-sm aspect-[1.4/1] flex flex-col p-5"
          style={{
            backgroundColor: d.bg,
            backgroundImage: data.bgImage ? `url(${data.bgImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {data.bgImage ? <div className="absolute inset-0" style={{ backgroundColor: d.bg, opacity: 0.74 }} /> : null}
          {d.band ? <div className="absolute top-0 left-0 right-0 h-3" style={{ backgroundColor: d.accent, opacity: 0.16 }} /> : null}
          {d.frame !== "none" ? <div className="absolute inset-3 rounded" style={{ border: `1.5px solid ${d.accent}` }} /> : null}
          {d.frame === "double" ? <div className="absolute inset-[18px] rounded" style={{ border: `0.75px solid ${d.accent}` }} /> : null}

          <div className="relative flex-1 flex flex-col items-center justify-center text-center px-4">
            {data.brandName ? <div className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: d.accent }}>{data.brandName}</div> : null}
            <div className="text-sm sm:text-base font-bold tracking-[0.2em]" style={{ color: d.ink }}>{t.docTitle}</div>
            <div className="text-3xl sm:text-4xl font-bold my-2" style={{ color: d.accent }}>{data.amount || " "}</div>
            {data.recipient ? <div className="text-xs" style={{ color: d.ink }}>{t.to}: {data.recipient}</div> : null}
            {data.message ? <div className="text-[11px] mt-2 max-w-xs" style={{ color: d.ink, opacity: 0.82 }}>{data.message}</div> : null}
          </div>
          <div className="relative flex justify-between items-end text-[9px]" style={{ color: d.ink }}>
            <span className="font-bold">{data.code}</span>
            <span style={{ opacity: 0.75 }}>{data.sender ? `${t.from}: ${data.sender}` : ""}</span>
            <span style={{ opacity: 0.75 }}>{data.expiry ? `${t.valid}: ${data.expiry}` : ""}</span>
          </div>
        </div>

        <Actions t={tt} state={state} price="$4" onFree={onFreePreview} onUnlock={onUnlock} locale={locale} />
      </div>
    </div>
  );
}
