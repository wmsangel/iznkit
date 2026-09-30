"use client";

import { useState } from "react";
import { load, dump } from "js-yaml";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { track } from "@/lib/analytics";

const SAMPLE_YAML = `name: iznkit
version: 1.2
tools:
  - json
  - yaml
nested:
  enabled: true
  count: 3`;

export function YamlJsonTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).yamlJson;
  const [mode, setMode] = useState<"toJson" | "toYaml">("toJson");
  const [input, setInput] = useState(SAMPLE_YAML);
  const [copied, setCopied] = useState(false);

  let output = "";
  let error = "";
  if (input.trim()) {
    try {
      if (mode === "toJson") {
        output = JSON.stringify(load(input), null, 2);
      } else {
        output = dump(JSON.parse(input), { indent: 2, lineWidth: -1 });
      }
    } catch {
      error = mode === "toJson" ? t.errorYaml : t.errorJson;
    }
  }

  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      track("tool_use", { tool: "yaml-json", action: "copy" });
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
      <div className="flex gap-1 rounded-lg border border-[var(--border)] p-1 max-w-72">
        <button type="button" className={tabCls(mode === "toJson")} onClick={() => setMode("toJson")}>
          {t.toJson}
        </button>
        <button type="button" className={tabCls(mode === "toYaml")} onClick={() => setMode("toYaml")}>
          {t.toYaml}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "toJson" ? t.inputYaml : t.inputJson}
          rows={14}
          spellCheck={false}
          className={areaCls}
        />
        <div className="relative">
          <textarea
            value={error ? "" : output}
            readOnly
            placeholder={t.output}
            rows={14}
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
