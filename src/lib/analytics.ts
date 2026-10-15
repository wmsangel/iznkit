/**
 * Thin wrapper over gtag for custom GA4 events. Safe to call anywhere: it no-ops
 * on the server and when the tag hasn't loaded (ad-blocked, etc.). GA4 attaches
 * page_location automatically, so events are attributable to the current page.
 *
 * Call sites keep their readable local names (track("tool_use", { tool, action })).
 * `normalize()` maps them onto the NETWORK-WIDE event convention before they hit
 * GA4, so every custom event carries a mandatory `item` (what exactly happened)
 * plus optional `placement` / `action` / `platform` / `value`. Register those five
 * as event-scoped custom dimensions in GA4 to see the breakdown in reports.
 *
 * Wire events (what GA4 receives): tool_used · copy_click · download · share_click
 * · search · affiliate_click · cta_click · outbound_click.
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type Params = Record<string, unknown>;

function str(v: unknown): string | undefined {
  return v == null || v === "" ? undefined : String(v);
}

/** Map a call site's event+params onto the network convention. */
function normalize(event: string, p: Params): { event: string; params: Params } {
  const out: Params = {};
  const set = (k: string, v: unknown) => {
    const s = str(v);
    if (s !== undefined) out[k] = s;
  };

  switch (event) {
    case "tool_use": {
      set("item", p.tool);
      const action = str(p.action);
      if (action === "copy") return { event: "copy_click", params: out };
      if (action === "download") return { event: "download", params: out };
      if (action === "share") return { event: "share_click", params: out };
      if (action) out.action = action; // calculate, etc.
      return { event: "tool_used", params: out };
    }
    case "affiliate_click":
      set("item", p.partner ?? p.item);
      set("placement", p.slot ?? p.placement);
      set("platform", p.platform);
      return { event: "affiliate_click", params: out };
    case "amazon_click":
      set("item", p.book);
      set("placement", p.guide ? `guide:${str(p.guide)}` : undefined);
      out.platform = "amazon";
      return { event: "affiliate_click", params: out };
    case "site_search":
      set("item", p.term);
      if (p.results != null) out.value = p.results;
      return { event: "search", params: out };
    case "outbound_click":
      set("item", p.to);
      set("placement", p.where);
      return { event: "outbound_click", params: out };
    case "guide_click":
      set("item", `guide:${str(p.to)}`);
      set("placement", p.from);
      return { event: "cta_click", params: out };
    case "related_click":
      set("item", `related:${str(p.to)}`);
      set("placement", p.from);
      return { event: "cta_click", params: out };
    case "featured_click":
      set("item", `featured:${str(p.href)}`);
      return { event: "cta_click", params: out };
    case "fab_action":
      set("item", `fab:${str(p.action)}`);
      return { event: "cta_click", params: out };
    case "donate_share":
      set("item", p.where ? `donate:${str(p.where)}` : "donate");
      return { event: "share_click", params: out };
    case "copy_password":
      out.item = "password";
      if (p.length != null) out.value = p.length;
      return { event: "copy_click", params: out };
    case "copy_donate_address":
      set("item", `donate:${str(p.network)}`);
      return { event: "copy_click", params: out };
    case "download_pdf":
      out.item = "pdf";
      set("value", p.mode);
      return { event: "download", params: out };
    default:
      // Already a convention event — pass through, keeping item if present.
      return { event, params: p };
  }
}

export function track(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const n = normalize(event, params ?? {});
  window.gtag?.("event", n.event, n.params);
}
