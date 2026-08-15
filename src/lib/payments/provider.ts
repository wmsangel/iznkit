import crypto from "node:crypto";

/**
 * Payment abstraction.
 *
 * The product sells one-time "unlocks": pay a small fee, get a signed token,
 * exchange the token for a clean (un-watermarked) download. Today this ships a
 * `StubProvider` that grants the unlock instantly so the whole flow is runnable
 * end-to-end. Swapping in Stripe (global) or YooKassa (RU) means implementing
 * `createCheckout` + a webhook that calls `issueUnlock` — nothing else changes.
 */

export interface CheckoutResult {
  /** Where to send the user to pay. `null` in the stub (no redirect needed). */
  checkoutUrl: string | null;
  /** Signed unlock token, present when payment is already settled (stub). */
  unlockToken: string | null;
  provider: string;
}

export interface PaymentProvider {
  readonly name: string;
  createCheckout(sku: string): Promise<CheckoutResult>;
}

const SECRET = process.env.UNLOCK_SECRET ?? "dev-only-insecure-secret-change-me";
const TTL_MS = 30 * 60 * 1000; // an unlock token is valid for 30 minutes

function sign(data: string): string {
  return crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
}

/** Mint a signed unlock token for a given SKU. Called after payment settles. */
export function issueUnlock(sku: string): string {
  const payload = JSON.stringify({ sku, exp: Date.now() + TTL_MS });
  const body = Buffer.from(payload).toString("base64url");
  return `${body}.${sign(body)}`;
}

/** Verify a token really unlocks `sku` and hasn't expired. Timing-safe. */
export function verifyUnlock(token: string | null | undefined, sku: string): boolean {
  if (!token) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  const expected = sign(body);
  if (
    expected.length !== sig.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  ) {
    return false;
  }
  try {
    const { sku: tokenSku, exp } = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    );
    return tokenSku === sku && typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

/** Dev/MVP provider: grants the unlock immediately, no real charge. */
class StubProvider implements PaymentProvider {
  readonly name = "stub";
  async createCheckout(sku: string): Promise<CheckoutResult> {
    return {
      checkoutUrl: null,
      unlockToken: issueUnlock(sku),
      provider: this.name,
    };
  }
}

export function getPaymentProvider(): PaymentProvider {
  // Later: switch on region / env (StripeProvider, YooKassaProvider).
  return new StubProvider();
}
