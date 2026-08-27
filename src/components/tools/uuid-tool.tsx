"use client";
import { track } from "@/lib/analytics";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function UuidTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).uuid;

  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [ids, setIds] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | "all" | null>(null);

  function generate() {
    const n = Math.min(Math.max(Math.floor(count) || 1, 1), 100);
    setIds(Array.from({ length: n }, () => crypto.randomUUID()));
    setCopied(null);
  }

  // Generate an initial batch on mount.
  useEffect(() => {
    setIds(Array.from({ length: 5 }, () => crypto.randomUUID()));
  }, []);

  const display = useMemo(
    () =>
      ids.map((id) => {
        let s = hyphens ? id : id.replace(/-/g, "");
        if (uppercase) s = s.toUpperCase();
        return s;
      }),
    [ids, hyphens, uppercase],
  );

  async function copy(text: string, key: number | "all") {
    try {
      await navigator.clipboard.writeText(text);
      track("tool_use", { tool: "uuid", action: "copy" });
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const seg = "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors";

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="uuid-count" className="eyebrow mb-1.5 inline-block">
            {t.count}
          </label>
          <input
            id="uuid-count"
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-24 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
          />
        </div>
        <button type="button" onClick={generate} className={`btn-primary ${seg}`}>
          {t.generate}
        </button>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input type="checkbox" checked={hyphens} onChange={() => setHyphens((v) => !v)} className="w-4 h-4 accent-[var(--accent)]" />
          {t.hyphens}
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input type="checkbox" checked={uppercase} onChange={() => setUppercase((v) => !v)} className="w-4 h-4 accent-[var(--accent)]" />
          {t.uppercase}
        </label>
        {display.length > 1 ? (
          <button
            type="button"
            onClick={() => copy(display.join("\n"), "all")}
            className={`btn-outline ${seg} ml-auto`}
          >
            {copied === "all" ? t.copied : t.copyAll}
          </button>
        ) : null}
      </div>

      <div className="rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
        {display.map((id, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2.5">
            <span className="flex-1 font-mono text-sm break-all">{id}</span>
            <button
              type="button"
              onClick={() => copy(id, i)}
              className="text-xs font-medium text-[var(--accent)] hover:underline shrink-0"
            >
              {copied === i ? t.copied : t.copy}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
