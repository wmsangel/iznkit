"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { goUrl } from "@/lib/affiliates/gotoken";

/**
 * Site-wide delegated handler for our affiliate links (`a[data-go]`).
 *
 * The HTML carries no /go URL and no partner URL — only `href="#"` and
 * `data-go="<id>"` (+ `data-go-s` place, `data-go-q` search text for Amazon). On
 * a real (trusted) press we write the tokenized /go URL into `href` just before
 * the browser follows it, so the navigation is still a plain user-activated link
 * click (Sec-Fetch-User: ?1, same-origin Referer) and middle-click / "open in new
 * tab" keep working. A scripted (untrusted) click keeps href="#" and is
 * cancelled. Why: see src/lib/affiliates/gotoken.ts.
 *
 * affiliate_click is fired here, only for trusted presses that got a real URL —
 * so a bot that merely clicks the placeholder is not counted. Params come from
 * data-aff-* attributes: item (partner/book), network, placement (page slug).
 */
function goAnchor(e: Event): HTMLAnchorElement | null {
  const el = e.target as HTMLElement | null;
  return (el?.closest?.("a[data-go]") as HTMLAnchorElement | null) ?? null;
}

/** Write a fresh tokenized /go URL into the anchor. Trusted events only. */
function arm(e: Event): HTMLAnchorElement | null {
  const a = goAnchor(e);
  if (!a) return null;
  const id = a.dataset.go;
  if (!e.isTrusted || !id) return a;
  a.setAttribute("href", goUrl(id, a.dataset.goS, a.dataset.goQ));
  return a;
}

export function GoClickTracker() {
  useEffect(() => {
    // Arm early (press, touch, Enter, context menu) so every way of following the
    // link — click, middle-click, "open in new tab" — gets a live URL.
    const onArm = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== "Enter") return;
      arm(e);
    };

    const onClick = (e: MouseEvent) => {
      // auxclick also fires for the right button; only the middle one navigates.
      if (e.type === "auxclick" && e.button !== 1) return;
      const a = arm(e);
      if (!a) return;
      // Never follow the placeholder: no token means no destination.
      if ((a.getAttribute("href") || "#") === "#") {
        e.preventDefault();
        return;
      }
      const d = a.dataset;
      track("affiliate_click", {
        item: d.affItem || d.go || "unknown",
        network: d.affNetwork || "",
        placement: d.affPlacement || "",
      });
    };

    const opts = { capture: true } as const;
    const armEvents = ["pointerdown", "mousedown", "touchstart", "keydown", "contextmenu"];
    for (const t of armEvents) document.addEventListener(t, onArm, opts);
    document.addEventListener("click", onClick, opts);
    document.addEventListener("auxclick", onClick, opts);
    return () => {
      for (const t of armEvents) document.removeEventListener(t, onArm, opts);
      document.removeEventListener("click", onClick, opts);
      document.removeEventListener("auxclick", onClick, opts);
    };
  }, []);

  return null;
}
