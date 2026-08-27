"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { track } from "@/lib/analytics";

export function QrTool({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.qr;

  const [content, setContent] = useState("");
  const [fg, setFg] = useState("#111827");
  const [size, setSize] = useState(320);
  const [png, setPng] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    if (!content.trim()) {
      setPng("");
      return;
    }
    QRCode.toDataURL(content, {
      width: size,
      margin: 1,
      color: { dark: fg, light: "#ffffff" },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (!cancelled) setPng(url);
      })
      .catch(() => {
        if (!cancelled) setPng("");
      });
    return () => {
      cancelled = true;
    };
  }, [content, fg, size]);

  function download(href: string, name: string) {
    track("tool_use", { tool: "qr-code", action: "download" });
    const a = document.createElement("a");
    a.href = href;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  function downloadPng() {
    if (png) download(png, "qr-code.png");
  }
  async function downloadSvg() {
    if (!content.trim()) return;
    const svg = await QRCode.toString(content, {
      type: "svg",
      margin: 1,
      color: { dark: fg, light: "#ffffff" },
      errorCorrectionLevel: "M",
    });
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    download(url, "qr-code.svg");
    URL.revokeObjectURL(url);
  }

  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div>
          <label className={labelCls}>{t.content}</label>
          <textarea
            className={inputCls}
            rows={3}
            placeholder={t.contentPlaceholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{t.fgColor}</label>
            <input
              type="color"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="h-10 w-16 rounded border border-[var(--border)] bg-transparent"
            />
          </div>
          <div>
            <label className={labelCls}>
              {t.size}: {size}px
            </label>
            <input
              type="range"
              min={160}
              max={800}
              step={20}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {t.result}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 grid place-items-center min-h-[220px]">
          {png ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={png}
              alt="QR code"
              className="max-w-full h-auto rounded bg-white p-3"
              style={{ width: Math.min(size, 260) }}
            />
          ) : (
            <p className="text-sm text-[var(--muted)] text-center">{t.empty}</p>
          )}
        </div>
        {png ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={downloadPng}
              className="btn-primary flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold"
            >
              {t.downloadPng}
            </button>
            <button
              type="button"
              onClick={downloadSvg}
              className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--background)]"
            >
              {t.downloadSvg}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
