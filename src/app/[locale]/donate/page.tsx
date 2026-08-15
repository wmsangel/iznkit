import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";
import { DonateAddress } from "@/components/donate-address";
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

      <div className="card mt-10 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6 sm:items-center">
          <div className="shrink-0 mx-auto sm:mx-0">
            <div className="rounded-xl border border-[var(--border)] bg-white p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={DONATE.tronQr} alt={d.qrAlt} width={132} height={132} className="w-[132px] h-[132px]" />
            </div>
            <div className="mt-2 eyebrow justify-center">{d.scan}</div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">{d.network}</span>
              <span className="text-xs font-mono rounded-full bg-[var(--accent-soft)] text-[var(--accent)] px-2.5 py-0.5">
                {d.coins}
              </span>
            </div>
            <DonateAddress label={d.addressLabel} copy={d.copy} copied={d.copied} />
          </div>
        </div>

        <p className="mt-6 rounded-lg border border-[var(--border-strong)] bg-[var(--card-2)] px-4 py-3 text-sm leading-relaxed">
          <strong>{d.network}.</strong> {d.warning}
        </p>
      </div>

      <p className="mt-8 text-sm text-[var(--muted)]">{d.thanks}</p>
    </div>
  );
}
