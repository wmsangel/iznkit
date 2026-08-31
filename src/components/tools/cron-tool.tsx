"use client";
import { track } from "@/lib/analytics";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { parseCron, describeCron, nextRuns } from "@/lib/tools/cron";

const FIELD_LABELS: Record<Locale, string[]> = {
  en: ["Minute", "Hour", "Day of month", "Month", "Day of week"],
  ru: ["Минута", "Час", "День месяца", "Месяц", "День недели"],
};

export function CronTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).cron;
  const [expr, setExpr] = useState("0 9 * * 1-5");
  const [copied, setCopied] = useState(false);

  const parsed = useMemo(() => {
    const raw = expr.trim();
    if (!raw) return { fields: null, parts: [] as string[], desc: "" };
    const fields = parseCron(raw);
    if (!fields) return { fields: null, parts: [] as string[], desc: "" };
    const parts = raw.split(/\s+/);
    return { fields, parts, desc: describeCron(fields, parts, locale) };
  }, [expr, locale]);

  // Next-run times depend on the current clock, so compute them only after
  // mount — otherwise the server and client would render different times.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  const runs = useMemo(
    () => (parsed.fields && now ? nextRuns(parsed.fields, now, 5) : []),
    [parsed.fields, now],
  );

  const invalid = expr.trim() !== "" && !parsed.fields;
  const fmt = (d: Date) =>
    d.toLocaleString(locale === "ru" ? "ru-RU" : "en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  async function copyRuns() {
    if (!runs.length) return;
    try {
      await navigator.clipboard.writeText(runs.map(fmt).join("\n"));
      track("tool_use", { tool: "cron-parser", action: "copy" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <label className="eyebrow mb-2 inline-block">{t.input}</label>
        <input
          type="text"
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          placeholder={t.placeholder}
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          className={`w-full rounded-xl border bg-[var(--card)] px-4 py-3 font-mono text-base outline-none ${
            invalid ? "border-[var(--bad)]" : "border-[var(--border)]"
          } focus:border-[var(--accent)]`}
        />
        {invalid ? <p className="mt-2 text-sm text-[var(--bad)]">⚠ {t.invalid}</p> : null}
      </div>

      {parsed.fields ? (
        <>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] px-4 py-4">
            <div className="eyebrow mb-1">{t.explanation}</div>
            <p className="text-lg font-medium">{parsed.desc}</p>
          </div>

          <div>
            <div className="eyebrow mb-3">{t.fields}</div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {parsed.parts.map((p, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2"
                >
                  <div className="text-[11px] uppercase tracking-wide text-[var(--muted)]">
                    {FIELD_LABELS[locale][i]}
                  </div>
                  <div className="font-mono text-sm mt-0.5 break-all">{p}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="eyebrow">{t.nextRuns}</span>
              {runs.length ? (
                <button
                  type="button"
                  onClick={copyRuns}
                  className="text-xs font-medium text-[var(--accent)] hover:underline"
                >
                  {copied ? t.copied : t.copy}
                </button>
              ) : null}
            </div>
            {now === null ? null : runs.length ? (
              <ol className="divide-y divide-[var(--border)] border-y border-[var(--border)]">
                {runs.map((d, i) => (
                  <li key={i} className="flex items-center gap-3 py-2.5">
                    <span className="w-5 text-xs font-mono text-[var(--muted)]">{i + 1}</span>
                    <span className="font-mono text-sm tabular-nums">{fmt(d)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-[var(--muted)]">{t.none}</p>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
