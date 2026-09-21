// Google AdSense publisher client id. This is public information (it appears in
// ads.txt and in the on-page loader), so it's safe to keep in the repo. An env
// var can override it without a code change if the account ever changes.
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_ID || "ca-pub-5535516142831006";
