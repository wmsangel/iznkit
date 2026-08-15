/**
 * Donation details. iznkit is free right now; a tip is optional.
 * Single source of truth for the wallet shown on the donate page and linked
 * from the tool download panels.
 */
export const DONATE = {
  /** TRON (TRC-20) wallet — accepts USDT, USDC, TRX. */
  tronAddress: "TT5MBhRrX4Fioc2F78BiWG95K2esAHKSMo",
  /** Self-hosted QR of the address above. */
  tronQr: "/donate/tron.svg",
  /** Path (without locale) to the on-site donate page. */
  path: "donate",
} as const;
