import { fetchSponsored, isPlacedPage } from "@/lib/ads/indoleads";

// Server-side proxy for Indoleads AI Ads. The browser hits this (same-origin);
// the API key never leaves the Worker. One request per visitor → a fresh card
// URL each time, never cached or shared (Indoleads rule). /api/ is disallowed in
// robots, so this is never crawled.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const page = new URL(request.url).searchParams.get("page") ?? "";
  if (!isPlacedPage(page)) {
    return Response.json({ cards: [] }, { headers: { "Cache-Control": "no-store" } });
  }

  // Cloudflare edge geo; default US (where the western catalog actually responds).
  const country = request.headers.get("cf-ipcountry") ?? "US";

  const cards = await fetchSponsored(page, country);
  return Response.json(
    { cards },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } },
  );
}
