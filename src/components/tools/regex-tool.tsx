"use client";

import { useMemo, useState, Fragment } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

interface Match {
  index: number;
  text: string;
  groups: (string | undefined)[];
}

export function RegexTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).regex;

  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [test, setTest] = useState(
    "Reach us at info@iznkit.com or ads@iznkit.com — not sales@example.",
  );

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [] as Match[], error: null as string | null };
    let re: RegExp;
    try {
      re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    } catch (e) {
      return { matches: [], error: e instanceof Error ? e.message : String(e) };
    }
    const out: Match[] = [];
    let m: RegExpExecArray | null;
    let guard = 0;
    while ((m = re.exec(test)) !== null) {
      out.push({ index: m.index, text: m[0], groups: m.slice(1) });
      if (m.index === re.lastIndex) re.lastIndex++;
      if (++guard > 10000) break;
    }
    return { matches: out, error: null };
  }, [pattern, flags, test]);

  // Build highlighted preview.
  const highlighted = useMemo(() => {
    if (error || matches.length === 0) return null;
    const nodes: React.ReactNode[] = [];
    let last = 0;
    matches.forEach((mt, i) => {
      if (mt.index > last) nodes.push(<Fragment key={`t${i}`}>{test.slice(last, mt.index)}</Fragment>);
      const end = mt.index + mt.text.length;
      if (mt.text.length > 0) {
        nodes.push(
          <mark
            key={`m${i}`}
            className="rounded px-0.5"
            style={{ background: "var(--accent-soft)", color: "var(--foreground)" }}
          >
            {test.slice(mt.index, end)}
          </mark>,
        );
      }
      last = end;
    });
    nodes.push(<Fragment key="tail">{test.slice(last)}</Fragment>);
    return nodes;
  }, [matches, test, error]);

  const inputCls =
    "rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 font-mono text-sm outline-none focus:border-[var(--accent)]";

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Pattern + flags */}
      <div>
        <label className="eyebrow mb-2 inline-block">{t.pattern}</label>
        <div className="flex items-stretch gap-2">
          <div
            className={`flex items-center flex-1 rounded-lg border bg-[var(--card)] pl-2.5 font-mono text-sm ${
              error ? "border-[var(--bad)]" : "border-[var(--border)]"
            } focus-within:border-[var(--accent)]`}
          >
            <span className="text-[var(--muted)] select-none">/</span>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              spellCheck={false}
              className="flex-1 bg-transparent px-1.5 py-2 outline-none"
              aria-label={t.pattern}
            />
            <span className="text-[var(--muted)] select-none pr-1">/</span>
          </div>
          <input
            value={flags}
            onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))}
            spellCheck={false}
            placeholder={t.flags}
            aria-label={t.flags}
            className={`${inputCls} w-24`}
          />
        </div>
        {error ? (
          <p className="mt-2 text-sm text-[var(--bad)] font-mono">
            {t.invalid} {error}
          </p>
        ) : null}
      </div>

      {/* Test string */}
      <div>
        <label className="eyebrow mb-2 inline-block">{t.testString}</label>
        <textarea
          value={test}
          onChange={(e) => setTest(e.target.value)}
          placeholder={t.placeholder}
          spellCheck={false}
          className="w-full h-32 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 font-mono text-[13px] leading-relaxed outline-none resize-none focus:border-[var(--accent)]"
        />
      </div>

      {/* Highlighted preview */}
      {highlighted ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card-2)] p-3 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words">
          {highlighted}
        </div>
      ) : null}

      {/* Matches */}
      <div>
        <div className="flex items-baseline gap-2">
          <span className="eyebrow">{t.matches}</span>
          {!error ? (
            <span className="text-sm font-semibold text-[var(--accent)]">{matches.length}</span>
          ) : null}
        </div>
        {error ? null : matches.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">{t.noMatches}</p>
        ) : (
          <div className="mt-3 space-y-2">
            {matches.slice(0, 100).map((m, i) => (
              <div
                key={i}
                className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-xs text-[var(--muted)] tabular-nums shrink-0">
                    {t.match} {i + 1} · @{m.index}
                  </span>
                  <span className="font-mono break-all">{m.text || "∅"}</span>
                </div>
                {m.groups.length ? (
                  <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                    <span>{t.groups}:</span>
                    {m.groups.map((g, gi) => (
                      <span key={gi} className="font-mono">
                        ${gi + 1}={g === undefined ? "∅" : JSON.stringify(g)}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
