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

/** Canonical production host — Metrika must never start on mirror/preview aliases. */
const PROD_HOST = "iznkit.com";

/**
 * Yandex Metrika counter (+ Webvisor) — client-side, opt-in: it starts ONLY
 * after the visitor explicitly accepts in the consent banner, and never before,
 * so EEA/UK/CH visitors who don't opt in are never tracked. It also sets _ym_*
 * cookies, which is why it stays behind consent. Loads only on the prod host.
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
    if (window.location.hostname !== PROD_HOST) return;
    const allowed = () => {
      try {
        return localStorage.getItem("iznkit:consent") === "granted";
      } catch {
        return false;
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
