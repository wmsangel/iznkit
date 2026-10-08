"use client";

import { useState } from "react";
import { format, type FormatOptionsWithLanguage, type SqlLanguage } from "sql-formatter";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { track } from "@/lib/analytics";

const SAMPLE_SQL = `select u.id, u.name, count(o.id) as orders from users u left join orders o on o.user_id=u.id where u.active=true group by u.id, u.name having count(o.id)>0 order by orders desc limit 10;`;

// Curated, widely-used dialects (sql-formatter supports more, but these cover the demand).
const DIALECTS: { value: SqlLanguage; label: string }[] = [
  { value: "sql", label: "Standard SQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "mariadb", label: "MariaDB" },
  { value: "sqlite", label: "SQLite" },
  { value: "transactsql", label: "SQL Server (T-SQL)" },
  { value: "plsql", label: "Oracle (PL/SQL)" },
  { value: "bigquery", label: "BigQuery" },
  { value: "snowflake", label: "Snowflake" },
  { value: "redshift", label: "Redshift" },
  { value: "spark", label: "Spark SQL" },
];

type KeywordCase = "upper" | "lower" | "preserve";

export function SqlFormatterTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).sqlFormatter;
  const [input, setInput] = useState(SAMPLE_SQL);
  const [language, setLanguage] = useState<SqlLanguage>("sql");
  const [keywordCase, setKeywordCase] = useState<KeywordCase>("upper");
  const [tabWidth, setTabWidth] = useState(2);
  const [copied, setCopied] = useState(false);

  let output = "";
  let error = "";
  if (input.trim()) {
    try {
      const opts: FormatOptionsWithLanguage = { language, keywordCase, tabWidth };
      output = format(input, opts);
    } catch {
      error = t.error;
    }
  }

  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      track("tool_use", { tool: "sql-formatter", action: "copy" });
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  }

  const areaCls =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-mono leading-relaxed outline-none focus:border-[var(--accent)] resize-y";
  const selectCls =
    "rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-sm outline-none focus:border-[var(--accent)]";
  const caseBtn = (active: boolean) =>
    `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
    }`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          {t.dialect}
          <select
            className={selectCls}
            value={language}
            onChange={(e) => setLanguage(e.target.value as SqlLanguage)}
          >
            {DIALECTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          {t.keywordCase}
          <div className="flex gap-1 rounded-lg border border-[var(--border)] p-1">
            <button type="button" className={caseBtn(keywordCase === "upper")} onClick={() => setKeywordCase("upper")}>
              {t.caseUpper}
            </button>
            <button type="button" className={caseBtn(keywordCase === "lower")} onClick={() => setKeywordCase("lower")}>
              {t.caseLower}
            </button>
            <button
              type="button"
              className={caseBtn(keywordCase === "preserve")}
              onClick={() => setKeywordCase("preserve")}
            >
              {t.casePreserve}
            </button>
          </div>
        </div>

        <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
          {t.indent}
          <select className={selectCls} value={tabWidth} onChange={(e) => setTabWidth(Number(e.target.value))}>
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={8}>8</option>
          </select>
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
