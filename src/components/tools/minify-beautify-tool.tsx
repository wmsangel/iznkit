"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { track } from "@/lib/analytics";

type Lang = "html" | "css" | "js";
type Mode = "beautify" | "minify";

const SAMPLES: Record<Lang, string> = {
  html: `<!DOCTYPE html><html><head><title>Demo</title></head><body><h1 class="title">Hello</h1><p>World</p><!-- note --></body></html>`,
  css: `/* demo */ .card{display:flex;  gap:12px;color:#111} .card h1{font-size:1.5rem;  margin:0}`,
  js: `function greet( name ){  // hello\n  const msg = "Hi, "+name;  console.log( msg ); return msg;}`,
};

function minifyCss(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

function minifyHtml(src: string): string {
  return src
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}

export function MinifyBeautifyTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).minifyBeautify;
  const [lang, setLang] = useState<Lang>("html");
  const [mode, setMode] = useState<Mode>("beautify");
  const [input, setInput] = useState(SAMPLES.html);
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function run() {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      let result = "";
      if (mode === "beautify") {
        const beautify = await import("js-beautify");
        const opts = { indent_size: 2, wrap_line_length: 0 };
        if (lang === "html") result = beautify.html_beautify(input, opts);
        else if (lang === "css") result = beautify.css_beautify(input, opts);
        else result = beautify.js_beautify(input, opts);
      } else if (lang === "css") {
        result = minifyCss(input);
      } else if (lang === "html") {
        result = minifyHtml(input);
      } else {
        const { minify } = await import("terser");
        const out = await minify(input, { compress: true, mangle: true });
        if (!out.code) throw new Error(t.error);
        result = out.code;
      }
      setOutput(result);
      track("tool_use", { tool: "minify-beautify", action: "convert" });
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : t.error);
    } finally {
      setBusy(false);
    }
  }

  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      track("tool_use", { tool: "minify-beautify", action: "copy" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const before = new TextEncoder().encode(input).length;
  const after = output ? new TextEncoder().encode(output).length : 0;
  const savedPct =
    output && before > 0 ? Math.round(((before - after) / before) * 100) : null;

  const area =
    "w-full h-72 rounded-xl border bg-[var(--card)] p-3 font-mono text-[13px] leading-relaxed outline-none resize-none";
  const btn =
    "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-50";
  const seg = (active: boolean) =>
    `rounded-md px-2.5 py-1 text-xs font-medium border transition-colors ${
      active
        ? "border-[var(--accent)] text-[var(--accent)]"
        : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
    }`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[var(--muted)]">{t.language}:</span>
          {(["html", "css", "js"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                setLang(v);
                setInput(SAMPLES[v]);
                setOutput("");
                setError(null);
              }}
              className={seg(lang === v)}
            >
              {t[v]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[var(--muted)]">{t.mode}:</span>
          {(["beautify", "minify"] as const).map((v) => (
            <button key={v} type="button" onClick={() => setMode(v)} className={seg(mode === v)}>
              {t[v]}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={run}
          disabled={busy || !input.trim()}
          className={`btn-primary ${btn} ml-auto`}
        >
          {busy ? t.working : t.run}
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
          {error ? <p className="mt-2 text-sm text-[var(--bad)]">{error}</p> : null}
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
            className={`${area} border-[var(--border)]`}
          />
        </div>
      </div>

      {output ? (
        <p className="text-sm text-[var(--muted)]">
          {t.sizeBefore}: {formatBytes(before)} · {t.sizeAfter}: {formatBytes(after)}
          {savedPct !== null ? ` · ${savedPct > 0 ? "−" : "+"}${Math.abs(savedPct)}%` : ""}
        </p>
      ) : null}
    </div>
  );
}
