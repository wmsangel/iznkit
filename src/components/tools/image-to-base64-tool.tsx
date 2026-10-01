"use client";

import { useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { track } from "@/lib/analytics";

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

interface Loaded {
  name: string;
  size: number;
  dataUri: string;
}

export function ImageToBase64Tool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).imgBase64;
  const [img, setImg] = useState<Loaded | null>(null);
  const [drag, setDrag] = useState(false);
  const [copied, setCopied] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function readFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImg({ name: file.name, size: file.size, dataUri: String(reader.result) });
    };
    reader.readAsDataURL(file);
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

  async function copy(text: string, which: string) {
    try {
      await navigator.clipboard.writeText(text);
      track("tool_use", { tool: "image-to-base64", action: "copy" });
      setCopied(which);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* clipboard blocked */
    }
  }

  const btn =
    "rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors";

  if (!img) {
    return (
      <div>
        <input ref={inputRef} type="file" accept="image/*" onChange={onInput} className="hidden" />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
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

  const cssSnippet = `background-image: url("${img.dataUri}");`;
  const imgSnippet = `<img src="${img.dataUri}" alt="">`;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 grid place-items-center min-h-[200px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.dataUri} alt={img.name} className="max-w-full max-h-[260px] rounded" />
        </div>
        <div className="flex items-center justify-between gap-3 text-sm flex-wrap">
          <span className="font-mono text-xs text-[var(--muted)] truncate max-w-full">{img.name}</span>
          <span className="text-[var(--muted)]">
            {t.original}: <span className="tabular-nums font-medium text-[var(--foreground)]">{fmtBytes(img.size)}</span>
            {"  ·  "}
            {t.encoded}: <span className="tabular-nums font-medium text-[var(--foreground)]">{fmtBytes(img.dataUri.length)}</span>
          </span>
        </div>
        <button type="button" onClick={() => { setImg(null); if (inputRef.current) inputRef.current.value = ""; }} className={btn}>
          {t.another}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="eyebrow">{t.dataUri}</span>
          <button type="button" onClick={() => copy(img.dataUri, "uri")} className={btn}>
            {copied === "uri" ? t.copied : t.copy}
          </button>
        </div>
        <textarea
          value={img.dataUri}
          readOnly
          rows={10}
          onFocus={(e) => e.currentTarget.select()}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-xs font-mono leading-relaxed outline-none focus:border-[var(--accent)] resize-y break-all"
        />
        <div className="flex gap-2 flex-wrap">
          <button type="button" onClick={() => copy(cssSnippet, "css")} className={btn}>
            {copied === "css" ? t.copied : t.copyCss}
          </button>
          <button type="button" onClick={() => copy(imgSnippet, "img")} className={btn}>
            {copied === "img" ? t.copied : t.copyImg}
          </button>
        </div>
      </div>
    </div>
  );
}
