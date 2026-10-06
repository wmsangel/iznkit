"use client";

import { useEffect } from "react";

const ID = 113481986;
const SRC = `https://mc.yandex.ru/metrika/tag.js?id=${ID}`;

type Ym = ((...args: unknown[]) => void) & { a?: unknown[]; l?: number };
declare global {
  interface Window {
    ym?: Ym;
  }
}

let loaded = false;

/**
 * Yandex Metrika counter — client-side, production only, consent-gated: it
 * starts unless the visitor has declined (matching how GA tracks by default),
 * and starts on a later "granted" choice. Webvisor/clickmap on.
 */
function loadMetrika() {
  if (loaded || window.ym) return;
  loaded = true;

  const stub = function (...args: unknown[]) {
    (stub.a = stub.a || []).push(args);
  } as Ym;
  stub.l = Date.now();
  window.ym = stub;

  const first = document.getElementsByTagName("script")[0];
  const k = document.createElement("script");
  k.async = true;
  k.src = SRC;
  first?.parentNode?.insertBefore(k, first);

  window.ym(ID, "init", {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: "dataLayer",
    accurateTrackBounce: true,
    trackLinks: true,
  });
}

export function YandexMetrika() {
  useEffect(() => {
    const allowed = () => {
      try {
        return localStorage.getItem("iznkit:consent") !== "denied";
      } catch {
        return true;
      }
    };
    if (allowed()) loadMetrika();
    const onConsent = () => {
      if (allowed()) loadMetrika();
    };
    window.addEventListener("iznkit:consent", onConsent);
    return () => window.removeEventListener("iznkit:consent", onConsent);
  }, []);

  return null;
}
