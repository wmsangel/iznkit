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
  className,
  children,
}: {
  href: string;
  event: string;
  params?: Record<string, unknown>;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const onClick = () => track(event, params);
  if (external) {
    return (
      <a href={href} onClick={onClick} target="_blank" rel="noopener" className={className}>
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
