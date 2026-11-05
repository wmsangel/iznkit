<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Хостинг и деплой

iznkit хостится на **Cloudflare Workers** (OpenNext), не на Vercel. Деплой **локальный, с мака**:

```
npm run cf:deploy
```

(`cf:deploy` = OpenNext build + deploy; прод-значения берутся из `.env.production.local`.)

**Push в GitHub НЕ деплоит** — Vercel git-интеграция отключена. Проект и последний деплой на Vercel
оставлены только для отката через DNS. Детали переезда — `research/CLOUDFLARE-MIGRATION.md`.
