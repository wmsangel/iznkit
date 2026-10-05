import { useRef } from "react";
import { track } from "@/lib/analytics";

/**
 * Returns a function that fires `tool_use {tool, action:"calculate"}` once per
 * mount — the first time the user interacts. Attach it to a live calculator's
 * root via onInput so we can tell an engaged use from a bounce (page_view alone
 * can't). Firing once keeps it out of per-keystroke noise.
 */
export function useToolUsed(tool: string): () => void {
  const fired = useRef(false);
  return () => {
    if (fired.current) return;
    fired.current = true;
    track("tool_use", { tool, action: "calculate" });
  };
}
