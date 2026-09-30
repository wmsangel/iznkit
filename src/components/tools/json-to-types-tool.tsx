"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { track } from "@/lib/analytics";
import { jsonToTypeScript, jsonToGo } from "@/lib/tools/json-to-types";

const SAMPLE = `{
  "id": 42,
  "name": "Ada",
  "active": true,
  "roles": ["admin", "user"],
  "address": { "city": "Kyiv", "zip": "01001" },
  "scores": [9.5, 8]
}`;

export function JsonToTypesTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).jsonTypes;
  const [input, setInput] = useState(SAMPLE);
  const [lang, setLang] = useState<"ts" | "go">("ts");
  const [rootName, setRootName] = useState("Root");
  const [copied, setCopied] = useState(false);

  let output = "";
  let error = "";
  if (input.trim()) {
    try {
      const name = rootName.trim() || "Root";
      output = lang === "ts" ? jsonToTypeScript(input, name) : jsonToGo(input, name);
    } catch {
      error = t.error;
    }
  }

  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      track("tool_use", { tool: "json-to-types", action: "copy" });
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  }

  const areaCls =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-mono leading-relaxed outline-none focus:border-[var(--accent)] resize-y";
  const tabCls = (active: boolean) =>
    `flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
    }`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="flex gap-1 rounded-lg border border-[var(--border)] p-1 max-w-56">
          <button type="button" className={tabCls(lang === "ts")} onClick={() => setLang("ts")}>
            {t.typescript}
          </button>
          <button type="button" className={tabCls(lang === "go")} onClick={() => setLang("go")}>
            {t.go}
          </button>
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--muted)]">
          {t.rootName}
          <input
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            spellCheck={false}
            className="w-32 rounded-md border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-sm font-mono outline-none focus:border-[var(--accent)]"
          />
        </label>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.input}
          rows={16}
          spellCheck={false}
          className={areaCls}
        />
        <div className="relative">
          <textarea
            value={error ? "" : output}
            readOnly
            placeholder={t.output}
            rows={16}
            className={`${areaCls} ${error ? "border-red-500/60" : ""}`}
          />
          {output && !error ? (
            <button
              type="button"
              onClick={copy}
              className="absolute right-3 top-3 rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-xs font-medium text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              {copied ? t.copied : t.copy}
            </button>
          ) : null}
          {error ? <p className="absolute left-4 top-3 text-sm text-red-500">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
