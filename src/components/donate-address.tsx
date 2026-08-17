"use client";

import { useState } from "react";
import { DONATE } from "@/lib/donate";
import { track } from "@/lib/analytics";

export function DonateAddress({
  label,
  copy,
  copied,
}: {
  label: string;
  copy: string;
  copied: string;
}) {
  const [done, setDone] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(DONATE.tronAddress);
      setDone(true);
      track("copy_donate_address", { network: "tron" });
      setTimeout(() => setDone(false), 2000);
    } catch {
      /* clipboard blocked — the address is selectable in the field */
    }
  }

  return (
    <div>
      <label htmlFor="tron-addr" className="eyebrow">
        {label}
      </label>
      <div className="mt-2 flex flex-col sm:flex-row gap-2">
        <input
          id="tron-addr"
          readOnly
          value={DONATE.tronAddress}
          onFocus={(e) => e.currentTarget.select()}
          aria-label={label}
          className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 font-mono text-xs sm:text-sm outline-none focus:border-[var(--accent)]"
        />
        <button
          type="button"
          onClick={onCopy}
          className="btn-primary rounded-lg px-5 py-2.5 text-sm font-medium whitespace-nowrap"
        >
          {done ? copied : copy}
        </button>
      </div>
    </div>
  );
}
