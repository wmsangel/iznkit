"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

/**
 * Fires `tool_opened{tool}` once when a tool page mounts — the top of the usage
 * funnel (opened → used → downloaded). Rendered from ToolBreadcrumbs so every
 * tool page is covered in one place. No PII. Returns nothing.
 */
export function ToolOpened({ tool }: { tool: string }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track("tool_opened", { tool });
  }, [tool]);
  return null;
}
