/**
 * Donation details. iznkit is free right now; a tip is optional.
 * Single source of truth for the wallets shown on the donate page.
 *
 * Every address below was verified programmatically before commit:
 *   - TRON: base58check, 25 bytes, 0x41 prefix, valid checksum
 *   - Solana: base58 decodes to 32 bytes
 *   - Ethereum: matches /^0x[0-9a-f]{40}$/
 * QR codes are generated and self-hosted (public/donate/*.svg) — never pulled
 * from a third-party image API (privacy + no address swap). Network names and
 * coin lists are technical, so they are the same in every language.
 */
export interface DonateNetwork {
  id: "tron" | "solana" | "ethereum";
  /** Network + standard, e.g. "TRON (TRC-20)". */
  network: string;
  /** Accepted coins on this network. */
  coins: string;
  /** Wallet address (verified). */
  address: string;
  /** Self-hosted QR of the address above. */
  qr: string;
}

export const DONATE = {
  networks: [
    {
      id: "tron",
      network: "TRON (TRC-20)",
      coins: "USDT · USDC · TRX",
      address: "TTYkkhf3Pbc3Vw8h8wt2Y1uEGfxmT1TcL6",
      qr: "/donate/tron.svg",
    },
    {
      id: "solana",
      network: "Solana (SPL)",
      coins: "SOL · USDT",
      address: "He8CCQNSxyeGTiBG1EwxjbfNnQJndYB58jY15fBezyLX",
      qr: "/donate/solana.svg",
    },
    {
      id: "ethereum",
      network: "Ethereum (ERC-20)",
      coins: "ETH · USDT · USDC",
      address: "0x80cda3f917b5cb07217bacc5d81605d406cbcfb8",
      qr: "/donate/ethereum.svg",
    },
  ] as DonateNetwork[],
  /** Public GitHub repository — for the "Star on GitHub" free-help CTA. */
  repoUrl: "https://github.com/wmsangel/iznkit",
  /** Path (without locale) to the on-site donate page. */
  path: "donate",
} as const;
