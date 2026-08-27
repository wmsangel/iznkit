"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

export interface ExplorerTool {
  slug: string;
  title: string;
  blurb: string;
  live: boolean;
  popular: boolean;
}
export interface ExplorerSection {
  id: string;
  title: string;
  blurb: string;
  tools: ExplorerTool[];
}

export function ToolsExplorer({
  locale,
  sections,
  freeLabel,
  labels,
  initialQuery = "",
}: {
  locale: Locale;
  sections: ExplorerSection[];
  freeLabel: string;
  labels: {
    title: string;
    searchPlaceholder: string;
    noResults: string;
    popular: string;
    soon: string;
  };
  initialQuery?: string;
}) {
  const [q, setQ] = useState(initialQuery);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return sections;
    return sections
      .map((s) => ({
        ...s,
        tools: s.tools.filter(
          (t) =>
            t.title.toLowerCase().includes(needle) ||
            t.blurb.toLowerCase().includes(needle),
        ),
      }))
      .filter((s) => s.tools.length > 0);
  }, [q, sections]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{labels.title}</h2>
        <div className="relative sm:w-72">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={labels.searchPlaceholder}
            aria-label={labels.searchPlaceholder}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-[var(--muted)]">{labels.noResults}</p>
      ) : (
        <div className="mt-12 space-y-14">
          {filtered.map((section) => (
            <div key={section.id}>
              <div className="flex items-baseline gap-3 mb-5 pb-3 border-b border-[var(--border)]">
                <h3 className="font-semibold">{section.title}</h3>
                <p className="text-sm text-[var(--muted)]">{section.blurb}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {section.tools.map((tool) => (
                  <ToolCard
                    key={tool.slug}
                    locale={locale}
                    tool={tool}
                    freeLabel={freeLabel}
                    labels={labels}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ToolCard({
  locale,
  tool,
  freeLabel,
  labels,
}: {
  locale: Locale;
  tool: ExplorerTool;
  freeLabel: string;
  labels: { popular: string; soon: string };
}) {
  const inner = (
    <div
      className={`card ${tool.live ? "card-hover" : "opacity-70"} rounded-xl p-5 h-full flex flex-col`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold">{tool.title}</span>
        {tool.popular && tool.live ? (
          <span className="text-[10px] uppercase tracking-wide rounded-full bg-[var(--accent-soft)] text-[var(--accent)] px-2 py-0.5 font-semibold">
            {labels.popular}
          </span>
        ) : !tool.live ? (
          <span className="text-[10px] uppercase tracking-wide rounded-full bg-[var(--card-2)] text-[var(--muted)] px-2 py-0.5 font-semibold">
            {labels.soon}
          </span>
        ) : null}
      </div>
      <p className="mt-1.5 text-sm text-[var(--muted)] flex-1">{tool.blurb}</p>
      {tool.live ? (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-medium text-[var(--accent)]">{freeLabel}</span>
          <span className="text-[var(--muted)]">→</span>
        </div>
      ) : null}
    </div>
  );
  return tool.live ? (
    <Link href={`/${locale}/tools/${tool.slug}`} className="group block h-full">
      {inner}
    </Link>
  ) : (
    <div className="h-full">{inner}</div>
  );
}
