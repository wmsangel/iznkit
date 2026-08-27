"use client";
import { track } from "@/lib/analytics";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

function relative(ms: number, locale: Locale): string {
  const diff = ms - Date.now();
  const rtf = new Intl.RelativeTimeFormat(locale === "ru" ? "ru" : "en", { numeric: "auto" });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31536000000],
    ["month", 2592000000],
    ["day", 86400000],
    ["hour", 3600000],
    ["minute", 60000],
    ["second", 1000],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(diff) >= size || unit === "second") {
      return rtf.format(Math.round(diff / size), unit);
    }
  }
  return "";
}

export function TimestampTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).ts;

  const [now, setNow] = useState<number | null>(null);
  const [tsInput, setTsInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const fromTs = useMemo(() => {
    const raw = tsInput.trim();
    if (!raw) return null;
    const n = Number(raw);
    if (!Number.isFinite(n)) return { error: true as const };
    // Treat 12+ digit integers as milliseconds, otherwise seconds.
    const isMs = Math.abs(Math.trunc(n)).toString().length >= 12;
    const ms = isMs ? n : n * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return { error: true as const };
    return {
      error: false as const,
      local: d.toLocaleString(),
      utc: d.toUTCString(),
      iso: d.toISOString(),
      rel: relative(ms, locale),
    };
  }, [tsInput, locale]);

  const fromDate = useMemo(() => {
    if (!dateInput) return null;
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return { error: true as const };
    return { error: false as const, sec: Math.floor(d.getTime() / 1000), ms: d.getTime() };
  }, [dateInput]);

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      track("tool_use", { tool: "timestamp", action: "copy" });
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const card = "rounded-xl border border-[var(--border)] bg-[var(--card)] p-5";
  const inputCls =
    "w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 font-mono text-sm outline-none focus:border-[var(--accent)]";

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Now */}
      <div className={card}>
        <div className="eyebrow mb-3">{t.now}</div>
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <CopyStat
            label={t.seconds}
            value={now === null ? "…" : String(Math.floor(now / 1000))}
            onCopy={() => now !== null && copy(String(Math.floor(now / 1000)), "now-s")}
            copied={copied === "now-s"}
            t={t}
          />
          <CopyStat
            label={t.ms}
            value={now === null ? "…" : String(now)}
            onCopy={() => now !== null && copy(String(now), "now-ms")}
            copied={copied === "now-ms"}
            t={t}
          />
        </div>
      </div>

      {/* Timestamp -> date */}
      <div className={card}>
        <div className="eyebrow mb-3">{t.tsToDate}</div>
        <input
          value={tsInput}
          onChange={(e) => setTsInput(e.target.value)}
          placeholder={t.tsPlaceholder}
          inputMode="numeric"
          className={inputCls}
        />
        {fromTs && !fromTs.error ? (
          <div className="mt-4 text-sm divide-y divide-[var(--border)]">
            <Row label={t.local} value={fromTs.local} />
            <Row label={t.utc} value={fromTs.utc} />
            <Row label={t.iso} value={fromTs.iso} />
            <Row label={t.relative} value={fromTs.rel} />
          </div>
        ) : fromTs?.error ? (
          <p className="mt-3 text-sm text-[var(--bad)]">{t.invalid}</p>
        ) : null}
      </div>

      {/* Date -> timestamp */}
      <div className={card}>
        <div className="eyebrow mb-3">{t.dateToTs}</div>
        <input
          type="datetime-local"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className={inputCls}
        />
        {fromDate && !fromDate.error ? (
          <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
            <CopyStat
              label={t.seconds}
              value={String(fromDate.sec)}
              onCopy={() => copy(String(fromDate.sec), "d-s")}
              copied={copied === "d-s"}
              t={t}
            />
            <CopyStat
              label={t.ms}
              value={String(fromDate.ms)}
              onCopy={() => copy(String(fromDate.ms), "d-ms")}
              copied={copied === "d-ms"}
              t={t}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono text-right break-all">{value}</span>
    </div>
  );
}

function CopyStat({
  label,
  value,
  onCopy,
  copied,
  t,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
  t: { copy: string; copied: string };
}) {
  return (
    <div>
      <div className="eyebrow !tracking-normal text-[var(--faint)]">{label}</div>
      <div className="flex items-center gap-2 mt-1">
        <span className="font-mono text-lg tabular-nums">{value}</span>
        <button
          type="button"
          onClick={onCopy}
          className="text-xs font-medium text-[var(--accent)] hover:underline"
        >
          {copied ? t.copied : t.copy}
        </button>
      </div>
    </div>
  );
}
