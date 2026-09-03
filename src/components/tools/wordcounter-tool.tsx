"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function WordCounterTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).wordCounter;
  const [text, setText] = useState("");

  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = trimmed ? (trimmed.match(/[.!?…]+/g)?.length ?? 1) || 1 : 0;
  const paragraphs = trimmed ? trimmed.split(/\n+/).filter((p) => p.trim()).length : 0;
  const readingMin = words === 0 ? 0 : Math.max(1, Math.round(words / 200));

  const n = (v: number) => v.toLocaleString("en-US");

  const stats: { label: string; value: string }[] = [
    { label: t.words, value: n(words) },
    { label: t.characters, value: n(characters) },
    { label: t.charactersNoSpaces, value: n(charactersNoSpaces) },
    { label: t.sentences, value: n(sentences) },
    { label: t.paragraphs, value: n(paragraphs) },
    { label: t.readingTime, value: `${readingMin} ${t.min}` },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, i) => (
          <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)] truncate">
              {s.label}
            </div>
            <div className={`mt-1 text-xl font-bold tabular-nums ${i === 0 ? "text-[var(--accent)]" : ""}`}>
              {s.value}
            </div>
          </div>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t.placeholder}
        rows={12}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm leading-relaxed outline-none focus:border-[var(--accent)] resize-y"
      />
    </div>
  );
}
