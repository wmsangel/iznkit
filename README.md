# izn.tools

A bilingual (EN/RU) hub of small, focused web tools — calculators and document
generators. Each tool is **free to try** and gives a watermarked preview; a small
**one-time payment** unlocks a clean, branded PDF.

## Stack

- **Next.js 16** (App Router) + **React 19** + **Tailwind 4**
- **@react-pdf/renderer** for server-side PDF generation (Cyrillic via bundled Roboto)
- Lightweight custom i18n (locale in the path: `/en`, `/ru`)
- Pluggable payment provider (Stripe / YooKassa) behind a stub

## Run

```bash
npm run dev     # http://localhost:3000 -> redirects to /en or /ru
npm run build
```

Copy `.env.example` to `.env.local` and set `UNLOCK_SECRET`.

## Architecture

```
src/
  lib/
    i18n/           locales, Accept-Language detection, EN/RU dictionaries
    tools/
      registry.ts   the catalog: sections + tools (drives the home page)
      invoice/      per-tool data model + calculations (shared by UI and PDF)
    pdf/            font registration + @react-pdf document templates
    payments/       PaymentProvider abstraction + signed unlock tokens (HMAC)
  app/
    [locale]/       localized layout, hub landing, tool pages
    api/
      checkout/     creates a checkout -> returns an unlock token (stub: instant)
      pdf/invoice/  renders the PDF; watermarked unless a valid unlock token is sent
  components/        header, footer, language switcher, tool UIs
  proxy.ts          locale redirect (Next 16 "proxy" convention)
```

### The paywall flow

1. User fills a tool; a **live HTML preview** updates instantly (no server call).
2. **Free preview** -> `POST /api/pdf/invoice` with no token -> watermarked PDF.
3. **Unlock** -> `POST /api/checkout` -> unlock token -> `POST /api/pdf/invoice`
   with the token -> clean PDF. Tokens are HMAC-signed and expire in 30 min.

Swapping the `StubProvider` for Stripe/YooKassa means implementing
`createCheckout` + a webhook that calls `issueUnlock(sku)`. Nothing else changes.

## Adding a new tool

1. Add an entry to a section in `src/lib/tools/registry.ts` (set `status: "live"`).
2. Add its strings to `src/lib/i18n/dictionaries.ts`.
3. Create `src/app/[locale]/tools/<slug>/page.tsx` and a UI component.
4. For a PDF output, add a template in `src/lib/pdf/` and an API route that
   gates the clean version behind `verifyUnlock(token, "tool:<slug>")`.

The invoice tool is the reference implementation for all of the above.
