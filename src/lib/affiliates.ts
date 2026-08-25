import type { Locale } from "@/lib/i18n/config";

/**
 * Contextual partner offers shown under a tool ("You may like").
 *
 * Keys match a tool's `affiliate` field in the registry. URLs are currently the
 * plain brand homepages — REPLACE each `url` with your real affiliate/tracking
 * link once you're approved in that program. Links render with rel="sponsored".
 * Keep the block honest: it's labelled and covered by the Affiliate Disclosure.
 */
export interface Offer {
  name: string;
  url: string;
  blurb: Record<Locale, string>;
}

export const AFFILIATES: Record<string, Offer[]> = {
  "password-managers": [
    {
      name: "NordPass",
      url: "https://nordpass.com/", // TODO: replace with affiliate link
      blurb: {
        en: "Store and autofill strong passwords across all your devices.",
        ru: "Хранит и подставляет надёжные пароли на всех устройствах.",
      },
    },
    {
      name: "1Password",
      url: "https://1password.com/", // TODO: replace with affiliate link
      blurb: {
        en: "Trusted password manager for families and teams.",
        ru: "Проверенный менеджер паролей для семьи и команд.",
      },
    },
    {
      name: "Proton Pass",
      url: "https://proton.me/pass", // TODO: replace with affiliate link
      blurb: {
        en: "Encrypted password manager from the makers of Proton Mail.",
        ru: "Зашифрованный менеджер паролей от создателей Proton Mail.",
      },
    },
  ],
  "developer-tools": [
    {
      name: "AdGuard",
      // LIVE affiliate link (Mitgo/Takeads, per-sale).
      url: "https://dhwnh.com/g/xc497owldv330d4f803ca9584d7a68/",
      blurb: {
        en: "Block ads and trackers everywhere — plus a fast, private VPN.",
        ru: "Блокировка рекламы и трекеров везде — плюс быстрый приватный VPN.",
      },
    },
    {
      name: "ProHoster",
      // LIVE affiliate link (Mitgo/Takeads, per-sale).
      url: "https://ntzgd.com/g/gaetfoqpj7330d4f803c934d4157fe/",
      blurb: {
        en: "Reliable web hosting & VPS from $2.5 — servers worldwide.",
        ru: "Надёжный хостинг и VPS от $2.5 — серверы по всему миру.",
      },
    },
    {
      name: "DigitalOcean",
      url: "https://www.digitalocean.com/", // TODO: replace with affiliate link
      blurb: {
        en: "Simple cloud servers and app hosting for developers.",
        ru: "Простые облачные серверы и хостинг приложений для разработчиков.",
      },
    },
  ],
};

export function offersFor(category?: string): Offer[] {
  if (!category) return [];
  return AFFILIATES[category] ?? [];
}
