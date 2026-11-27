import { offerById, subId, withSub } from "@/lib/affiliates";
import { goTokenValid } from "@/lib/affiliates/gotoken";
import { AMAZON_TAG } from "@/lib/amazon";

/**
 * /go/<id>?s=<place>&t=<time>&k=<sig> — our own affiliate redirect. A real person
 * who pressed a link on one of our pages gets a 302 to the partner (with
 * `iznkit-<place>` as the network sub-id); a bot, a prefetch, a request that did
 * NOT come from our page, or a URL without a fresh click-time token (a stored or
 * replayed link — see gotoken.ts) gets 204 with no Location. Affiliate networks
 * therefore stop counting crawler hits as clicks (network audit 2026-11-27:
 * 0 conversions across all networks on tens of thousands of clicks).
 *
 * Not cloaking: for a person who clicks, the destination is exactly what the link
 * promises — we only decline to bill a machine as a visitor. Pattern from
 * costtrek (5e142b5, 86c22e0), where it is proven.
 *
 * Amazon rides the same route: id "amazon" + the book search text in `q` (signed
 * into the token). The Associates tag and the per-page ascsubtag are added HERE,
 * server-side, so no Amazon URL is ever written into the page HTML.
 *
 * Dynamic (reads request headers); excluded from the locale redirect in
 * proxy.ts, Disallow:/go/ in robots.ts, X-Robots-Tag: noindex on every response.
 */
export const dynamic = "force-dynamic";

const NOINDEX = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
} as const;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const isAmazon = id === "amazon";
  const offer = isAmazon ? undefined : offerById(id);
  if (!isAmazon && !offer) {
    return new Response("Not found", { status: 404, headers: NOINDEX });
  }

  // 1) User agent: every real browser sends "Mozilla"; prefetchers/crawlers that
  //    ignore nofollow + Disallow do not, or they name themselves.
  const ua = req.headers.get("user-agent") ?? "";
  const looksLikeBot =
    !/Mozilla/i.test(ua) ||
    /\b(bot|crawler|spider|scrape|preview|headless|monitor)\b/i.test(ua);

  // 2) Came from us: a click on a real page sends Sec-Fetch-Site: same-origin and
  //    a Referer on our host (links are noopener, NOT noreferrer).
  const site = req.headers.get("sec-fetch-site");
  const ref = req.headers.get("referer") ?? "";
  let sameHost = false;
  try {
    sameHost = new URL(ref).host === new URL(req.url).host;
  } catch {
    /* no/garbage referer */
  }
  const cameFromUs = site === "same-origin" || site === "same-site" || sameHost;

  // 3) Human gesture, required of EVERY browser that can send it. A prefetch
  //    carries Sec-Purpose: prefetch; a genuine user-activated navigation carries
  //    Sec-Fetch-User: ?1 (never a prefetch, a scripted fetch()/goto(), or a UA too
  //    old to emit it — Chrome 76+, Firefox 90+, Safari 16.4+).
  const purpose =
    req.headers.get("sec-purpose") ?? req.headers.get("purpose") ?? "";
  const isPrefetch = /prefetch|prerender/i.test(purpose);
  const userActivated = req.headers.get("sec-fetch-user") === "?1";

  if (looksLikeBot || !cameFromUs || isPrefetch || !userActivated) {
    return new Response(null, { status: 204, headers: NOINDEX });
  }

  // 4) Click-time token. Gates 1–3 are request headers, and a bot replaying a
  //    harvested list of /go URLs through residential proxies forges every one of
  //    them. The token is minted by our own script at the moment of a trusted
  //    click and expires in 15 minutes, so a stored URL is refused.
  const sp = new URL(req.url).searchParams;
  const place = sp.get("s") || undefined;
  const q = sp.get("q") ?? "";
  if (!goTokenValid(id, place ?? "", q, sp.get("t"), sp.get("k"))) {
    return new Response(null, { status: 204, headers: NOINDEX });
  }

  let dest: string;
  if (isAmazon) {
    if (!q) return new Response(null, { status: 204, headers: NOINDEX });
    dest = `https://www.amazon.com/s?k=${encodeURIComponent(q)}&tag=${AMAZON_TAG}&ascsubtag=${subId(place)}`;
  } else {
    dest = withSub(offer!.url, offer!.net, place);
  }
  return new Response(null, {
    status: 302,
    headers: { Location: dest, ...NOINDEX },
  });
}
