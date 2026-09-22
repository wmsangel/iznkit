"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

interface Labels {
  shareX: string;
  shareReddit: string;
  copyLink: string;
  linkCopied: string;
  starGithub: string;
}

export function DonateHelp({
  shareUrl,
  shareText,
  repoUrl,
  labels,
}: {
  shareUrl: string;
  shareText: string;
  repoUrl: string;
  labels: Labels;
}) {
  const [copied, setCopied] = useState(false);

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText,
  )}&url=${encodeURIComponent(shareUrl)}`;
  const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(
    shareUrl,
  )}&title=${encodeURIComponent(shareText)}`;

  function openShare(where: "x" | "reddit", url: string) {
    track("donate_share", { where });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      track("donate_share", { where: "copy_link" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const btn =
    "inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors";

  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" className={btn} onClick={() => openShare("x", xUrl)}>
        𝕏 {labels.shareX}
      </button>
      <button type="button" className={btn} onClick={() => openShare("reddit", redditUrl)}>
        {labels.shareReddit}
      </button>
      <button type="button" className={btn} onClick={copyLink}>
        {copied ? labels.linkCopied : labels.copyLink}
      </button>
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        onClick={() => track("donate_share", { where: "github" })}
      >
        ★ {labels.starGithub}
      </a>
    </div>
  );
}
