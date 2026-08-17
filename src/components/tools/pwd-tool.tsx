"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/",
};
const AMBIGUOUS = new Set("O0oIl1|");

/** Cryptographically-strong random index in [0, max). */
function randInt(max: number): number {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / max) * max; // reject bias
  let x = 0;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
  return x % max;
}

export function PwdTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).pwd;

  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const pool = useMemo(() => {
    let chars = "";
    (Object.keys(SETS) as (keyof typeof SETS)[]).forEach((k) => {
      if (opts[k]) chars += SETS[k];
    });
    if (avoidAmbiguous) {
      chars = [...chars].filter((c) => !AMBIGUOUS.has(c)).join("");
    }
    return chars;
  }, [opts, avoidAmbiguous]);

  const generate = useCallback(() => {
    if (!pool) {
      setPassword("");
      return;
    }
    let out = "";
    for (let i = 0; i < length; i++) out += pool[randInt(pool.length)];
    setPassword(out);
    setCopied(false);
  }, [pool, length]);

  // Regenerate whenever the recipe changes (and once on mount).
  useEffect(() => {
    generate();
  }, [generate]);

  const entropy = pool ? Math.round(length * Math.log2(pool.length)) : 0;
  const strength =
    entropy >= 110
      ? { label: t.veryStrong, tone: "var(--good)", pct: 100 }
      : entropy >= 75
        ? { label: t.strong, tone: "var(--accent)", pct: 75 }
        : entropy >= 45
          ? { label: t.fair, tone: "#d97706", pct: 50 }
          : { label: t.weak, tone: "var(--bad)", pct: 25 };

  async function copy() {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const toggle = (k: keyof typeof opts) =>
    setOpts((o) => ({ ...o, [k]: !o[k] }));

  const checkboxRow =
    "flex items-center gap-2.5 text-sm cursor-pointer select-none py-1.5";

  return (
    <div className="max-w-2xl space-y-6">
      {/* Output */}
      <div className="card rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 font-mono text-lg sm:text-xl break-all min-h-[1.75rem]">
            {password || <span className="text-[var(--muted)]">{t.pickOne}</span>}
          </div>
          <button
            type="button"
            onClick={generate}
            aria-label={t.generate}
            title={t.generate}
            className="btn-outline grid place-items-center w-10 h-10 rounded-lg shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </button>
          <button
            type="button"
            onClick={copy}
            disabled={!password}
            className="btn-primary rounded-lg px-4 h-10 text-sm font-medium shrink-0 disabled:opacity-50"
          >
            {copied ? t.copied : t.copy}
          </button>
        </div>

        {/* Strength bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-1.5 rounded-full bg-[var(--card-2)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${strength.pct}%`, background: strength.tone }}
            />
          </div>
          <span className="text-xs font-medium" style={{ color: strength.tone }}>
            {strength.label}
          </span>
          <span className="text-xs text-[var(--muted)] tabular-nums">
            {entropy} {t.entropy}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="card rounded-xl p-5 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="pwd-len" className="text-sm font-medium">
              {t.length}
            </label>
            <span className="font-mono text-sm tabular-nums">{length}</span>
          </div>
          <input
            id="pwd-len"
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-x-6">
          {(Object.keys(SETS) as (keyof typeof SETS)[]).map((k) => (
            <label key={k} className={checkboxRow}>
              <input
                type="checkbox"
                checked={opts[k]}
                onChange={() => toggle(k)}
                className="w-4 h-4 accent-[var(--accent)]"
              />
              {t[k]}
            </label>
          ))}
          <label className={checkboxRow}>
            <input
              type="checkbox"
              checked={avoidAmbiguous}
              onChange={() => setAvoidAmbiguous((v) => !v)}
              className="w-4 h-4 accent-[var(--accent)]"
            />
            {t.avoidAmbiguous}
          </label>
        </div>
      </div>
    </div>
  );
}
