/**
 * Tools that POST their data to a server route (PDF generation under /api/pdf/*).
 * For these we can't honestly claim "your data never leaves your browser", so the
 * privacy trust-line is hidden. Everything else computes entirely client-side.
 *
 * Keep this in sync with the routes in src/app/api/pdf/.
 */
export const SERVER_TOOLS = new Set<string>([
  "ad-roi",
  "gift-certificate",
  "delivery-note",
  "hourly-rate",
  "inspection-report",
  "invoice",
  "nda",
  "purchase-order",
  "quote",
  "receipt",
  "rental-yield",
  "self-employed-tax",
  "timesheet",
  "unit-economics",
  "schet-faktura",
]);

/** True when a tool runs purely in the browser (no data sent to a server). */
export function isLocalTool(slug: string): boolean {
  return !SERVER_TOOLS.has(slug);
}
