"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { track } from "@/lib/analytics";
import { useToolUsed } from "@/lib/tools/use-tool-used";

type Fmt = "image/webp" | "image/jpeg" | "image/png";

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

interface Src {
  name: string;
  size: number;
  dataUri: string;
}
interface Out {
  url: string;
  size: number;
}

export function WebpConverterTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).webpConv;
  const markUsed = useToolUsed("webp-converter");
  const [src, setSrc] = useState<Src | null>(null);
  const [fmt, setFmt] = useState<Fmt>("image/webp");
  const [quality, setQuality] = useState(0.8);
  const [out, setOut] = useState<Out | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function readFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setSrc({ name: file.name, size: file.size, dataUri: String(reader.result) });
    reader.readAsDataURL(file);
    markUsed();
  }
  function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) readFile(f);
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) readFile(f);
  }

  // Re-encode whenever the image, format or quality changes. Everything runs on a
  // canvas in the browser — the file is never uploaded.
  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const image = new window.Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      if (fmt === "image/jpeg") {
        ctx.fillStyle = "#ffffff"; // JPEG has no alpha — flatten onto white
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(image, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (cancelled || !blob) return;
          const url = URL.createObjectURL(blob);
          setOut((prev) => {
            if (prev) URL.revokeObjectURL(prev.url);
            return { url, size: blob.size };
          });
        },
        fmt,
        fmt === "image/png" ? undefined : quality,
      );
    };
    image.src = src.dataUri;
    return () => {
      cancelled = true;
    };
  }, [src, fmt, quality]);

  // Revoke the last object URL on unmount.
  const outUrlRef = useRef<string | null>(null);
  outUrlRef.current = out?.url ?? null;
  useEffect(
    () => () => {
      if (outUrlRef.current) URL.revokeObjectURL(outUrlRef.current);
    },
    [],
  );

  function download() {
    if (!out || !src) return;
    const a = document.createElement("a");
    a.href = out.url;
    const ext = fmt.split("/")[1];
    const base = src.name.replace(/\.[^.]+$/, "") || "image";
    a.download = `${base}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    track("tool_use", { tool: "webp-converter", action: "download" });
  }

  function reset() {
    if (out) URL.revokeObjectURL(out.url);
    setOut(null);
    setSrc(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const btn =
    "rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors";
  const fmtBtn = (active: boolean) =>
    `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
    }`;

  if (!src) {
    return (
      <div>
        <input ref={inputRef} type="file" accept="image/*" onChange={onInput} className="hidden" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          className={`w-full rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors ${
            drag ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--border)] bg-[var(--card)]"
          }`}
        >
          <div className="text-4xl" aria-hidden>🖼️</div>
          <div className="mt-3 font-medium">{t.drop}</div>
          <div className="mt-1 text-sm text-[var(--muted)]">{t.hint}</div>
        </button>
      </div>
    );
  }

  const saved = out ? src.size - out.size : 0;
  const savedPct = out && src.size > 0 ? (saved / src.size) * 100 : 0;

  return (
    <div className="space-y-5">
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="eyebrow mb-2">{t.original}</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src.dataUri} alt={src.name} className="mx-auto max-w-full max-h-[240px] rounded" />
          <div className="mt-3 text-sm text-center text-[var(--muted)]">
            <span className="font-mono text-xs truncate">{src.name}</span> ·{" "}
            <span className="tabular-nums font-medium text-[var(--foreground)]">{fmtBytes(src.size)}</span>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="eyebrow mb-2">{t.converted}</div>
          {out ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={out.url} alt={t.converted} className="mx-auto max-w-full max-h-[240px] rounded" />
              <div className="mt-3 text-sm text-center text-[var(--muted)]">
                <span className="tabular-nums font-medium text-[var(--foreground)]">{fmtBytes(out.size)}</span>
                {saved > 0 ? (
                  <span className="text-[var(--accent)] font-medium"> · −{savedPct.toFixed(0)}% ({t.saved})</span>
                ) : saved < 0 ? (
                  <span className="text-amber-600"> · +{Math.abs(savedPct).toFixed(0)}% ({t.larger})</span>
                ) : null}
              </div>
            </>
          ) : (
            <div className="grid place-items-center min-h-[200px] text-sm text-[var(--muted)]">{t.working}</div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-5">
        <div className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          {t.format}
          <div className="flex gap-1 rounded-lg border border-[var(--border)] p-1">
            <button type="button" className={fmtBtn(fmt === "image/webp")} onClick={() => setFmt("image/webp")}>WebP</button>
            <button type="button" className={fmtBtn(fmt === "image/jpeg")} onClick={() => setFmt("image/jpeg")}>JPEG</button>
            <button type="button" className={fmtBtn(fmt === "image/png")} onClick={() => setFmt("image/png")}>PNG</button>
          </div>
        </div>
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)] min-w-[200px] flex-1">
          {t.quality}: <span className="tabular-nums text-[var(--foreground)]">{Math.round(quality * 100)}%</span>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={Math.round(quality * 100)}
            disabled={fmt === "image/png"}
            onChange={(e) => setQuality(Number(e.target.value) / 100)}
            className="w-full accent-[var(--accent)] disabled:opacity-40"
          />
          {fmt === "image/png" ? <span className="text-[11px]">{t.pngNote}</span> : null}
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={download}
          disabled={!out}
          className="rounded-lg bg-[var(--accent)] text-[var(--accent-fg)] px-5 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {t.download}
        </button>
        <button type="button" onClick={reset} className={btn}>
          {t.another}
        </button>
      </div>
    </div>
  );
}
