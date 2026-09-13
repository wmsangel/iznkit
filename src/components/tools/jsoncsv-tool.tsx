"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { track } from "@/lib/analytics";

function csvEscape(v: unknown): string {
  let s: string;
  if (v === null || v === undefined) s = "";
  else if (typeof v === "object") s = JSON.stringify(v);
  else s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function jsonToCsv(text: string): string {
  const data = JSON.parse(text);
  if (!Array.isArray(data)) throw new Error("not-array");
  const keys: string[] = [];
  const seen = new Set<string>();
  for (const row of data) {
    if (row && typeof row === "object" && !Array.isArray(row)) {
      for (const k of Object.keys(row)) if (!seen.has(k)) (seen.add(k), keys.push(k));
    }
  }
  if (keys.length === 0) throw new Error("no-objects");
  const lines = [keys.map(csvEscape).join(",")];
  for (const row of data) {
    lines.push(keys.map((k) => csvEscape((row as Record<string, unknown>)?.[k])).join(","));
  }
  return lines.join("\n");
}

/** Minimal RFC 4180 CSV parser (handles quotes, embedded commas and newlines). */
function parseCsv(text: string): string[][] {
  const s = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
      continue;
    }
    if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  row.push(field);
  rows.push(row);
  if (rows.length && rows[rows.length - 1].length === 1 && rows[rows.length - 1][0] === "") rows.pop();
  return rows;
}

function csvToJson(text: string): string {
  const rows = parseCsv(text.trim());
  if (rows.length < 1 || (rows.length === 1 && rows[0].length === 1 && rows[0][0] === "")) {
    throw new Error("empty");
  }
  const headers = rows[0];
  const out = rows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = r[i] ?? ""));
    return obj;
  });
  return JSON.stringify(out, null, 2);
}

export function JsonCsvTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).jsonCsv;
  const [mode, setMode] = useState<"toCsv" | "toJson">("toCsv");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  let output = "";
  let error = "";
  if (input.trim()) {
    try {
      output = mode === "toCsv" ? jsonToCsv(input) : csvToJson(input);
    } catch {
      error = mode === "toCsv" ? t.errorJson : t.errorCsv;
    }
  }

  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      track("tool_use", { tool: "json-to-csv", action: "copy" });
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
        <button type="button" className={tabCls(mode === "toCsv")} onClick={() => setMode("toCsv")}>
          {t.toCsv}
        </button>
        <button type="button" className={tabCls(mode === "toJson")} onClick={() => setMode("toJson")}>
          {t.toJson}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "toCsv" ? t.inputJson : t.inputCsv}
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
          {error ? (
            <p className="absolute left-4 top-3 text-sm text-red-500">{error}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
