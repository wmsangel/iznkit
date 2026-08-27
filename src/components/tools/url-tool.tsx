"use client";
import { track } from "@/lib/analytics";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function UrlTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).url;

  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [full, setFull] = useState(false);
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!input) return { output: "", error: null as string | null };
    try {
      if (mode === "encode") {
        return { output: full ? encodeURI(input) : encodeURIComponent(input), error: null };
      }
      return { output: decodeURIComponent(input), error: null };
    } catch {
      return { output: "", error: t.invalid };
    }
  }, [input, mode, full, t.invalid]);

  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      track("tool_use", { tool: "url-encode", action: "copy" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const area =
    "w-full h-56 rounded-xl border bg-[var(--card)] p-3 font-mono text-[13px] leading-relaxed outline-none resize-none break-all";
  const seg = "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors";

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
              checked={full}
              onChange={() => setFull((v) => !v)}
              className="w-4 h-4 accent-[var(--accent)]"
            />
            {full ? t.full : t.component}
          </label>
        ) : null}
        <button type="button" onClick={() => setInput("")} className={`btn-outline ${seg} ml-auto`}>
          {t.clear}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <label className="eyebrow mb-2 inline-block">{t.input}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
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
