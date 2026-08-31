"use client";
import { track } from "@/lib/analytics";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Op = { type: "same" | "add" | "del"; text: string };

/** Line-based LCS diff. Falls back to a plain compare on very large inputs. */
function diffLines(aText: string, bText: string): Op[] {
  const a = aText.split("\n");
  const b = bText.split("\n");
  const n = a.length;
  const m = b.length;

  // Guard against O(n*m) blow-up on huge inputs.
  if (n * m > 4_000_000) {
    const ops: Op[] = [];
    const max = Math.max(n, m);
    for (let i = 0; i < max; i++) {
      if (i < n && i < m && a[i] === b[i]) ops.push({ type: "same", text: a[i] });
      else {
        if (i < n) ops.push({ type: "del", text: a[i] });
        if (i < m) ops.push({ type: "add", text: b[i] });
      }
    }
    return ops;
  }

  // LCS table.
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const ops: Op[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push({ type: "same", text: a[i] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      ops.push({ type: "del", text: a[i] });
      i++;
    } else {
      ops.push({ type: "add", text: b[j] });
      j++;
    }
  }
  while (i < n) ops.push({ type: "del", text: a[i++] });
  while (j < m) ops.push({ type: "add", text: b[j++] });
  return ops;
}

export function DiffTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).diff;
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [copied, setCopied] = useState(false);

  const { ops, added, removed } = useMemo(() => {
    if (!left && !right) return { ops: [] as Op[], added: 0, removed: 0 };
    const ops = diffLines(left, right);
    let added = 0;
    let removed = 0;
    for (const o of ops) {
      if (o.type === "add") added++;
      else if (o.type === "del") removed++;
    }
    return { ops, added, removed };
  }, [left, right]);

  const identical = ops.length > 0 && added === 0 && removed === 0;

  async function copyDiff() {
    const text = ops
      .map((o) => (o.type === "add" ? "+ " : o.type === "del" ? "- " : "  ") + o.text)
      .join("\n");
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      track("tool_use", { tool: "text-diff", action: "copy" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const area =
    "w-full h-56 rounded-xl border bg-[var(--card)] p-3 font-mono text-[13px] leading-relaxed outline-none resize-none border-[var(--border)] focus:border-[var(--accent)]";

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <label className="eyebrow mb-2 inline-block">{t.original}</label>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder={t.placeholderA}
            spellCheck={false}
            className={area}
          />
        </div>
        <div>
          <label className="eyebrow mb-2 inline-block">{t.changed}</label>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder={t.placeholderB}
            spellCheck={false}
            className={area}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-medium">{t.result}</span>
          {ops.length > 0 ? (
            <span className="inline-flex items-center gap-2 font-mono text-xs">
              <span className="text-[var(--good)]">+{added}</span>
              <span className="text-[var(--bad)]">−{removed}</span>
            </span>
          ) : null}
        </div>
        {ops.length > 0 && !identical ? (
          <button
            type="button"
            onClick={copyDiff}
            className="text-xs font-medium text-[var(--accent)] hover:underline"
          >
            {copied ? t.copied : t.copy}
          </button>
        ) : null}
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
        {ops.length === 0 ? (
          <p className="text-sm text-[var(--muted)] p-4">{t.empty}</p>
        ) : identical ? (
          <p className="text-sm text-[var(--good)] p-4">✓ {t.identical}</p>
        ) : (
          <div className="overflow-x-auto">
            <pre className="text-[13px] leading-relaxed font-mono min-w-full">
              {ops.map((o, idx) => (
                <div
                  key={idx}
                  className={o.type === "same" ? "text-[var(--muted)]" : "text-[var(--foreground)]"}
                  style={
                    o.type === "add"
                      ? { background: "color-mix(in srgb, var(--good) 13%, transparent)" }
                      : o.type === "del"
                        ? { background: "color-mix(in srgb, var(--bad) 13%, transparent)" }
                        : undefined
                  }
                >
                  <span
                    className={
                      "select-none inline-block w-6 text-center " +
                      (o.type === "add"
                        ? "text-[var(--good)]"
                        : o.type === "del"
                          ? "text-[var(--bad)]"
                          : "text-[var(--muted)]")
                    }
                  >
                    {o.type === "add" ? "+" : o.type === "del" ? "−" : " "}
                  </span>
                  <span className="whitespace-pre-wrap break-words">{o.text || " "}</span>
                </div>
              ))}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
