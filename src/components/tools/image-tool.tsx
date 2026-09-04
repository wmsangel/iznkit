"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

interface Info {
  w: number;
  h: number;
  size: number;
  type: string;
  url: string;
}

export function ImageSizeTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).imageSize;
  const [info, setInfo] = useState<Info | null>(null);
  const [over, setOver] = useState(false);

  function handle(file: File | undefined | null) {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      setInfo((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { w: img.naturalWidth, h: img.naturalHeight, size: file.size, type: file.type, url };
      });
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  }

  let ratio = "—";
  let mp = "—";
  if (info) {
    const g = gcd(info.w, info.h) || 1;
    const rw = info.w / g;
    const rh = info.h / g;
    ratio = rw > 40 || rh > 40 ? `${(info.w / info.h).toFixed(2)}:1` : `${rw}:${rh}`;
    mp = `${((info.w * info.h) / 1e6).toFixed(1)} MP`;
  }
  const fmtType = info ? info.type.split("/")[1]?.toUpperCase() ?? info.type : "—";

  const stat = (label: string, value: string, accent = false) => (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{label}</div>
      <div className={`mt-1 text-lg font-bold tabular-nums ${accent ? "text-[var(--accent)]" : ""}`}>
        {value}
      </div>
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          handle(e.dataTransfer.files?.[0]);
        }}
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors min-h-56 ${
          over ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-[var(--card)]"
        }`}
      >
        {info ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={info.url} alt="" className="max-h-40 max-w-full rounded-lg object-contain" />
        ) : (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
          </svg>
        )}
        <span className="font-medium text-sm">{t.pick}</span>
        <span className="text-xs text-[var(--muted)]">{t.hint}</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handle(e.target.files?.[0])}
        />
      </label>

      <div className="self-start grid grid-cols-2 gap-3">
        {stat(t.dimensions, info ? `${info.w} × ${info.h}` : "—", true)}
        {stat(t.fileSize, info ? fmtSize(info.size) : "—")}
        {stat(t.format, fmtType)}
        {stat(t.aspectRatio, ratio)}
        {stat(t.megapixels, mp)}
      </div>
    </div>
  );
}
