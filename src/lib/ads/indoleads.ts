import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Indoleads AI Ads — server-side proxy helper (sandbox pilot, 2026-11).
 *
 * Why this shape:
 * - The API is server-only: calls with an Origin/Referer get 401, and the key
 *   must never reach the browser. So the key lives as a Worker secret and all
 *   requests go out from here (hit via the /api/sponsored route).
 * - `query` is NOT user input. Each placed page maps to ONE fixed query below,
 *   so the number of distinct queries equals the number of pages (<60/5min, the
 *   auto-disable threshold) and nobody can steer it.
 * - Per Indoleads rules a card URL must not be cached or shown to another user,
 *   so /api/sponsored is no-store and we request per visitor (traffic is tiny).
 *   The KV counter here is only a safety valve against runaway volume: a daily
 *   cap well under the 5000/day key limit, plus a per-minute cap under 30/min.
 * - The catalog is mostly non-western; we show a card only when it matches the
 *   clean western-brand allowlist, else the block renders nothing.
 */

export interface SponsoredCard {
  /** Clean brand name shown as the card title. */
  brand: string;
  /** Cleaned one-line description. */
  text: string;
  /** Click URL — used exactly as returned (no rewriting/prefetch). */
  url: string;
}

/** Fixed query per placed page. The page passes an id; the query is chosen here. */
const PAGE_QUERIES: Record<string, { query: string; lang: string }> = {
  "nda-guide": {
    query: "non-disclosure agreement NDA template and e-signature software",
    lang: "en",
  },
  "nda-tool": {
    query: "create a non-disclosure agreement online, NDA and contract software",
    lang: "en",
  },
  "invoice-guide": {
    query: "invoicing and billing software for freelancers and small business",
    lang: "en",
  },
};

export function isPlacedPage(page: string): boolean {
  return Object.prototype.hasOwnProperty.call(PAGE_QUERIES, page);
}

/**
 * Clean western brands we're willing to show. Matching is case-insensitive on the
 * card's title+description. Anything not matching an allowed brand is dropped —
 * this is the filter the recon flagged as necessary (catalog is Asia/global-heavy
 * with messy internal offer names). Keep to document/contract/freelance/SaaS names.
 */
const BRAND_ALLOWLIST: { name: string; match: string[] }[] = [
  { name: "PandaDoc", match: ["pandadoc"] },
  { name: "DocuSign", match: ["docusign"] },
  { name: "Dropbox Sign", match: ["dropbox sign", "hellosign"] },
  { name: "SignWell", match: ["signwell"] },
  { name: "Signaturely", match: ["signaturely"] },
  { name: "Adobe Acrobat", match: ["adobe acrobat", "adobe sign", "acrobat"] },
  { name: "FreshBooks", match: ["freshbooks"] },
  { name: "QuickBooks", match: ["quickbooks", "intuit"] },
  { name: "Xero", match: ["xero"] },
  { name: "Wave", match: ["wave accounting", "waveapps"] },
  { name: "Zoho", match: ["zoho"] },
  { name: "Bonsai", match: ["hellobonsai", "bonsai"] },
  { name: "HoneyBook", match: ["honeybook"] },
  { name: "Dubsado", match: ["dubsado"] },
  { name: "Invoice2go", match: ["invoice2go"] },
  { name: "Fiverr", match: ["fiverr"] },
  { name: "Upwork", match: ["upwork"] },
  { name: "LegalZoom", match: ["legalzoom"] },
  { name: "Rocket Lawyer", match: ["rocket lawyer", "rocketlawyer"] },
  { name: "Grammarly", match: ["grammarly"] },
  { name: "Notion", match: ["notion"] },
];

interface RawAd {
  id?: string;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  label?: string;
}
interface RawResponse {
  ads?: RawAd[];
  intent?: { show_ad?: boolean; reason?: string };
}

