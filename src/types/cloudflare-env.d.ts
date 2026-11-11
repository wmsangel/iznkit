// Augments the OpenNext-generated CloudflareEnv with the bindings this app adds.
// Merges by declaration-merging into the global interface declared by
// @opennextjs/cloudflare, so getCloudflareContext().env is typed for them.
export {};

declare global {
  interface CloudflareEnv {
    /** KV namespace for the Indoleads AI Ads rate-limiter / daily-cap counter. */
    INDOLEADS_ADS?: KVNamespace;
    /** Indoleads AI Ads API key (Worker secret, server-side only). */
    INDOLEADS_AI_ADS_KEY?: string;
    /** Gate: cards are served only when this is exactly "production". */
    INDOLEADS_MODE?: string;
  }
}
