import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { sections } from "@/lib/tools/registry";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo/metadata";
import { InvoiceMockup } from "@/components/home/mockups";
import { ToolsExplorer } from "@/components/home/tools-explorer";
import { TEMPLATES, type InvoiceTemplate } from "@/lib/tools/invoice/templates";
import { DONATE } from "@/lib/donate";
import { GUIDES } from "@/lib/guides";
import { SITE_URL, SITE_NAME, CONTACT_EMAIL } from "@/lib/seo/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return pageMetadata({
    locale,
    path: "",
    title: `${dict.brand.name} — ${dict.home.heroTitle}`,
    description: dict.home.heroSubtitle,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const freeLabel = locale === "ru" ? "Бесплатно" : "Free";
  const guidesCopy =
    locale === "ru"
      ? {
          title: "Гайды",
          subtitle: "Короткие практичные статьи — и бесплатный инструмент в конце каждой.",
          all: "Все гайды",
          read: "Читать",
        }
      : {
          title: "Guides",
          subtitle: "Short, practical how-tos — with a free tool at the end of each.",
          all: "All guides",
          read: "Read",
        };
  const orgId = `${SITE_URL}/#organization`;
  const siteId = `${SITE_URL}/#website`;
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: SITE_NAME,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
        description: dict.home.heroSubtitle,
        contactPoint: {
          "@type": "ContactPoint",
          email: CONTACT_EMAIL,
          contactType: "customer support",
          availableLanguage: ["English", "Russian"],
        },
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: ["en", "ru"],
        publisher: { "@id": orgId },
      },
    ],
  };
  const explorerSections = sections.map((section) => ({
    id: section.id,
    title: section.title[locale],
    blurb: section.blurb[locale],
    tools: section.tools.map((tool) => ({
      slug: tool.slug,
      title: tool.title[locale],
      blurb: tool.blurb[locale],
      live: tool.status === "live",
      popular: !!tool.popular,
    })),
  }));

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      {/* ---------------- Hero ---------------- */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-16 sm:pt-24 sm:pb-20">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
            <div>
              <span className="eyebrow">{dict.home.eyebrow}</span>
              <h1 className="mt-5 text-[2.6rem] leading-[1.05] sm:text-6xl font-semibold tracking-tight">
                {dict.home.heroTitle}
              </h1>
              <p className="mt-6 text-lg text-[var(--muted)] max-w-xl leading-relaxed">
                {dict.home.heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#tools"
                  className="btn-primary inline-flex rounded-lg px-6 py-3 font-medium text-sm"
                >
                  {dict.home.browseCta}
                </a>
                <Link
                  href={`/${locale}/${DONATE.path}`}
                  className="btn-outline inline-flex rounded-lg px-6 py-3 font-medium text-sm"
                >
                  {dict.home.secondaryCta}
                </Link>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
                {dict.home.trust.map((tr) => (
                  <li key={tr} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                    {tr}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative hidden lg:block">
              <InvoiceMockup dict={dict} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Stat strip ---------------- */}
      <section className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-y-8 sm:divide-x divide-[var(--border)]">
          {dict.home.stats.map((st) => (
            <div key={st.label} className="sm:px-6 first:sm:pl-0">
              <div className="text-2xl sm:text-3xl font-semibold tracking-tight">{st.value}</div>
              <div className="eyebrow mt-2 !tracking-normal">{st.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Tools catalog ---------------- */}
      <section id="tools" className="scroll-mt-16">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <ToolsExplorer
            locale={locale}
            sections={explorerSections}
            freeLabel={freeLabel}
            labels={{
              title: dict.home.sectionsTitle,
              searchPlaceholder: dict.home.searchPlaceholder,
              noResults: dict.home.noResults,
              popular: dict.home.popular,
              soon: dict.home.soon,
            }}
          />
        </div>
      </section>

      {/* ---------------- Designs showcase ---------------- */}
      <section className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            {dict.home.designsTitle}
          </h2>
          <p className="mt-3 text-[var(--muted)] max-w-xl">{dict.home.designsSubtitle}</p>
          <div className="mt-10 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {TEMPLATES.map((tpl) => (
              <MiniInvoice key={tpl.id} tpl={tpl} docTitle={dict.invoice.docTitle} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Guides ---------------- */}
      <section className="border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                {guidesCopy.title}
              </h2>
              <p className="mt-3 text-[var(--muted)] max-w-xl">{guidesCopy.subtitle}</p>
            </div>
            <Link
              href={`/${locale}/guides`}
              className="text-sm font-medium text-[var(--accent)] hover:underline shrink-0"
            >
              {guidesCopy.all} →
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((g) => {
              const body = g.content[locale];
              return (
                <Link
                  key={g.slug}
                  href={`/${locale}/guides/${g.slug}`}
                  className="card card-hover rounded-xl p-5 flex flex-col group"
                >
                  <span className="font-semibold leading-snug">{body.title}</span>
                  <span className="mt-2 text-sm text-[var(--muted)] flex-1">
                    {body.description}
                  </span>
                  <span className="mt-4 text-sm font-medium text-[var(--accent)]">
                    {guidesCopy.read} →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- Values ---------------- */}
      <section id="values" className="border-t border-[var(--border)] scroll-mt-16">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight max-w-2xl">
            {dict.home.valuesTitle}
          </h2>
          <p className="mt-3 text-[var(--muted)] max-w-2xl">{dict.home.valuesSubtitle}</p>
          <div className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-3">
            {dict.home.values.map((v, i) => (
              <div key={v.title} className="border-t-2 border-[var(--accent)] pt-4">
                <div className="eyebrow">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-3 font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Donate / final CTA ---------------- */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="card rounded-2xl px-8 py-12 sm:px-12 sm:py-14">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              {dict.home.finalTitle}
            </h2>
            <p className="mt-3 text-[var(--muted)] text-lg">{dict.home.finalSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#tools"
                className="btn-primary inline-flex rounded-lg px-6 py-3 font-medium text-sm"
              >
                {dict.home.finalCta}
              </a>
              <Link
                href={`/${locale}/${DONATE.path}`}
                className="btn-outline inline-flex rounded-lg px-6 py-3 font-medium text-sm"
              >
                {dict.nav.donate}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniInvoice({
  tpl,
  docTitle,
  locale,
}: {
  tpl: InvoiceTemplate;
  docTitle: string;
  locale: Locale;
}) {
  const accent = tpl.accent;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white overflow-hidden shadow-sm card-hover">
      {tpl.header === "band" ? (
        <div className="px-3 py-2.5" style={{ backgroundColor: accent }}>
          <div className="text-white font-bold text-[11px] tracking-wide">{docTitle}</div>
        </div>
      ) : (
        <div className="px-3 pt-3 pb-1.5">
          <div
            className="font-bold text-[11px] tracking-wide"
            style={{ color: tpl.header === "minimal" ? "#0f172a" : accent }}
          >
            {docTitle}
          </div>
          {tpl.header === "minimal" ? (
            <div className="h-0.5 mt-1.5" style={{ backgroundColor: accent }} />
          ) : null}
        </div>
      )}
      <div className="px-3 py-2.5 space-y-1.5">
        <div className="h-1.5 w-3/4 rounded bg-slate-200" />
        <div className="h-1.5 w-1/2 rounded bg-slate-200" />
        <div className="flex justify-between items-center pt-2 mt-1 border-t border-slate-100">
          <span className="text-[9px] uppercase text-slate-400 font-semibold">
            {tpl.label[locale]}
          </span>
          <span className="text-xs font-bold" style={{ color: accent }}>
            $1,260
          </span>
        </div>
      </div>
    </div>
  );
}
