"use client";
import { track } from "@/lib/analytics";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const SAMPLE = `{"name":"iznkit","tools":21,"free":true,"tags":["invoice","qr","password"],"nested":{"a":1,"b":[2,3]}}`;

export function JsonTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).json;

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState<"2" | "4" | "tab">("2");
  const [copied, setCopied] = useState(false);

  function run(minify: boolean) {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const space = minify ? undefined : indent === "tab" ? "\t" : Number(indent);
      setOutput(JSON.stringify(parsed, null, space));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setOutput("");
    }
  }

  function clear() {
    setInput("");
    setOutput("");
    setError(null);
  }

  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      track("tool_use", { tool: "json-formatter", action: "copy" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const area =
    "w-full h-80 rounded-xl border bg-[var(--card)] p-3 font-mono text-[13px] leading-relaxed outline-none resize-none";
  const btn =
    "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-50";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => run(false)} className={`btn-primary ${btn}`}>
          {t.format}
        </button>
        <button type="button" onClick={() => run(true)} className={`btn-outline ${btn}`}>
          {t.minify}
        </button>
        <button
          type="button"
          onClick={() => setInput(SAMPLE)}
          className={`btn-outline ${btn}`}
        >
          {t.sample}
        </button>
        <button type="button" onClick={clear} className={`btn-outline ${btn}`}>
          {t.clear}
        </button>

        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-[var(--muted)]">{t.indent}:</span>
          {(["2", "4", "tab"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setIndent(v)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium border transition-colors ${
                indent === v
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {v === "tab" ? t.tab : `${v} ${t.spaces}`}
            </button>
          ))}
        </div>
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
            value={output}
            placeholder={t.empty}
            spellCheck={false}
            className={`${area} border-[var(--border)] text-[var(--foreground)]`}
          />
        </div>
      </div>

      {error ? (
        <p className="text-sm text-[var(--bad)] font-mono">⚠ {error}</p>
      ) : output ? (
        <p className="text-sm text-[var(--good)]">✓ {t.valid}</p>
      ) : null}
    </div>
  );
}
