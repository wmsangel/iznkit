"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { track } from "@/lib/analytics";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");
const CLASSIC = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

const rand = (n: number) => Math.floor(Math.random() * n);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const word = () => WORDS[rand(WORDS.length)];

function sentence(): string {
  const n = 6 + rand(7);
  const w: string[] = [];
  for (let i = 0; i < n; i++) w.push(word());
  // drop in a comma somewhere in longer sentences
  if (n > 8) w[3 + rand(2)] += ",";
  return cap(w.join(" ")) + ".";
}
function paragraph(): string {
  const n = 3 + rand(4);
  const s: string[] = [];
  for (let i = 0; i < n; i++) s.push(sentence());
  return s.join(" ");
}

type Unit = "paragraphs" | "sentences" | "words";

function generate(unit: Unit, count: number, classic: boolean): string {
  const c = Math.max(1, Math.min(count, unit === "words" ? 500 : 50));
  if (unit === "words") {
    const w: string[] = [];
    for (let i = 0; i < c; i++) w.push(word());
    return cap(w.join(" "));
  }
  if (unit === "sentences") {
    const arr: string[] = [];
    for (let i = 0; i < c; i++) arr.push(i === 0 && classic ? CLASSIC : sentence());
    return arr.join(" ");
  }
  const arr: string[] = [];
  for (let i = 0; i < c; i++) {
    let p = paragraph();
    if (i === 0 && classic) p = `${CLASSIC} ${p}`;
    arr.push(p);
  }
  return arr.join("\n\n");
}

export function LoremTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).lorem;

  const [unit, setUnit] = useState<Unit>("paragraphs");
  const [count, setCount] = useState(3);
  const [classic, setClassic] = useState(true);
  const [out, setOut] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate on the client (Math.random) to avoid a hydration mismatch.
  useEffect(() => {
    setOut(generate(unit, count, classic));
  }, [unit, count, classic]);

  async function copy() {
    if (!out) return;
    try {
      await navigator.clipboard.writeText(out);
      track("tool_use", { tool: "lorem-ipsum", action: "copy" });
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  }

  const inputCls =
    "rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const units: { value: Unit; label: string }[] = [
    { value: "paragraphs", label: t.paragraphs },
    { value: "sentences", label: t.sentences },
    { value: "words", label: t.words },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-xs font-medium text-[var(--muted)] mb-1">{t.count}</label>
          <input
            type="number"
            min="1"
            className={`${inputCls} w-24`}
            value={count}
            onChange={(e) => setCount(e.target.value === "" ? 1 : Number(e.target.value))}
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-[var(--border)] p-1">
          {units.map((u) => (
            <button
              key={u.value}
              type="button"
              onClick={() => setUnit(u.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                unit === u.value
                  ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--muted)] select-none">
          <input type="checkbox" checked={classic} onChange={(e) => setClassic(e.target.checked)} />
          {t.startClassic}
        </label>
        <button
          type="button"
          onClick={copy}
          className="ml-auto btn-outline rounded-lg px-4 py-2 text-sm font-medium"
        >
          {copied ? t.copied : t.copy}
        </button>
      </div>
      <textarea
        value={out}
        readOnly
        rows={12}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm leading-relaxed outline-none resize-y"
      />
    </div>
  );
}
