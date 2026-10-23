"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

/**
 * A link that fires a GA4 event on click. Internal by default (next/link);
 * pass `external` for an outbound <a>. Used for related-tool, guide and
 * sister-site clicks so we can see what people actually navigate to.
 */
export function TrackedLink({
  href,
  event,
  params,
  external,
  nofollow,
  className,
  children,
}: {
  href: string;
  event: string;
  params?: Record<string, unknown>;
  external?: boolean;
  /** Add rel="nofollow" — for repeated sitewide blocks (footer/network lists),
   * per the network policy that only single in-text contextual links stay do-follow. */
  nofollow?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const onClick = () => track(event, params);
  if (external) {
    return (
      <a
        href={href}
        onClick={onClick}
        target="_blank"
        rel={nofollow ? "nofollow noopener" : "noopener"}
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}
