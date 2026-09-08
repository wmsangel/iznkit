"use client";

import { useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useHydrateFromUrl, numParam } from "@/lib/tools/share";
import { ShareLink } from "./share-link";

const money = (n: number) => (Number.isFinite(n) ? Math.round(n).toLocaleString("en-US") : "—");
const units = (n: number) => (Number.isFinite(n) ? Math.ceil(n).toLocaleString("en-US") : "—");

export function BreakEvenTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).breakEven;

  const [fixed, setFixed] = useState(5000);
  const [price, setPrice] = useState(25);
  const [variable, setVariable] = useState(10);

  useHydrateFromUrl((sp) => {
    setFixed(numParam(sp, "fixed", fixed));
    setPrice(numParam(sp, "price", price));
    setVariable(numParam(sp, "variable", variable));
  });

  const contribution = price - variable;
  const hasBE = contribution > 0 && fixed >= 0;
  const beUnits = hasBE ? fixed / contribution : NaN;
  const beRevenue = hasBE ? beUnits * price : NaN;

  const num = (v: string) => (v === "" ? 0 : Number(v));
  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";

  // ---- chart geometry ----
  const W = 440;
  const H = 260;
  const padL = 8;
  const padR = 10;
  const padT = 12;
  const padB = 22;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  let chart: ReactNode = null;
  if (hasBE && beUnits > 0 && Number.isFinite(beUnits)) {
    const maxU = Math.max(1, Math.ceil(beUnits * 2));
    const revMax = price * maxU;
    const costMax = fixed + variable * maxU;
    const maxY = Math.max(revMax, costMax) || 1;
    const x = (u: number) => padL + (u / maxU) * plotW;
    const y = (m: number) => padT + plotH - (m / maxY) * plotH;

    const bx = x(beUnits);
    const by = y(beRevenue);

    chart = (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Break-even chart">
        {/* profit zone (revenue above cost, after break-even) */}
        <polygon
          points={`${bx},${by} ${x(maxU)},${y(revMax)} ${x(maxU)},${y(costMax)}`}
          fill="var(--accent)"
          opacity="0.12"
        />
        {/* axes */}
        <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke="var(--border)" strokeWidth="1" />
        {/* total cost line */}
        <line x1={x(0)} y1={y(fixed)} x2={x(maxU)} y2={y(costMax)} stroke="#e11d48" strokeWidth="2" />
        {/* revenue line */}
        <line x1={x(0)} y1={y(0)} x2={x(maxU)} y2={y(revMax)} stroke="var(--accent)" strokeWidth="2" />
        {/* break-even marker */}
        <line x1={bx} y1={by} x2={bx} y2={padT + plotH} stroke="var(--muted)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx={bx} cy={by} r="4.5" fill="var(--background)" stroke="var(--accent)" strokeWidth="2.5" />
      </svg>
    );
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4 self-start">
        <div>
          <label className={labelCls}>{t.fixed}</label>
          <input type="number" step="100" className={inputCls} value={fixed} onChange={(e) => setFixed(num(e.target.value))} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t.price}</label>
            <input type="number" step="1" className={inputCls} value={price} onChange={(e) => setPrice(num(e.target.value))} />
          </div>
          <div>
            <label className={labelCls}>{t.variable}</label>
            <input type="number" step="1" className={inputCls} value={variable} onChange={(e) => setVariable(num(e.target.value))} />
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.contribution}</div>
          <div className={`mt-1 text-lg font-bold tabular-nums ${contribution > 0 ? "" : "text-red-500"}`}>
            {money(contribution)}
          </div>
        </div>
      </div>

      <div className="self-start space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.beUnits}</div>
            <div className="mt-1 text-2xl font-bold gradient-text tabular-nums">{hasBE ? units(beUnits) : "—"}</div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.beRevenue}</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{hasBE ? money(beRevenue) : "—"}</div>
          </div>
        </div>
        {chart ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
            {chart}
            <div className="mt-1 flex items-center gap-4 text-xs text-[var(--muted)]">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4 bg-[var(--accent)]" />
                {t.revenue}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-4" style={{ background: "#e11d48" }} />
                {t.totalCost}
              </span>
            </div>
          </div>
        ) : (
          <p className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm text-red-500">
            {t.never}
          </p>
        )}
        <ShareLink slug="break-even-calculator" values={{ fixed, price, variable }} locale={locale} />
      </div>
    </div>
  );
}
