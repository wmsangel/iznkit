"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";

export function LangSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  function swap(target: Locale): string {
    const rest = pathname.replace(/^\/(en|ru)(?=\/|$)/, "");
    return `/${target}${rest || ""}`;
  }

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-[var(--border)] bg-[var(--card)] p-0.5 text-xs font-semibold">
      {locales.map((l) => (
        <Link
          key={l}
          href={swap(l)}
          className={
            l === locale
              ? "px-2.5 py-1 rounded-full bg-[var(--accent)] text-[var(--accent-fg)]"
              : "px-2.5 py-1 rounded-full text-[var(--muted)] hover:text-[var(--foreground)]"
          }
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
