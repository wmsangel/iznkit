import { PROJECTS } from "@/lib/projects";

/** Hosts of every site in the network (incl. the studio and sites not in PROJECTS). */
const EXTRA = ["izagorodnyi.dev", "rightweekend.com"];

const NETWORK_HOSTS: Set<string> = new Set([
  ...PROJECTS.map((p) => {
    try {
      return new URL(p.url).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  }).filter(Boolean),
  ...EXTRA,
]);

/** True if `href` is an absolute URL pointing at one of our own network sites. */
export function isNetworkUrl(href: string): boolean {
  try {
    return NETWORK_HOSTS.has(new URL(href).hostname.replace(/^www\./, ""));
  } catch {
    return false;
  }
}
