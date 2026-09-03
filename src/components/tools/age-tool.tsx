"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useHydrateFromUrl } from "@/lib/tools/share";
import { ShareLink } from "./share-link";

const DAY = 86400000;

/** Calendar-aware years/months/days between two dates (earlier -> later). */
function ymd(a: Date, b: Date) {
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

const n0 = (n: number) => (Number.isFinite(n) ? Math.round(n).toLocaleString("en-US") : "—");

export function AgeTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).age;

  const [dob, setDob] = useState("2000-01-01");
  // "today" is only known on the client — keep it out of the first render to
  // avoid a hydration mismatch.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  useHydrateFromUrl((sp) => {
    const d = sp.get("dob");
    if (d) setDob(d);
  });

  const birth = new Date(dob);
  const ready =
    now !== null && !Number.isNaN(birth.getTime()) && birth.getTime() <= now.getTime();

  let br = { y: NaN, m: NaN, d: NaN };
  let totalDays = NaN;
  let nextBday = NaN;
  if (ready && now) {
    br = ymd(birth, now);
    totalDays = Math.floor((now.getTime() - birth.getTime()) / DAY);
    let nb = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nb.getTime() < now.getTime()) {
      nb = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    nextBday = Math.ceil((nb.getTime() - now.getTime()) / DAY);
  }

  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";
  const stat = (label: string, value: string, accent = false) => (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-center">
      <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{label}</div>
      <div className={`mt-1 text-xl font-bold tabular-nums ${accent ? "text-[var(--accent)]" : ""}`}>
        {value}
      </div>
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="self-start">
        <label className={labelCls}>{t.birthDate}</label>
        <input
          type="date"
          className={`${inputCls} max-w-56`}
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
      </div>

      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {stat(t.years, n0(br.y), true)}
          {stat(t.months, n0(br.m))}
          {stat(t.days, n0(br.d))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {stat(t.totalDays, n0(totalDays))}
          {stat(t.totalWeeks, n0(totalDays / 7))}
          {stat(t.nextBirthday, n0(nextBday))}
        </div>
        <ShareLink slug="age-calculator" values={{ dob }} locale={locale} />
      </div>
    </div>
  );
}
