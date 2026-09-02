"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useHydrateFromUrl } from "@/lib/tools/share";
import { ShareLink } from "./share-link";

const DAY = 86400000;

/** Calendar-aware years/months/days between two dates (earlier -> later). */
function breakdown(a: Date, b: Date) {
  let y = b.getFullYear() - a.getFullYear();
  let m = b.getMonth() - a.getMonth();
  let d = b.getDate() - a.getDate();
  if (d < 0) {
    m -= 1;
    d += new Date(b.getFullYear(), b.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }
  return { y, m, d };
}

function n0(n: number): string {
  return Number.isFinite(n) ? Math.round(n).toLocaleString("en-US") : "—";
}
function n1(n: number): string {
  return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 1 }) : "—";
}

export function DateDiffTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).dateDiff;

  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-12-31");

  useHydrateFromUrl((sp) => {
    const f = sp.get("from");
    if (f) setFrom(f);
    const tt = sp.get("to");
    if (tt) setTo(tt);
  });

  const d1 = new Date(from);
  const d2 = new Date(to);
  const valid = !Number.isNaN(d1.getTime()) && !Number.isNaN(d2.getTime());
  const days = valid ? Math.round((d2.getTime() - d1.getTime()) / DAY) : NaN;
  const absDays = Math.abs(days);
  const [early, late] = valid && d2.getTime() >= d1.getTime() ? [d1, d2] : [d2, d1];
  const br = valid ? breakdown(early, late) : { y: 0, m: 0, d: 0 };

  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";
  const stat = (label: string, value: string) => (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-center">
      <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{label}</div>
      <div className="mt-1 text-xl font-bold tabular-nums">{value}</div>
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="grid grid-cols-2 gap-3 self-start">
        <div>
          <label className={labelCls}>{t.from}</label>
          <input type="date" className={inputCls} value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>{t.to}</label>
          <input type="date" className={inputCls} value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>

      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {stat(t.days, n0(absDays))}
          {stat(t.weeks, n1(absDays / 7))}
          {stat(t.months, n1(absDays / 30.4375))}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.breakdown}</div>
          <div className="mt-1 text-lg font-semibold tabular-nums">
            {valid ? `${br.y} · ${br.m} · ${br.d}` : "—"}
          </div>
        </div>
        <ShareLink slug="date-difference" values={{ from, to }} locale={locale} />
      </div>
    </div>
  );
}
