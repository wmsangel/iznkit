import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { sections } from "@/lib/tools/registry";
import { DONATE } from "@/lib/donate";
import { PROJECTS } from "@/lib/projects";

export function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const liveSections = sections
    .map((s) => ({ ...s, live: s.tools.filter((t) => t.status === "live") }))
    .filter((s) => s.live.length > 0);

  const infoLinks = [
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/contact`, label: dict.nav.contact },
    { href: `/${locale}/projects`, label: dict.nav.projects },
    { href: `/${locale}/privacy`, label: dict.nav.privacy },
    { href: `/${locale}/terms`, label: dict.nav.terms },
    { href: `/${locale}/disclosure`, label: dict.nav.disclosure },
    { href: `/${locale}/${DONATE.path}`, label: dict.nav.donate },
  ];

  return (
    <footer className="mt-24 border-t border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_3fr]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <span className="grid place-items-center w-7 h-7 rounded-md bg-[var(--accent)] text-[var(--accent-fg)] font-mono font-semibold text-[13px]">
                iz
              </span>
              <span className="font-mono font-semibold tracking-tight">iznkit</span>
            </div>
            <p className="mt-4 text-sm text-[var(--muted)] leading-relaxed">
              {dict.brand.tagline}
            </p>
            <Link
              href={`/${locale}/${DONATE.path}`}
              className="mt-4 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
            >
              {dict.nav.donate} →
            </Link>
          </div>

          <div className="grid gap-8 grid-cols-2 sm:grid-cols-3">
            {liveSections.map((section) => (
              <div key={section.id}>
                <div className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] mb-3">
                  {section.title[locale]}
                </div>
                <ul className="space-y-2">
                  {section.live.map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/${locale}/tools/${tool.slug}`}
                        className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                      >
                        {tool.title[locale]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* More from us — sister projects */}
        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] mb-4">
            {dict.nav.more}
          </div>
          <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((p) => (
              <a
                key={p.url}
                href={p.url}
                target="_blank"
                rel="noopener"
                className="group flex items-baseline gap-2 text-sm"
              >
                <span className="font-medium group-hover:text-[var(--accent)] transition-colors">
                  {p.name}
                </span>
                <span className="text-[var(--muted)] truncate">— {p.tagline[locale]}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between text-xs text-[var(--muted)]">
          <span>© {new Date().getFullYear()} iznkit</span>
          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            {infoLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-[var(--foreground)] transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
