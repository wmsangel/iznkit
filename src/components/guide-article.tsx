import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { GuideBody } from "@/lib/guides";
import { AUTHOR } from "@/lib/author";

export function GuideArticle({
  body,
  locale,
  toolHref,
  toolTitle,
  faqLabel,
}: {
  body: GuideBody;
  locale: Locale;
  toolHref: string;
  toolTitle: string;
  faqLabel: string;
}) {
  return (
    <article className="max-w-2xl">
      <p className="mt-6 text-lg text-[var(--muted)] leading-relaxed">{body.intro}</p>

      {/* Inline CTA to the tool this guide is about */}
      <Link
        href={toolHref}
        className="btn-primary mt-6 inline-flex rounded-lg px-5 py-2.5 text-sm font-medium"
      >
        {body.cta} →
      </Link>

      <div className="mt-10 space-y-8">
        {body.sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-xl font-semibold tracking-tight">{s.h}</h2>
            <div className="mt-2 space-y-3 text-[var(--foreground)] leading-relaxed">
              {s.p.map((para, i) =>
                Array.isArray(para) ? (
                  <ul key={i} className="list-disc pl-5 space-y-1.5 text-[var(--muted)]">
                    {para.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i} className="text-[var(--muted)]">
                    {para}
                  </p>
                ),
              )}
            </div>
          </section>
        ))}
      </div>

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
