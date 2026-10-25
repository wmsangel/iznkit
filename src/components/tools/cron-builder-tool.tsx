"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { track } from "@/lib/analytics";
import { parseCron, describeCron, nextRuns } from "@/lib/tools/cron";

type Preset = "everyMinute" | "everyHour" | "daily" | "weekly" | "monthly" | "custom";

const DOW_VALUES = ["0", "1", "2", "3", "4", "5", "6"] as const;

export function CronBuilderTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).cronBuilder;
  const [preset, setPreset] = useState<Preset>("daily");
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(0);
  const [dow, setDow] = useState("1");
  const [dom, setDom] = useState(1);
  const [fields, setFields] = useState({
    minute: "0",
    hour: "9",
    dom: "*",
    month: "*",
    dow: "*",
  });
  const [copied, setCopied] = useState(false);

  const expr = useMemo(() => {
    if (preset === "everyMinute") return "* * * * *";
    if (preset === "everyHour") return `${minute} * * * *`;
    if (preset === "daily") return `${minute} ${hour} * * *`;
    if (preset === "weekly") return `${minute} ${hour} * * ${dow}`;
    if (preset === "monthly") return `${minute} ${hour} ${dom} * *`;
    return `${fields.minute} ${fields.hour} ${fields.dom} ${fields.month} ${fields.dow}`;
  }, [preset, hour, minute, dow, dom, fields]);

  const parsed = useMemo(() => {
    const raw = expr.trim();
    const f = parseCron(raw);
    if (!f) return { fields: null, parts: [] as string[], desc: "" };
    const parts = raw.split(/\s+/);
    return { fields: f, parts, desc: describeCron(f, parts, locale) };
  }, [expr, locale]);

  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  const runs = useMemo(
    () => (parsed.fields && now ? nextRuns(parsed.fields, now, 5) : []),
    [parsed.fields, now],
  );

  const fmt = (d: Date) =>
    d.toLocaleString(locale === "ru" ? "ru-RU" : "en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  async function copyExpr() {
    try {
      await navigator.clipboard.writeText(expr);
      track("tool_use", { tool: "cron-builder", action: "copy" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const inputCls =
    "rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const seg = (active: boolean) =>
    `rounded-md px-2.5 py-1.5 text-xs font-medium border transition-colors ${
      active
        ? "border-[var(--accent)] text-[var(--accent)]"
        : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
    }`;

  const presets: { id: Preset; label: string }[] = [
    { id: "everyMinute", label: t.everyMinute },
    { id: "everyHour", label: t.everyHour },
    { id: "daily", label: t.daily },
    { id: "weekly", label: t.weekly },
    { id: "monthly", label: t.monthly },
    { id: "custom", label: t.custom },
  ];

  const dowLabels =
    locale === "ru"
      ? ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button key={p.id} type="button" onClick={() => setPreset(p.id)} className={seg(preset === p.id)}>
            {p.label}
          </button>
        ))}
      </div>

      {preset === "everyHour" || preset === "daily" || preset === "weekly" || preset === "monthly" ? (
        <div className="flex flex-wrap items-end gap-4">
          {(preset === "daily" || preset === "weekly" || preset === "monthly") && (
            <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
              {t.hour}
              <input
                type="number"
                min={0}
                max={23}
                value={hour}
                onChange={(e) => setHour(Math.min(23, Math.max(0, Number(e.target.value) || 0)))}
                className={inputCls + " w-20 font-mono"}
              />
            </label>
          )}
          <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
            {t.minute}
            <input
              type="number"
              min={0}
              max={59}
              value={minute}
              onChange={(e) => setMinute(Math.min(59, Math.max(0, Number(e.target.value) || 0)))}
              className={inputCls + " w-20 font-mono"}
            />
          </label>
          {preset === "weekly" ? (
            <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
              {t.dayOfWeek}
              <select value={dow} onChange={(e) => setDow(e.target.value)} className={inputCls}>
                {DOW_VALUES.map((v, i) => (
                  <option key={v} value={v}>
                    {dowLabels[i]}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {preset === "monthly" ? (
            <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
              {t.dayOfMonth}
              <input
                type="number"
                min={1}
                max={31}
                value={dom}
                onChange={(e) => setDom(Math.min(31, Math.max(1, Number(e.target.value) || 1)))}
                className={inputCls + " w-20 font-mono"}
              />
            </label>
          ) : null}
        </div>
      ) : null}

      {preset === "custom" ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(
            [
              ["minute", t.fieldMinute],
              ["hour", t.fieldHour],
              ["dom", t.fieldDom],
              ["month", t.fieldMonth],
              ["dow", t.fieldDow],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
              {label}
              <input
                value={fields[key]}
                onChange={(e) => setFields((f) => ({ ...f, [key]: e.target.value }))}
                spellCheck={false}
                className={inputCls + " font-mono"}
              />
            </label>
          ))}
        </div>
      ) : null}

      <div className="rounded-xl border border-[var(--border)] bg-[var(--accent-soft)] px-4 py-4">
        <div className="flex items-center justify-between gap-3 mb-1">
          <span className="eyebrow">{t.expression}</span>
          <button
            type="button"
            onClick={copyExpr}
            className="text-xs font-medium text-[var(--accent)] hover:underline"
          >
            {copied ? t.copied : t.copy}
          </button>
        </div>
        <p className="font-mono text-lg font-medium">{expr}</p>
        {parsed.fields ? (
          <p className="mt-2 text-sm text-[var(--muted)]">{parsed.desc}</p>
        ) : (
          <p className="mt-2 text-sm text-[var(--bad)]">{t.invalid}</p>
        )}
      </div>

      {parsed.fields && now ? (
        <div>
          <div className="eyebrow mb-3">{t.nextRuns}</div>
          {runs.length ? (
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
      ) : null}
    </div>
  );
}
