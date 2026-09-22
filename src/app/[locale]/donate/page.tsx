import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";
import { SITE_URL } from "@/lib/seo/site";
import { DonateAddress } from "@/components/donate-address";
import { DonateHelp } from "@/components/donate-help";
import { DONATE } from "@/lib/donate";

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
    path: DONATE.path,
    title: dict.donate.title,
    description: dict.donate.intro,
  });
}

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const d = dict.donate;
  const shareUrl = `${SITE_URL}/${locale}`;

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <Link
        href={`/${locale}`}
        className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
      >
        ← {d.back}
      </Link>

      <div className="mt-8">
        <span className="eyebrow">{d.eyebrow}</span>
      </div>
      <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">{d.title}</h1>
      <p className="mt-4 text-lg text-[var(--muted)] leading-relaxed max-w-2xl">{d.intro}</p>

      {/* Network warning — up top, before any address */}
      <div className="mt-8 rounded-xl border border-[var(--border-strong)] bg-[var(--card-2)] px-4 py-3">
        <p className="text-sm leading-relaxed">
          <strong>⚠ {d.warningTitle}.</strong> {d.warning}
        </p>
      </div>

      {/* Wallets, one card per network */}
      <div className="mt-6 space-y-5">
        {DONATE.networks.map((net) => (
          <div key={net.id} className="card rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
              <div className="shrink-0 mx-auto sm:mx-0">
                <div className="rounded-xl border border-[var(--border)] bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={net.qr}
                    alt={`${net.network} — ${d.qrAlt}`}
                    width={132}
                    height={132}
                    className="w-[132px] h-[132px]"
                  />
                </div>
                <div className="mt-2 eyebrow justify-center">{d.scan}</div>
              </div>

              <div className="flex-1 space-y-4 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{net.network}</span>
                  <span className="text-xs font-mono rounded-full bg-[var(--accent-soft)] text-[var(--accent)] px-2.5 py-0.5">
                    {net.coins}
                  </span>
                </div>
                <DonateAddress net={net} label={d.addressLabel} copy={d.copy} copied={d.copied} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Where the money goes */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">{d.whereTitle}</h2>
        <p className="mt-3 text-[var(--muted)] leading-relaxed">{d.whereBody}</p>
      </section>

      {/* Disclaimers */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold">{d.disclaimersTitle}</h2>
        <ul className="mt-3 space-y-2">
          {d.disc.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-[var(--muted)] leading-relaxed">
              <span className="text-[var(--accent)] shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Free ways to help — drives backlinks */}
      <section className="mt-12 card rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-semibold">{d.helpTitle}</h2>
        <p className="mt-3 text-[var(--muted)] leading-relaxed">{d.helpBody}</p>
        <div className="mt-5">
          <DonateHelp
            shareUrl={shareUrl}
            shareText={d.shareText}
            repoUrl={DONATE.repoUrl}
            labels={{
              shareX: d.shareX,
              shareReddit: d.shareReddit,
              copyLink: d.copyLink,
              linkCopied: d.linkCopied,
              starGithub: d.starGithub,
            }}
          />
        </div>
      </section>

      <p className="mt-10 text-sm text-[var(--muted)]">{d.thanks}</p>
    </div>
  );
}
