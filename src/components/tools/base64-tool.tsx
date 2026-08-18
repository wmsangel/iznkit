"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

function encodeB64(s: string, urlSafe: boolean): string {
  const bytes = new TextEncoder().encode(s);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  let out = btoa(bin);
  if (urlSafe) out = out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return out;
}

function decodeB64(s: string): string {
  const norm = s.replace(/-/g, "+").replace(/_/g, "/").replace(/\s+/g, "");
  const bin = atob(norm);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function Base64Tool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).b64;

  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [urlSafe, setUrlSafe] = useState(false);
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      return {
        output: mode === "encode" ? encodeB64(input, urlSafe) : decodeB64(input),
        error: null,
      };
    } catch {
      return { output: "", error: mode === "decode" ? t.invalid : "Error" };
    }
  }, [input, mode, urlSafe, t.invalid]);

  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const area =
    "w-full h-64 rounded-xl border bg-[var(--card)] p-3 font-mono text-[13px] leading-relaxed outline-none resize-none";
  const seg =
    "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors";

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-[var(--border)] p-0.5">
          <button
            type="button"
            onClick={() => setMode("encode")}
            className={`${seg} ${mode === "encode" ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)]"}`}
          >
            {t.encode}
          </button>
          <button
            type="button"
            onClick={() => setMode("decode")}
            className={`${seg} ${mode === "decode" ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)]"}`}
          >
            {t.decode}
          </button>
        </div>
        {mode === "encode" ? (
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={urlSafe}
              onChange={() => setUrlSafe((v) => !v)}
              className="w-4 h-4 accent-[var(--accent)]"
            />
            {t.urlSafe}
          </label>
        ) : null}
        <button
          type="button"
          onClick={() => setInput("")}
          className={`btn-outline ${seg} ml-auto`}
        >
          {t.clear}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <label className="eyebrow mb-2 inline-block">{t.input}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? t.placeholder : t.placeholderDecode}
            spellCheck={false}
            className={`${area} ${error ? "border-[var(--bad)]" : "border-[var(--border)]"} focus:border-[var(--accent)]`}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2 h-[18px]">
            <span className="eyebrow">{t.output}</span>
            {output ? (
              <button
                type="button"
                onClick={copy}
                className="text-xs font-medium text-[var(--accent)] hover:underline"
              >
                {copied ? t.copied : t.copy}
              </button>
            ) : null}
          </div>
          <textarea
            readOnly
            value={error ? "" : output}
            placeholder={t.empty}
            spellCheck={false}
            className={`${area} border-[var(--border)]`}
          />
        </div>
      </div>

      {error ? <p className="text-sm text-[var(--bad)]">⚠ {error}</p> : null}
    </div>
  );
}
