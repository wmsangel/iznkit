"use client";
import { track } from "@/lib/analytics";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const;
type Algo = (typeof ALGOS)[number];

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function HashTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).hash;

  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Partial<Record<Algo, string>>>({});
  const [copied, setCopied] = useState<Algo | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!input) {
      setHashes({});
      return;
    }
    (async () => {
      const data = new TextEncoder().encode(input);
      const out: Partial<Record<Algo, string>> = {};
      for (const algo of ALGOS) {
        out[algo] = toHex(await crypto.subtle.digest(algo, data));
      }
      if (!cancelled) setHashes(out);
    })();
    return () => {
      cancelled = true;
    };
  }, [input]);

  async function copy(algo: Algo, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      track("tool_use", { tool: "hash", action: "copy" });
      setCopied(algo);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const hasHashes = Object.keys(hashes).length > 0;

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <label className="eyebrow mb-2 inline-block">{t.input}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          spellCheck={false}
          className="w-full h-32 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 font-mono text-[13px] leading-relaxed outline-none resize-none focus:border-[var(--accent)]"
        />
      </div>

      {hasHashes ? (
        <div className="space-y-3">
          {ALGOS.map((algo) => (
            <div key={algo}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="eyebrow">{algo}</span>
                <button
                  type="button"
                  onClick={() => copy(algo, hashes[algo] ?? "")}
                  className="text-xs font-medium text-[var(--accent)] hover:underline"
                >
                  {copied === algo ? t.copied : t.copy}
                </button>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 font-mono text-[13px] break-all">
                {hashes[algo]}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--muted)]">{t.empty}</p>
      )}
    </div>
  );
}
