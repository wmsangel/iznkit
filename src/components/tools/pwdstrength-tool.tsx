"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const COLORS = ["#e11d48", "#f59e0b", "#eab308", "#16a34a", "#059669"];

export function PwdStrengthTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).pwdStrength;
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);

  const hasLower = /[a-z]/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasDigit = /[0-9]/.test(pwd);
  const hasSymbol = /[^a-zA-Z0-9]/.test(pwd);
  const pool =
    (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasDigit ? 10 : 0) + (hasSymbol ? 33 : 0);
  const entropy = pwd.length > 0 && pool > 0 ? pwd.length * Math.log2(pool) : 0;

  const sIdx = entropy < 28 ? 0 : entropy < 36 ? 1 : entropy < 60 ? 2 : entropy < 120 ? 3 : 4;
  const cIdx =
    entropy < 28 ? 0 : entropy < 36 ? 1 : entropy < 44 ? 2 : entropy < 52 ? 3 : entropy < 64 ? 4 : 5;
  const filled = pwd ? sIdx + 1 : 0;
  const color = COLORS[sIdx];

  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 pr-16 text-sm outline-none focus:border-[var(--accent)] font-mono";
  const chip = (on: boolean, label: string) => (
    <span
      className={`rounded-md px-2.5 py-1 text-xs font-mono ${
        on
          ? "bg-[var(--accent-soft)] text-[var(--accent)]"
          : "bg-[var(--card-2)] text-[var(--muted)] opacity-60"
      }`}
    >
      {label}
    </span>
  );
  const stat = (label: string, value: string) => (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{label}</div>
      <div className="mt-1 text-lg font-bold tabular-nums">{value}</div>
    </div>
  );

  return (
    <div className="max-w-2xl space-y-5">
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder={t.placeholder}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          {show ? t.hide : t.show}
        </button>
      </div>

      {/* strength meter */}
      <div>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="h-1.5 flex-1 rounded-full transition-colors"
              style={{ background: i < filled ? color : "var(--border)" }}
            />
          ))}
        </div>
        <div className="mt-2 text-sm font-semibold" style={{ color: pwd ? color : "var(--muted)" }}>
          {pwd ? t.levels[sIdx] : "—"}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {stat(t.entropy, pwd ? `${Math.round(entropy)} ${t.bits}` : "—")}
        {stat(t.crackTime, pwd ? t.crack[cIdx] : "—")}
        {stat(t.length, String(pwd.length))}
      </div>

      <div className="flex flex-wrap gap-2">
        {chip(hasLower, t.hasLower)}
        {chip(hasUpper, t.hasUpper)}
        {chip(hasDigit, t.hasDigit)}
        {chip(hasSymbol, t.hasSymbol)}
      </div>

      <p className="text-xs text-[var(--muted)] flex items-center gap-1.5">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        {t.privateNote}
      </p>
    </div>
  );
}
