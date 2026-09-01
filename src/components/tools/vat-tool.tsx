"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { useHydrateFromUrl, numParam } from "@/lib/tools/share";
import { ShareLink } from "./share-link";

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function VatTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).vat;

  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(20);
  const [mode, setMode] = useState<"add" | "remove">("add");

  useHydrateFromUrl((sp) => {
    setAmount(numParam(sp, "amount", amount));
    setRate(numParam(sp, "rate", rate));
    const m = sp.get("mode");
    if (m === "add" || m === "remove") setMode(m);
  });

  const r = rate / 100;
  let net: number, vat: number, gross: number;
  if (mode === "add") {
    net = amount;
    vat = amount * r;
    gross = amount + vat;
  } else {
    gross = amount;
    net = 1 + r !== 0 ? amount / (1 + r) : NaN;
    vat = gross - net;
  }

  const num = (v: string) => (v === "" ? 0 : Number(v));
  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";
  const tabCls = (active: boolean) =>
    `flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
      active
        ? "bg-[var(--accent)] text-[var(--accent-fg)]"
        : "bg-[var(--card)] text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]"
    }`;

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-5">
        <div className="flex gap-2">
          <button type="button" className={tabCls(mode === "add")} onClick={() => setMode("add")}>
            {t.addMode}
          </button>
          <button
            type="button"
            className={tabCls(mode === "remove")}
            onClick={() => setMode("remove")}
          >
            {t.removeMode}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>{t.amount}</label>
            <input
              type="number"
              step="1"
              className={inputCls}
              value={amount}
              onChange={(e) => setAmount(num(e.target.value))}
            />
          </div>
          <div>
            <label className={labelCls}>{t.rate}</label>
            <input
              type="number"
              step="0.1"
              className={inputCls}
              value={rate}
              onChange={(e) => setRate(num(e.target.value))}
            />
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.net}</div>
            <div className="mt-1 text-lg font-bold tabular-nums">{fmt(net)}</div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.vat}</div>
            <div className="mt-1 text-lg font-bold text-[var(--accent)] tabular-nums">{fmt(vat)}</div>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{t.gross}</div>
            <div className="mt-1 text-lg font-bold tabular-nums">{fmt(gross)}</div>
          </div>
        </div>
        <ShareLink slug="vat-calculator" values={{ amount, rate, mode }} locale={locale} />
      </div>
    </div>
  );
}
