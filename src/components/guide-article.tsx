import type { ReactNode } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { GuideBody } from "@/lib/guides";
import { AUTHOR } from "@/lib/author";
import { TrackedLink } from "@/components/tracked-link";

/**
 * Render a guide string with inline `[label](path)` links. Internal paths are
 * written without the locale prefix (e.g. `tools/nda`) and get `/{locale}/`
 * prepended; anything starting with http is an external do-follow link. Lets
 * guide bodies carry contextual in-content links (editorial anchors to our own
 * tools and to sister sites in the network) instead of only a boilerplate CTA.
 */
const INLINE_LINK = /\[([^\]]+)\]\(([^)]+)\)/g;
function renderInline(text: string, locale: Locale): ReactNode {
  INLINE_LINK.lastIndex = 0;
  if (!INLINE_LINK.test(text)) return text;
  INLINE_LINK.lastIndex = 0;
  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = INLINE_LINK.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const [, label, href] = m;
    if (/^https?:\/\//.test(href)) {
      parts.push(
        <a key={m.index} href={href} rel="noopener" className="text-[var(--accent)] hover:underline">
          {label}
        </a>,
      );
    } else {
      parts.push(
        <Link
          key={m.index}
          href={`/${locale}/${href.replace(/^\//, "")}`}
          className="text-[var(--accent)] hover:underline"
        >
          {label}
        </Link>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function GuideArticle({
  body,
  locale,
  toolHref,
  toolTitle,
  guideSlug,
  toolSlug,
  faqLabel,
  related = [],
  relatedLabel,
}: {
  body: GuideBody;
  locale: Locale;
  toolHref: string;
  toolTitle: string;
  guideSlug: string;
  toolSlug: string;
  faqLabel: string;
  related?: { href: string; title: string }[];
  relatedLabel?: string;
}) {
  return (
    <article className="max-w-2xl">
      <p className="mt-6 text-lg text-[var(--muted)] leading-relaxed">{renderInline(body.intro, locale)}</p>

      {/* Inline CTA to the tool this guide is about */}
      <TrackedLink
        href={toolHref}
        event="cta_click"
        params={{ from: guideSlug, to: toolSlug, placement: "guide" }}
        className="btn-primary mt-6 inline-flex rounded-lg px-5 py-2.5 text-sm font-medium"
      >
        {body.cta} →
      </TrackedLink>

      <div className="mt-10 space-y-8">
        {body.sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-xl font-semibold tracking-tight">{s.h}</h2>
            <div className="mt-2 space-y-3 text-[var(--foreground)] leading-relaxed">
              {s.p.map((para, i) =>
                Array.isArray(para) ? (
                  <ul key={i} className="list-disc pl-5 space-y-1.5 text-[var(--muted)]">
                    {para.map((li) => (
                      <li key={li}>{renderInline(li, locale)}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i} className="text-[var(--muted)]">
                    {renderInline(para, locale)}
                  </p>
                ),
              )}
            </div>
          </section>
        ))}
      </div>

      {/* At-a-glance comparison table */}
      {body.table ? (
        <div className="mt-12">
          {body.table.title ? (
            <h2 className="text-xl font-semibold tracking-tight">{body.table.title}</h2>
          ) : null}
          <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-[var(--card)]">
                  {body.table.headers.map((h) => (
                    <th
                      key={h}
                      className="border-b border-[var(--border)] px-4 py-2.5 text-left font-semibold"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.table.rows.map((row, i) => (
                  <tr key={i} className="border-b border-[var(--border)] last:border-0">
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`px-4 py-2.5 align-top ${j === 0 ? "font-medium" : "text-[var(--muted)]"}`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* FAQ */}
      {body.faq.length ? (
        <div className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">{faqLabel}</h2>
          <div className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {body.faq.map((f) => (
              <details key={f.q} className="group py-3">
                <summary className="cursor-pointer font-medium list-none flex justify-between items-center gap-4">
                  {f.q}
                  <span className="text-[var(--muted)] group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      ) : null}

      {/* Related guides — internal interlinking */}
      {related.length ? (
        <div className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">{relatedLabel}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="card card-hover rounded-xl px-4 py-3 flex items-center gap-3 group"
              >
                <span className="text-lg">📄</span>
                <span className="flex-1 min-w-0 font-medium leading-snug group-hover:text-[var(--accent)] transition-colors">
                  {r.title}
                </span>
                <span className="text-[var(--accent)] shrink-0">→</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {/* Closing CTA card */}
      <div className="mt-12 card rounded-xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <div className="font-semibold">{toolTitle}</div>
          <div className="text-sm text-[var(--muted)]">
            {locale === "ru" ? "Бесплатно, без регистрации" : "Free, no sign-up"}
          </div>
        </div>
        <Link
          href={toolHref}
          className="btn-primary rounded-lg px-5 py-2.5 text-sm font-medium whitespace-nowrap"
        >
          {body.cta} →
        </Link>
      </div>

      {/* Author bio — E-E-A-T */}
      <div className="mt-10 pt-6 border-t border-[var(--border)]">
        <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
          {AUTHOR.aboutLabel[locale]}
        </div>
        <div className="mt-2 font-semibold">{AUTHOR.name[locale]}</div>
        <p className="mt-1 text-sm text-[var(--muted)] leading-relaxed">{AUTHOR.bio[locale]}</p>
        <Link
          href={`/${locale}/about`}
          className="mt-2 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
        >
          {locale === "ru" ? "О проекте" : "About iznkit"} →
        </Link>
      </div>
    </article>
  );
}
