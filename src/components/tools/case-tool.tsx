"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { track } from "@/lib/analytics";

function words(text: string): string[] {
  return text.match(/[\p{L}\p{N}]+/gu) ?? [];
}
const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function convert(text: string) {
  const w = words(text);
  return {
    upper: text.toUpperCase(),
    lower: text.toLowerCase(),
    titleCase: text.replace(/\S+/g, (x) => cap(x.toLowerCase())),
    sentence: text
      .toLowerCase()
      .replace(/(^\s*\p{L})|([.!?…]\s+\p{L})/gu, (m) => m.toUpperCase()),
    camel: w.map((x, i) => (i === 0 ? x.toLowerCase() : cap(x.toLowerCase()))).join(""),
    pascal: w.map((x) => cap(x.toLowerCase())).join(""),
    snake: w.map((x) => x.toLowerCase()).join("_"),
    kebab: w.map((x) => x.toLowerCase()).join("-"),
  };
}

export function CaseTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).caseConverter;
  const [text, setText] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const r = convert(text);

  async function copy(key: string, value: string) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      track("tool_use", { tool: "case-converter", action: "copy" });
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
    } catch {
      /* clipboard blocked */
    }
  }

  const rows: { key: keyof typeof r; label: string }[] = [
    { key: "upper", label: t.upper },
    { key: "lower", label: t.lower },
    { key: "titleCase", label: t.titleCase },
    { key: "sentence", label: t.sentence },
    { key: "camel", label: t.camel },
    { key: "pascal", label: t.pascal },
    { key: "snake", label: t.snake },
    { key: "kebab", label: t.kebab },
  ];

  return (
    <div className="space-y-5">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.placeholder}
        rows={4}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-relaxed outline-none focus:border-[var(--accent)] resize-y"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map(({ key, label }) => (
          <div
            key={key}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 flex items-center gap-3"
          >
            <div className="min-w-0 flex-1">
              <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{label}</div>
              <div className="mt-0.5 text-sm font-mono truncate">{r[key] || "—"}</div>
            </div>
            <button
              type="button"
              onClick={() => copy(key, r[key])}
              disabled={!r[key]}
              className="shrink-0 rounded-md border border-[var(--border)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors disabled:opacity-40"
            >
              {copied === key ? t.copied : t.copy}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
