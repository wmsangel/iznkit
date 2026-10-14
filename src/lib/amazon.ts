/**
 * Amazon Associates (tag iznkit-20) — book recommendations shown on EN guides only.
 *
 * Constraints baked in:
 *  - EN audience only (Amazon has no RU marketplace); the block renders for locale "en".
 *  - No manual prices and no product images (Amazon policy; images need PA-API after the
 *    first 3 sales). We link to an Amazon search for the specific title, so there is no
 *    fabricated ASIN and nothing to go stale.
 *  - Every link carries the Associates tag and rel="sponsored"; a disclosure sits with them.
 *
 * To add a book: append to the guide's list below. Keep it to 1–2 per guide so the block
 * stays a genuine reading suggestion, not an ad wall.
 */
export const AMAZON_TAG = "iznkit-20";

export interface Book {
  title: string;
  author?: string;
  /** one short line: why it fits this guide's reader */
  why: string;
  /** Amazon search query (title + author) — precise enough to land on the book */
  query: string;
}

/** Amazon.com search URL for a title, carrying the Associates tag. */
export function amazonSearch(query: string): string {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AMAZON_TAG}`;
}

/** guide slug → recommended books (EN) */
export const GUIDE_BOOKS: Record<string, Book[]> = {
  "freelance-tax-explained": [
    { title: "Working for Yourself", author: "Stephen Fishman (Nolo)", why: "Taxes, deductions and legal basics for the self-employed.", query: "Working for Yourself Nolo Fishman" },
    { title: "Self-Employed Tax Solutions", author: "June Walker", why: "Plain-English tax and record-keeping for freelancers.", query: "Self-Employed Tax Solutions June Walker" },
  ],
  "how-to-set-your-hourly-rate": [
    { title: "The Freelancer's Bible", author: "Sara Horowitz", why: "Setting rates, finding clients and running the business of you.", query: "The Freelancer's Bible Sara Horowitz" },
    { title: "Pricing Creativity", author: "Blair Enns", why: "Moving from hourly to value-based pricing.", query: "Pricing Creativity Blair Enns" },
  ],
  "how-to-make-an-invoice": [
    { title: "Accounting QuickStart Guide", author: "Josh Bauerle", why: "Invoicing, bookkeeping and the numbers a small business needs.", query: "Accounting QuickStart Guide Bauerle" },
  ],
  "how-to-write-a-quote": [
    { title: "Million Dollar Consulting Proposals", author: "Alan Weiss", why: "Writing quotes and proposals clients say yes to.", query: "Million Dollar Consulting Proposals Alan Weiss" },
  ],
  "one-way-vs-mutual-nda": [
    { title: "Nolo's Guide to Business Contracts", author: "Nolo", why: "Plain-English contracts, including NDAs, for small business.", query: "Business Contracts Nolo" },
  ],
  "what-is-a-unilateral-nda": [
    { title: "Business Contracts: Turn Any Business Contract to Your Advantage", author: "Nolo", why: "How confidentiality and other clauses actually work.", query: "Business Contracts Nolo" },
  ],
  "what-is-a-mutual-nda": [
    { title: "Nolo's Guide to Business Contracts", author: "Nolo", why: "Mutual vs one-way terms and other everyday contract clauses.", query: "Business Contracts Nolo" },
  ],
  "what-is-a-jwt": [
    { title: "API Security in Action", author: "Neil Madden", why: "Tokens, JWTs and securing the APIs behind them.", query: "API Security in Action Neil Madden" },
  ],
  "what-is-hashing": [
    { title: "Serious Cryptography", author: "Jean-Philippe Aumasson", why: "Hashing, salts and modern crypto, explained for engineers.", query: "Serious Cryptography Aumasson" },
  ],
  "what-is-a-cron-expression": [
    { title: "The Linux Command Line", author: "William Shotts", why: "cron, the shell and the Unix tools around them.", query: "The Linux Command Line William Shotts" },
  ],
  "what-is-a-utm-parameter": [
    { title: "Lean Analytics", author: "Croll & Yoskovitz", why: "UTMs, metrics and measuring what actually matters.", query: "Lean Analytics Croll Yoskovitz" },
  ],
  "how-to-create-a-strong-password": [
    { title: "Cybersecurity for Beginners", author: "Raef Meeuwisse", why: "Passwords, phishing and staying safe online.", query: "Cybersecurity for Beginners Raef Meeuwisse" },
  ],
};

export function booksForGuide(slug: string): Book[] {
  return GUIDE_BOOKS[slug] ?? [];
}
