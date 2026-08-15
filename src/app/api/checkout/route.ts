import { NextRequest, NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments/provider";

export const runtime = "nodejs";

const ALLOWED_SKUS = new Set([
  "tool:invoice",
  "tool:rental-yield",
  "tool:nda",
  "tool:inspection",
  "tool:hourly-rate",
  "tool:self-employed-tax",
  "tool:receipt",
  "tool:quote",
  "tool:ad-roi",
  "tool:unit-economics",
  "tool:purchase-order",
  "tool:delivery-note",
  "tool:timesheet",
  "tool:gift-certificate",
]);

export async function POST(req: NextRequest) {
  let body: { sku?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const sku = body.sku;
  if (!sku || !ALLOWED_SKUS.has(sku)) {
    return NextResponse.json({ error: "Unknown SKU" }, { status: 400 });
  }

  const provider = getPaymentProvider();
  const result = await provider.createCheckout(sku);
  return NextResponse.json(result);
}
