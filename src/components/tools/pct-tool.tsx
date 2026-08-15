"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { round2 } from "@/lib/format";

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return round2(n).toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function PctTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).pct;

  const [ofP, setOfP] = useState(20);
  const [ofY, setOfY] = useState(150);
  const [whatA, setWhatA] = useState(30);
  const [whatB, setWhatB] = useState(120);
  const [from, setFrom] = useState(80);
  const [to, setTo] = useState(100);

  const inputCls = "w-24 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const card = "rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5";
  const num = (v: string) => (v === "" ? 0 : Number(v));

  const ofRes = ofY * (ofP / 100);
  const whatRes = whatB !== 0 ? (whatA / whatB) * 100 : NaN;
  const changeRes = from !== 0 ? ((to - from) / from) * 100 : NaN;

  return (
    <div className="grid md:grid-cols-3 gap-5">
      <div className={card}>
        <div className="font-semibold mb-4">{t.ofTitle}</div>
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <input type="number" className={inputCls} value={ofP} onChange={(e) => setOfP(num(e.target.value))} />
          <span className="text-[var(--muted)]">% {t.ofY}</span>
          <input type="number" className={inputCls} value={ofY} onChange={(e) => setOfY(num(e.target.value))} />
        </div>
        <div className="mt-4 text-sm text-[var(--muted)]">{t.ofResult}</div>
        <div className="text-3xl font-bold gradient-text">{fmt(ofRes)}</div>
      </div>

      <div className={card}>
        <div className="font-semibold mb-4">{t.whatTitle}</div>
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <input type="number" className={inputCls} value={whatA} onChange={(e) => setWhatA(num(e.target.value))} />
          <span className="text-[var(--muted)]">{t.whatB}</span>
          <input type="number" className={inputCls} value={whatB} onChange={(e) => setWhatB(num(e.target.value))} />
        </div>
        <div className="mt-4 text-sm text-[var(--muted)]">{t.whatResult}</div>
        <div className="text-3xl font-bold gradient-text">{fmt(whatRes)}%</div>
      </div>

      <div className={card}>
        <div className="font-semibold mb-4">{t.changeTitle}</div>
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <input type="number" className={inputCls} value={from} onChange={(e) => setFrom(num(e.target.value))} />
          <span className="text-[var(--muted)]">→</span>
          <input type="number" className={inputCls} value={to} onChange={(e) => setTo(num(e.target.value))} />
        </div>
        <div className="mt-4 text-sm text-[var(--muted)]">{t.changeResult}</div>
        <div
          className="text-3xl font-bold"
          style={{ color: changeRes >= 0 ? "#059669" : "#e11d48" }}
        >
          {changeRes >= 0 ? "+" : ""}
          {fmt(changeRes)}%
        </div>
      </div>
    </div>
  );
}
