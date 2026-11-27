import type { Locale } from "@/lib/i18n/config";

/**
 * Contextual partner offers shown under a tool ("You may like").
 *
 * Keys match a tool's `affiliate` field in the registry. EVERY link goes through
 * our own /go redirect (src/app/go/[id]/route.ts) behind a gesture gate and a
 * click-time token — see gotoken.ts. That means the partner URLs below must NEVER
 * reach client code or the page HTML: only `PublicOffer` (id, name, blurb) is
 * passed to components. The URL is resolved server-side in /go.
 *
 * Network sub-id (shared network accounts need it to attribute a click to a site
 * and page): `iznkit-<page slug>` — Indoleads `p1`, Admitad/Mitgo `subid`.
 *
 * Keep the block honest: it's labelled "Sponsored" and covered by the Affiliate
 * Disclosure. Cross-promo of our own network sites is NOT done here any more
 * (network links are home/about only, nofollow — owner decision 2026-11-24).
 */
export type Net = "admitad" | "indoleads" | "none";

export interface Offer {
  /** Stable id used in /go/<id>. */
  id: string;
  name: string;
  /** The real partner URL — server-side only (resolved in /go). */
  url: string;
  /** Which network's sub-id parameter to use. "none" = plain brand link. */
  net: Net;
  blurb: Record<Locale, string>;
}

/** What components may see: no URL. */
export type PublicOffer = Pick<Offer, "id" | "name" | "net" | "blurb">;

