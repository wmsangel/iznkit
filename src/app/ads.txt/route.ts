// Serves /ads.txt.
//
// - Ezoic: set NEXT_PUBLIC_EZOIC_ADSTXT to the Ads.txt Manager URL Ezoic gives
//   you (e.g. "https://srv.adstxtmanager.com/XXXXX/iznkit.com"). We 301 to it so
//   Ezoic keeps the authorized-seller list current. Add any other lines
//   (AdSense, affiliates) inside Ezoic's Ads.txt Manager — it allows custom lines.
// - Otherwise, emit a Google AdSense line if NEXT_PUBLIC_ADSENSE_ID is set.
export const dynamic = "force-static";

export function GET() {
  const ezoic = process.env.NEXT_PUBLIC_EZOIC_ADSTXT;
  if (ezoic) {
    return new Response(null, { status: 301, headers: { Location: ezoic } });
  }

  const lines: string[] = [];
  const pub = process.env.NEXT_PUBLIC_ADSENSE_ID; // e.g. "ca-pub-1234567890123456"
  if (pub) lines.push(`google.com, ${pub.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0`);

  const body = lines.length
    ? lines.join("\n") + "\n"
    : "# ads.txt — no authorized sellers configured yet.\n";
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