/** Strip the messy bits recon saw: [bracket tags], "/ CPS", bare promo codes. */
function clean(text: string): string {
  return text
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\b(CPS|CPA|CPL|WEB\+app|EXCLUSIVE)\b/gi, " ")
    .replace(/\bpromo ?code\b.*$/i, " ")
    .replace(/\s*[\/|·-]\s*$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function matchBrand(hay: string): string | null {
  const low = hay.toLowerCase();
  for (const b of BRAND_ALLOWLIST) {
    if (b.match.some((m) => low.includes(m))) return b.name;
  }
  return null;
}

/** Keep only allowlisted western brands, clean the text, cap at 3. */
export function filterCards(ads: RawAd[]): SponsoredCard[] {
  const out: SponsoredCard[] = [];
  const seen = new Set<string>();
  for (const ad of ads) {
    const url = (ad.url ?? "").trim();
    if (!url || !url.startsWith("https://")) continue;
    const hay = `${ad.title ?? ""} ${ad.description ?? ""}`;
    const brand = matchBrand(hay);
    if (!brand || seen.has(brand)) continue;
    seen.add(brand);
    const text = clean(ad.description ?? ad.title ?? "").slice(0, 140) || `${brand} — official site`;
    out.push({ brand, text, url });
    if (out.length >= 3) break;
  }
  return out;
}

const DAY_CAP = 1500; // well under the 5000/day key limit
const MIN_CAP = 20; // under the 30/min limit, with margin

/** Minimal KV surface we use (avoids depending on @cloudflare/workers-types). */
interface KvStore {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

/** Best-effort KV counter guard. Returns true if we're allowed to spend a call. */
async function underCaps(kv: KvStore): Promise<boolean> {
  const day = new Date().toISOString().slice(0, 10);
  const minute = Math.floor(Date.now() / 60000);
  const dayKey = `cnt:${day}`;
  const minKey = `min:${minute}`;
  const [dRaw, mRaw] = await Promise.all([kv.get(dayKey), kv.get(minKey)]);
  const d = parseInt(dRaw ?? "0", 10) || 0;
  const m = parseInt(mRaw ?? "0", 10) || 0;
  if (d >= DAY_CAP || m >= MIN_CAP) return false;
  // Count every attempt (docs: "every request counts"). Races at this volume are
  // negligible; the cap is a safety valve, not an accountant.
  await Promise.all([
    kv.put(dayKey, String(d + 1), { expirationTtl: 60 * 60 * 26 }),
    kv.put(minKey, String(m + 1), { expirationTtl: 120 }),
  ]);
  return true;
}

/**
 * Fetch sponsored cards for a placed page. Returns [] on any miss (unknown page,
 * no key, over cap, API error, empty/no-match, or all cards filtered out) so the
 * caller can simply render nothing.
 */
export async function fetchSponsored(page: string, country: string): Promise<SponsoredCard[]> {
  const spec = PAGE_QUERIES[page];
  if (!spec) return [];

  let env: CloudflareEnv | undefined;
  try {
    env = getCloudflareContext().env;
  } catch {
    env = undefined;
  }
  // A real Worker secret (binding) WINS over the build-time env, so the owner can
  // cut the production key over with a single `wrangler secret put` — no code
  // redeploy, no .env edit — and it immediately overrides the sandbox fallback.
  // Fallback: the build-time sandbox key in .env.production.local (like UNLOCK_SECRET).
  const key = env?.INDOLEADS_AI_ADS_KEY ?? process.env.INDOLEADS_AI_ADS_KEY;
  const kv = env?.INDOLEADS_ADS as KvStore | undefined;
  if (!key || !kv) return [];

  if (!(await underCaps(kv))) return [];

  const cc = /^[A-Za-z]{2}$/.test(country) ? country.toUpperCase() : "US";

  let res: Response;
  try {
    res = await fetch("https://ads.indoleads.ai/v1/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Key": key },
      body: JSON.stringify({ query: spec.query, country: cc, lang: spec.lang }),
      cache: "no-store",
    });
  } catch {
    return [];
  }
  if (!res.ok) return [];

  let data: RawResponse;
  try {
    data = (await res.json()) as RawResponse;
  } catch {
    return [];
  }
  if (!data.ads || data.ads.length === 0) return [];
  return filterCards(data.ads);
}