export const AFFILIATES: Record<string, Offer[]> = {
  "password-managers": [
    {
      id: "nordpass",
      name: "NordPass",
      // LIVE affiliate link (Mitgo/Takeads, per-sale).
      url: "https://rkdro.com/g/mx19yq7dtc330d4f803c410fff306a/",
      net: "admitad",
      blurb: {
        en: "Store and autofill strong passwords across all your devices.",
        ru: "Хранит и подставляет надёжные пароли на всех устройствах.",
      },
    },
    {
      id: "1password",
      name: "1Password",
      url: "https://1password.com/", // TODO: replace with affiliate link
      net: "none",
      blurb: {
        en: "Trusted password manager for families and teams.",
        ru: "Проверенный менеджер паролей для семьи и команд.",
      },
    },
    {
      id: "proton-pass",
      name: "Proton Pass",
      url: "https://proton.me/pass", // TODO: replace with affiliate link
      net: "none",
      blurb: {
        en: "Encrypted password manager from the makers of Proton Mail.",
        ru: "Зашифрованный менеджер паролей от создателей Proton Mail.",
      },
    },
  ],
  "developer-tools": [
    {
      id: "adguard",
      name: "AdGuard",
      // LIVE affiliate link (Mitgo/Takeads, per-sale).
      url: "https://dhwnh.com/g/xc497owldv330d4f803ca9584d7a68/",
      net: "admitad",
      blurb: {
        en: "Block ads and trackers everywhere — plus a fast, private VPN.",
        ru: "Блокировка рекламы и трекеров везде — плюс быстрый приватный VPN.",
      },
    },
    {
      id: "nordvpn",
      name: "NordVPN",
      // LIVE affiliate link (Mitgo/Takeads, per-sale).
      url: "https://qwpeg.com/g/mai1uhgx16330d4f803c004ed038cb/",
      net: "admitad",
      blurb: {
        en: "Fast VPN with strong encryption and a strict no-logs policy.",
        ru: "Быстрый VPN с сильным шифрованием и строгой политикой no-logs.",
      },
    },
    {
      id: "purevpn",
      name: "PureVPN",
      // LIVE affiliate link (Mitgo/Takeads, per-sale).
      url: "https://plrvq.com/g/ayvzzawv40330d4f803cdd63dd688c/",
      net: "admitad",
      blurb: {
        en: "Budget VPN with 6500+ servers across 78+ countries.",
        ru: "Бюджетный VPN: 6500+ серверов в 78+ странах.",
      },
    },
    {
      id: "prohoster",
      name: "ProHoster",
      // LIVE affiliate link (Mitgo/Takeads, per-sale).
      url: "https://ntzgd.com/g/gaetfoqpj7330d4f803c934d4157fe/",
      net: "admitad",
      blurb: {
        en: "Reliable web hosting & VPS from $2.5 — servers worldwide.",
        ru: "Надёжный хостинг и VPS от $2.5 — серверы по всему миру.",
      },
    },
  ],
  education: [
    // Coursera (Indoleads, trackerpro.org) DISABLED 2026-11-08: the deeplink was
    // hijacked by Indoleads to a "CouponNuts" Chrome coupon extension instead of
    // coursera.org (verified via redirect trace + browser). No clean Coursera link
    // available — re-add only with a verified destination. See research/MONETIZATION.md.
    {
      id: "abebooks",
      name: "AbeBooks",
      // LIVE affiliate link (Indoleads, per-sale).
      url: "https://z02o.xyz/6ac650643346a",
      net: "indoleads",
      blurb: {
        en: "Books new, used and rare — from thousands of independent sellers worldwide.",
        ru: "Книги новые, б/у и редкие — от тысяч независимых продавцов по всему миру.",
      },
    },
  ],
  "creative-assets": [
    {
      id: "envato",
      name: "Envato",
      // LIVE affiliate link (Mitgo/Takeads, per-sale).
      url: "https://xcdus.com/g/5gu8irreos330d4f803ca186dc55d3/",
      net: "admitad",
      blurb: {
        en: "Unlimited templates, fonts, photos, video and music — one subscription.",
        ru: "Безлимит шаблонов, шрифтов, фото, видео и музыки — одна подписка.",
      },
    },
    {
      id: "wps-office",
      name: "WPS Office",
      // LIVE affiliate link (Indoleads, CPS 30% + CPI, source=iznkit). First-time
      // subscriptions only; traffic from IN/JP/CN is prohibited by the offer.
      url: "https://z03o.xyz/6ad7745b5a953",
      net: "indoleads",
      blurb: {
        en: "Free office suite with ready-made Writer, Spreadsheet and Presentation templates.",
        ru: "Бесплатный офисный пакет с готовыми шаблонами документов, таблиц и презентаций.",
      },
    },
  ],
  "pdf-tools": [
    {
      id: "wondershare-pdfelement",
      name: "Wondershare PDFelement",
      // LIVE affiliate link (Admitad, 30% per-sale, WW incl. RU). Deeplinked to PDFelement.
      url: "https://kjuzv.com/g/8u3trxihmw330d4f803cef655e4ac9/?ulp=https%3A%2F%2Fpdf.wondershare.com%2F",
      net: "admitad",
      blurb: {
        en: "Edit, convert, fill and sign PDFs on any device — a lighter alternative to Acrobat.",
        ru: "Редактируйте, конвертируйте, заполняйте и подписывайте PDF на любом устройстве — лёгкая замена Acrobat.",
      },
    },
    {
      id: "wps-office",
      name: "WPS Office",
      // LIVE affiliate link (Indoleads, CPS 30% + CPI, source=iznkit). First-time
      // subscriptions only; traffic from IN/JP/CN is prohibited by the offer.
      url: "https://z03o.xyz/6ad7745b5a953",
      net: "indoleads",
      blurb: {
        en: "Free office suite — open, edit and convert Word, Excel, PowerPoint and PDF on any device.",
        ru: "Бесплатный офисный пакет — открывайте, редактируйте и конвертируйте Word, Excel, PowerPoint и PDF на любом устройстве.",
      },
    },
  ],
};

/** Offers for a category with the partner URL stripped (safe for client props). */
export function offersFor(category?: string): PublicOffer[] {
  if (!category) return [];
  return (AFFILIATES[category] ?? []).map(({ id, name, net, blurb }) => ({
    id,
    name,
    net,
    blurb,
  }));
}

/** Server side: id → full offer (with URL). Used only by /go. */
const OFFER_BY_ID: Record<string, Offer> = (() => {
  const m: Record<string, Offer> = {};
  for (const list of Object.values(AFFILIATES)) for (const o of list) m[o.id] = o;
  return m;
})();

export function offerById(id: string): Offer | undefined {
  return OFFER_BY_ID[id];
}

/** Sub-id value: `<domain>-<place>` (network standard 2026-11-27). */
export function subId(place?: string): string {
  const clean = (place ?? "").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").slice(0, 60);
  return clean ? `iznkit-${clean}` : "iznkit";
}

/**
 * Append the sub-id to a partner URL by network (Indoleads p1, Admitad/Mitgo
 * subid). Shared network accounts can't tell which site/page earned a click
 * without it. Unknown/"none" networks are returned untouched.
 */
export function withSub(url: string, net: Net, place?: string): string {
  if (net === "none") return url;
  try {
    const u = new URL(url);
    u.searchParams.set(net === "indoleads" ? "p1" : "subid", subId(place));
    return u.toString();
  } catch {
    return url;
  }
}
