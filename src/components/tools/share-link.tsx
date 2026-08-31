"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";
import { buildShareUrl } from "@/lib/tools/share";
import type { Locale } from "@/lib/i18n/config";

/** "Copy link to this result" button — copies a shareable URL with the inputs encoded. */
export function ShareLink({
  slug,
  values,
  locale,
}: {
  slug: string;
  values: Record<string, string | number>;
  locale: Locale;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(buildShareUrl(values));
      track("tool_use", { tool: slug, action: "share" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const label = copied
    ? locale === "ru"
      ? "Ссылка скопирована"
      : "Link copied"
    : locale === "ru"
      ? "Копировать ссылку на расчёт"
      : "Copy link to this result";

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:underline"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
      {label}
    </button>
  );
}
