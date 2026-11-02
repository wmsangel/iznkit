// OpenNext Cloudflare adapter — mirrors the calclumen/costtrek setup.
// Static-assets incremental cache: prerendered pages ship as Workers assets
// (served free), not mass-written to KV. iznkit is effectively static.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
