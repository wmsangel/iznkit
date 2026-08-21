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
      name: "Hostinger",
      url: "https://www.hostinger.com/", // TODO: replace with real affiliate link
      blurb: {
        en: "Fast, low-cost web hosting for your side projects.",
        ru: "Быстрый и недорогой хостинг для ваших проектов.",
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
    {
      name: "NordVPN",
      url: "https://nordvpn.com/", // TODO: replace with affiliate link
      blurb: {
        en: "Private, secure browsing on any network.",
        ru: "Приватный и защищённый доступ в интернет в любой сети.",
      },
    },
  ],
};

export function offersFor(category?: string): Offer[] {
  if (!category) return [];
  return AFFILIATES[category] ?? [];
}
