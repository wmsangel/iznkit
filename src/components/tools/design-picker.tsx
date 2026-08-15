"use client";

import type { Locale } from "@/lib/i18n/config";
import { THEMES } from "@/lib/design/themes";

/** Reusable accent-theme swatch picker shown on every tool. */
export function DesignPicker({
  value,
  onChange,
  locale,
  label,
}: {
  value: string;
  onChange: (id: string) => void;
  locale: Locale;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-medium text-[var(--muted)]">{label}:</span>
      {THEMES.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            title={t.label[locale]}
            aria-label={t.label[locale]}
            aria-pressed={active}
            className={`w-6 h-6 rounded-full transition-transform ${
              active
                ? "ring-2 ring-offset-2 ring-offset-[var(--background)] ring-[var(--foreground)] scale-110"
                : "hover:scale-110"
            }`}
            style={{ backgroundColor: t.accent }}
          />
        );
      })}
    </div>
  );
}
