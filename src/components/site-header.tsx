import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LangSwitcher } from "./lang-switcher";
import { ThemeToggle } from "./theme-toggle";
import { DONATE } from "@/lib/donate";

export function SiteHeader({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2.5">
          <span className="grid place-items-center w-7 h-7 rounded-md bg-[var(--accent)] text-[var(--accent-fg)] font-mono font-semibold text-[13px]">
            iz
          </span>
          <span className="font-mono font-semibold text-[17px] tracking-tight">
            iznkit
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href={`/${locale}#tools`}
            className="hidden sm:inline text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            {dict.nav.allTools}
          </Link>
          <Link
            href={`/${locale}/guides`}
            className="hidden sm:inline text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            {dict.nav.guides}
          </Link>
          <Link
            href={`/${locale}/${DONATE.path}`}
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            {dict.nav.donate}
          </Link>
          <ThemeToggle label={dict.nav.theme} />
          <LangSwitcher locale={locale} />
        </nav>
      </div>
    </header>
  );
}
