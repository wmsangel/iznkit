import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ConsentBanner } from "@/components/consent-banner";
import { SupportFab } from "@/components/support-fab";
import { Analytics } from "@/components/analytics";
import { SITE_URL } from "@/lib/seo/site";
import "../globals.css";

const sans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "iznkit — clean calculators and document generators",
    template: "%s · iznkit",
  },
  description:
    "A quiet set of calculators and document generators that hand you a clean, branded PDF. Free to use right now.",
  applicationName: "iznkit",
  authors: [{ name: "iznkit" }],
  creator: "iznkit",
  publisher: "iznkit",
  category: "technology",
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "ute90jV2NyS9ys9AOKhz_TDwujA-z4uYBt1EfPkb5NQ",
    yandex: "d36ff35a574e84e1",
    other: {
      "mitgo-verification": "f217f62a-78d6-4b9d-8872-9e89a536ee3c",
    },
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// This is the app's root layout — it renders <html>/<body>. Nesting the root
// layout in the [locale] segment is the supported i18n pattern and lets us set
// <html lang> correctly at render time (the middleware guarantees every HTML
// request is prefixed with a valid locale).
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('iznkit:theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}})();",
          }}
        />
        <SiteHeader locale={locale} />
        <main className="flex-1">{children}</main>
        <SiteFooter locale={locale} />
        <ConsentBanner locale={locale} />
        <SupportFab locale={locale} />
        {/* GA4 + AdSense + Yandex Metrika — only in a production build AND only on
            the canonical host iznkit.com (the Analytics component checks hostname,
            so preview/mirror aliases like *.vercel.app never start analytics). */}
        {process.env.NODE_ENV === "production" ? <Analytics /> : null}
        {/* Cloudflare Web Analytics — маячок без кук и без согласия; сайт идёт мимо
            прокси, поэтому вставляется руками. Не через next/script: с afterInteractive
            Next сериализует конфиг в RSC-поток и реального <script data-cf-beacon> в HTML
            нет — RUM не стартует. Канонический серверный тег гарантирует атрибут в HTML. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "655ace7d1c49465fb93410161f8a38a8"}'
        />
      </body>
    </html>
  );
}
