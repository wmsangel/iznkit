"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { YandexMetrika } from "./yandex-metrika";
import { ADSENSE_CLIENT } from "@/lib/ads";

const GA_ID = "G-PE4C500X45";

/**
 * Canonical production host. Analytics (GA4, AdSense, Yandex Metrika) must run
 * ONLY here — not on preview/mirror aliases like *.vercel.app, which share
 * NODE_ENV=production and would otherwise pollute stats and set cookies where
 * we don't control the privacy surface. The check is client-side (hostname)
 * because the mirror serves the same server-rendered HTML.
 */
const PROD_HOST = "iznkit.com";

export function Analytics() {
  const [onProd, setOnProd] = useState(false);
  useEffect(() => {
    setOnProd(window.location.hostname === PROD_HOST);
  }, []);

  if (!onProd) return null;

  return (
    <>
      {/* Google Analytics 4 — Consent Mode v2. EEA/UK/CH default to denied
          (no analytics or ad cookies) until the visitor opts in via the banner. */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
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
      {/* Google AdSense loader. Site-wide and crawlable for review; no ad units
          are placed yet, so nothing empty renders. Ad cookies stay denied under
          Consent Mode until the visitor opts in. */}
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        async
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      />
      {/* Yandex Metrika + Webvisor — loads only after an explicit "accept" in the
          banner (opt-in), so EEA/UK/CH visitors who don't opt in are never tracked. */}
      <YandexMetrika />
    </>
  );
}
