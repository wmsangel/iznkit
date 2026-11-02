# Переезд iznkit.com с Vercel на Cloudflare Workers

**Статус на 02.11.2026: ЗАБЛОКИРОВАН @react-pdf; путь выбран (pdf-lib) и технически подтверждён; переезд НЕ завершён.**
Ветка `cf-migration` (локально, не запушена). OpenNext-сборка работает, статика на workerd отдаёт 200,
но 18 PDF-роутов на `@react-pdf` не заводятся. Домен не тронут, прод на Vercel.

## Главный блокер: @react-pdf на Workers не едет (в отличие от izntools)
izntools/calc-tools/worldtime переехали легко — у них **нет @react-pdf**. У iznkit — 18 PDF-роутов
(`src/app/api/pdf/*`) на `@react-pdf/renderer` (счёт, счёт-фактура, УПД, ТОРГ-12, акт сверки, чек, КП, NDA,
квитанции и т.д.) — это ядро продукта.

**Корень (найден на workerd под OpenNext):**
`RuntimeError: Aborted(CompileError: WebAssembly.instantiate(): Wasm code generation disallowed by embedder)`.
@react-pdf тащит **yoga-layout** (движок флекс-раскладки), который инстанцирует WASM из байтов **в рантайме**.
Cloudflare Workers это **запрещают** (WASM — только статический импорт на сборке). Конфигом не чинится.
(Ранний пилот на голом wrangler падал раньше — на fontkit `new URL`; под OpenNext воркер стартует, но
yoga-WASM всплывает при вызове роута.)

## Решение владельца (02.11): переписать PDF на pdf-lib
Выбран вариант: убрать `@react-pdf`, переписать все 18 документов на **pure-JS pdf-lib** (работает на Workers).

### ✅ Подтверждено на workerd (go/no-go пройден)
Минимальный тест-роут с pdf-lib + `@pdf-lib/fontkit` + встраиванием NotoSans:
- **HTTP 200, валидный %PDF-1.7**, кириллица и ₽ рендерятся корректно, **без WASM-ошибок**.
- Шрифт встраивается из base64 (`src/lib/pdf2/fonts-data.ts`, NotoSans Regular+Bold, ~1.6 МБ в бандле) —
  на Workers нет файловой системы, поэтому шрифт инлайнится, а не читается с диска (как было у @react-pdf
  через `process.cwd()/public/fonts`). PDF ~640 КБ из-за полного шрифта (можно засабсетить до кириллицы+латиницы).
- Рабочий паттерн: `const d=await PDFDocument.create(); d.registerFontkit(fontkit); const f=await d.embedFont(bytes);
  page.drawText(..., {font:f}); const bytes=await d.save();` + `atob`-хелпер base64→Uint8Array.

## Что сделано в ветке cf-migration
- `@opennextjs/cloudflare` + `wrangler` + `pdf-lib` + `@pdf-lib/fontkit` установлены (`--legacy-peer-deps`:
  адаптер peer-требует Next ≥16.4.1, iznkit на 16.2.12 — izntools/calc-tools на 16.3.x делали так же, рантайм ок).
- `open-next.config.ts` (static-assets incremental cache) + `wrangler.jsonc` (`name:iznkit`, `workers_dev:false`,
  `preview_urls:false`, `nodejs_compat`, assets, self-ref) — по образцу calc-tools.
- Скрипты `cf:build` / `cf:preview` / `cf:deploy`.
- `src/lib/pdf2/fonts-data.ts` — base64 NotoSans (основа для всех документов).
- `.open-next/`, `.wrangler/` — в `.gitignore`.
- Сборка: `source ~/.nvm/nvm.sh && nvm use 22 && NEXT_PUBLIC_SITE_URL=https://iznkit.com npm run cf:build`;
  локальный прогон: `npx wrangler dev` на `.open-next/worker.js`.

## План переписывания PDF (следующие сессии)
1. **Фундамент pdf-lib** (`src/lib/pdf2/`): хелперы — встраивание шрифтов (Regular/Bold), перенос строк по ширине,
   таблицы (колонки/границы/выравнивание), деньги/формат, QR (pdf-lib `drawImage` из PNG, qrcode даёт PNG-байты).
   Это заменяет декларативную раскладку @react-pdf на императивную.
2. **По одному документу** переписывать `src/lib/pdf/*-document.tsx` (@react-pdf) → `src/lib/pdf2/*.ts` (pdf-lib),
   роут `src/app/api/pdf/*/route.tsx` переключать на новый билдер. Сверять PDF с текущим прод-выводом (Node) и
   прогонять на workerd. Часть — тиражом (Cursor) после 2–3 образцов.
3. Когда ВСЕ 18 роутов отдают валидный PDF на workerd — продолжить переезд (ниже).

## Инвентаризация Vercel-специфики iznkit (чистая)
- Нет `vercel.json`, нет `@vercel/*`, нет middleware-файла, нет Supabase/auth (аккаунтов нет).
- `headers()` в `next.config.ts` — security-заголовки на все роуты; **на `public/` на CF не дойдут** → нужен
  `public/_headers` (fonts, donate-svg, картинки). Урок izntools.
- Env: `NEXT_PUBLIC_SITE_URL` (каноникалы → https://iznkit.com, build-time — класть в `.env.production.local`),
  `NEXT_PUBLIC_ADSENSE_ID`/`NEXT_PUBLIC_EZOIC_ADSTXT` (опц., дефолты есть), `UNLOCK_SECRET` (серверный секрет —
  через `wrangler secret put`, не в бандл).
- Аналитика уже за гейтом хоста (`src/components/analytics.tsx`, `location.hostname==='iznkit.com'`) — на зеркалах
  не стартует; при переезде гейт сохранить (на новом хосте он же и нужен).

## Что осталось (после переписывания PDF)
- `public/_headers` (security + кэш статики), HSTS (пропадает после Vercel — вернуть в next.config + _headers).
- Деплой воркера (`cf:deploy`, OAuth владельца; автомод режет — нужно разрешение в `.claude/settings.local.json`).
- Переключение DNS — в дашборде CF (Workers → iznkit → Domains & Routes → Add Domain → iznkit.com), атомарно
  заменяет Vercel-запись. Делает владелец/с его «да». `www` → проксированный CNAME + Redirect Rule 301.
- Always Use HTTPS включает диспетчер (настройка зоны).
- После недели — `vercel git disconnect`.
- Проверка: аналитика с гейтом, каноникалы, sitemap, Search Console (адрес тот же).

## Follow-up: 3 шаблона счёта (решение владельца 02.11)
При первом переписывании invoice на pdf-lib 3 дизайн-шаблона (classic/band/minimal) временно сведены
в один. Владелец кнопками выбрал **вернуть все 3** — это user-visible функция, регрессию до переключения
DNS не допускаем. Восстановить в `src/lib/pdf2/invoice.ts` (акцент-цвет + стиль шапки по `template`),
по образцу `src/lib/pdf/invoice-templates*`/`getTemplate`. Делает владелец/я, не Cursor.
