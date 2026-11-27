import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { PROJECTS } from "@/lib/projects";
import { TrackedLink } from "@/components/tracked-link";

/**
 * "More from us" — links to the other sites of the network. Owner decision
 * 2026-11-24: a sitewide footer block of ~14 links on every page (983 links in
 * Search Console, all from our own sites) reads as a link scheme, so it now lives
 * ONLY on the home page and /about, as a plain name-only list (no keyword
 * taglines in the anchors), every link rel="nofollow noopener".
 */
export function NetworkStrip({ locale, where }: { locale: Locale; where: "home" | "about" }) {
  const dict = getDictionary(locale);
  return (
    <section className="mx-auto max-w-6xl px-6 pb-12">
      <div className="pt-8 border-t border-[var(--border)]">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] mb-4">
          {dict.nav.more}
        </h2>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--muted)]">
          {PROJECTS.map((p) => (
            <li key={p.url}>
              <TrackedLink
                href={p.url}
                external
                nofollow
                event="outbound_click"
                params={{ to: p.name, where }}
                className="hover:text-[var(--foreground)] transition-colors"
              >
                {p.name}
              </TrackedLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
