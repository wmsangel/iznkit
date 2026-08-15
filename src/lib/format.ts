const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  RUB: "₽",
  UAH: "₴",
  KZT: "₸",
  INR: "₹",
  CNY: "¥",
  JPY: "¥",
  PLN: "zł ",
};

export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/** ASCII-safe slug for use in a Content-Disposition filename (headers are ByteStrings). */
export function asciiSlug(s: string | undefined | null): string {
  return (
    (s ?? "")
      .replace(/[^\w.-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "draft"
  );
}

export function formatMoney(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? "";
  const formatted = (Number(amount) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return symbol ? `${symbol}${formatted}` : `${formatted} ${currency}`;
}

export function formatPercent(ratio: number, digits = 1): string {
  return `${((Number(ratio) || 0) * 100).toFixed(digits)}%`;
}

export const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "RUB",
  "UAH",
  "KZT",
  "PLN",
  "CNY",
  "JPY",
  "INR",
  "CAD",
  "AUD",
] as const;
