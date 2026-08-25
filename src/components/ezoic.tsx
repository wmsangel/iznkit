import Script from "next/script";

// Ezoic loader (JavaScript / "standalone" integration — the right choice on
// Vercel, where we don't want to hand DNS to Ezoic's nameservers).
//
// Inactive until you set NEXT_PUBLIC_EZOIC=1 in Vercel. Then, in production,
// it loads Ezoic's sa.min.js and initialises the ezstandalone queue so ad
// placeholders can render, and Ezoic's crawler can verify the connection.
// Turning it on/off is one env var + redeploy.
const ENABLED = process.env.NEXT_PUBLIC_EZOIC;

export function Ezoic() {
  if (process.env.NODE_ENV !== "production" || !ENABLED) return null;
  // The universal Ezoic JavaScript-integration snippet (same for every
  // publisher — there is no per-site code). beforeInteractive so the tags land
  // in the server-rendered HTML <head>, where Ezoic's crawler looks for them.
  return (
    <>
      <Script
        id="ezoic-sa"
        strategy="beforeInteractive"
        src="https://www.ezojs.com/ezoic/sa.min.js"
      />
      <Script id="ezoic-init" strategy="beforeInteractive">
        {"window.ezstandalone=window.ezstandalone||{};ezstandalone.cmd=ezstandalone.cmd||[];"}
      </Script>
      <Script
        id="ezoic-analytics"
        strategy="afterInteractive"
        src="https://ezoicanalytics.com/analytics.js"
      />
    </>
  );
}
