"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

/**
 * Funnel events for every tool page (rendered from ToolBreadcrumbs, so all tool
 * pages are covered in one place):
 *  - `tool_opened{tool}` once on mount — top of the funnel.
 *  - `tool_used{tool, action:"input"}` once, on the FIRST change/input made inside
 *    <main> (a field, select, checkbox, file picker) — the "opened → used" step,
 *    which most tools did not report on their own (weekly events review 2026-11-27:
 *    11 opens, 3 downloads, 0 tool_used). Debounced to a single event per page
 *    view; carries no value, no text, no file name — never user input.
 * Returns nothing.
 */
export function ToolOpened({ tool }: { tool: string }) {
  const fired = useRef(false);
  useEffect(() => {
    if (!fired.current) {
      fired.current = true;
      track("tool_opened", { tool });
    }

    let used = false;
    const onUse = (e: Event) => {
      if (used) return;
      const el = e.target as HTMLElement | null;
      if (!el?.closest?.("main")) return; // ignore header search etc.
      used = true;
      track("tool_used", { tool, action: "input" });
    };
    document.addEventListener("input", onUse, true);
    document.addEventListener("change", onUse, true);
    return () => {
      document.removeEventListener("input", onUse, true);
      document.removeEventListener("change", onUse, true);
    };
  }, [tool]);
  return null;
}
