import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ConsentBanner } from "@/components/consent-banner";
import { SITE_URL } from "@/lib/seo/site";
import "../globals.css";

/** Google Analytics 4 measurement id. */
const GA_ID = "G-PE4C500X45";

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
        {process.env.NODE_ENV === "production" ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied', analytics_storage:'granted'
});
gtag('consent', 'default', {
  region:['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'],
  ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied', analytics_storage:'denied', wait_for_update:500
});
try{var _c=localStorage.getItem('iznkit:consent');if(_c==='granted'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});}else if(_c==='denied'){gtag('consent','update',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});}}catch(e){}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
          </>
        ) : null}
        <Analytics />
      </body>
    </html>
  );
}
