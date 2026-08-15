"use client";

import { useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const STORAGE_KEY = "izn.tools:utm:recent";

interface UtmFields {
  url: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}

const empty: UtmFields = { url: "", source: "", medium: "", campaign: "", term: "", content: "" };

function buildUrl(f: UtmFields): string {
  const raw = f.url.trim();
  if (!raw || !f.source.trim()) return "";
  const base = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  let u: URL;
  try {
    u = new URL(base);
  } catch {
    return "";
  }
  const params: [string, string][] = [
    ["utm_source", f.source],
    ["utm_medium", f.medium],
    ["utm_campaign", f.campaign],
    ["utm_term", f.term],
    ["utm_content", f.content],
  ];
  for (const [k, v] of params) {
    const val = v.trim();
    if (val) u.searchParams.set(k, val);
  }
  return u.toString();
}

export function UtmTool({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.utm;

  const [f, setF] = useState<UtmFields>(empty);
  const [recent, setRecent] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const result = useMemo(() => buildUrl(f), [f]);

  function set<K extends keyof UtmFields>(key: K, value: string) {
    setF((s) => ({ ...s, [key]: value }));
    setCopied(false);
  }

  async function copy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      const next = [result, ...recent.filter((r) => r !== result)].slice(0, 8);
      setRecent(next);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    } catch {
      /* clipboard blocked — ignore */
    }
  }
  function clearRecent() {
    setRecent([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }

  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";

  const field = (
    key: keyof UtmFields,
    label: string,
    placeholder: string,
    required?: boolean,
  ) => (
    <div>
      <label className={labelCls}>
        {label}
        {required ? <span className="text-[var(--accent)]"> *</span> : null}
      </label>
      <input
        className={inputCls}
        placeholder={placeholder}
        value={f[key]}
        onChange={(e) => set(key, e.target.value)}
      />
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        {field("url", t.url, t.urlPlaceholder, true)}
        <div className="grid sm:grid-cols-2 gap-4">
          {field("source", t.source, t.sourcePlaceholder, true)}
          {field("medium", t.medium, t.mediumPlaceholder)}
          {field("campaign", t.campaign, t.campaignPlaceholder)}
          {field("term", t.term, t.termPlaceholder)}
        </div>
        {field("content", t.content, t.contentPlaceholder)}
      </div>

      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {t.result}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          {result ? (
            <p className="text-sm break-all font-mono text-[var(--foreground)]">{result}</p>
          ) : (
            <p className="text-sm text-[var(--muted)]">{t.empty}</p>
          )}
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={copy}
              disabled={!result}
              className="btn-primary rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {copied ? t.copied : t.copy}
            </button>
            {result ? (
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--background)]"
              >
                {t.open}
              </a>
            ) : null}
          </div>
        </div>

        {recent.length ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                {t.recent}
              </span>
              <button
                type="button"
                onClick={clearRecent}
                className="text-xs text-[var(--muted)] hover:text-red-500"
              >
                {t.clear}
              </button>
            </div>
            <ul className="space-y-1.5">
              {recent.map((r) => (
                <li key={r}>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard?.writeText(r)}
                    title={r}
                    className="w-full text-left text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)] truncate"
                  >
                    {r}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
