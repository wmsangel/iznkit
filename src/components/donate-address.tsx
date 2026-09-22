"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import type { DonateNetwork } from "@/lib/donate";

export function DonateAddress({
  net,
  label,
  copy,
  copied,
}: {
  net: DonateNetwork;
  label: string;
  copy: string;
  copied: string;
}) {
  const [done, setDone] = useState(false);
  const inputId = `addr-${net.id}`;

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(net.address);
      setDone(true);
      track("copy_donate_address", { network: net.id });
      setTimeout(() => setDone(false), 2000);
    } catch {
      /* clipboard blocked — the address is selectable in the field */
    }
  }

  return (
    <div>
      <label htmlFor={inputId} className="eyebrow">
        {label}
      </label>
      <div className="mt-2 flex flex-col sm:flex-row gap-2">
        <input
          id={inputId}
          readOnly
          value={net.address}
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
